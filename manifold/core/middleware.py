from threading import local

from django.conf import settings
from django.core.cache import cache
from django.db import connections
from django.utils import timezone
from django.utils.deprecation import MiddlewareMixin
from rest_framework.authentication import (
    BasicAuthentication,
    SessionAuthentication,
    TokenAuthentication,
)
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.request import Request

from .models import UserIPAddress

import os
import json
from pathlib import Path
from django.conf import settings

_request_local = local()

def get_current_request_user():
    return getattr(_request_local, 'user', None)


class UserActivityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Wrap the Django request with DRF's Request
        drf_request = Request(request)

        # Authenticate user for API requests using DRF authentication classes
        if not request.user.is_authenticated:
            self.authenticate_user(drf_request)

        # Get user's IP address
        ip_address = self.get_client_ip(request)

        # If user is authenticated (either via session or API token)
        if request.user and request.user.is_authenticated:
            # Update last activity timestamp
            request.user.last_activity = timezone.now()
            request.user.save()
            _request_local.user = request.user

            # Log the unique IP address
            self.log_user_ip(request.user, ip_address)

        # Proceed with the response
        response = self.get_response(request)

        return response

    def authenticate_user(self, request):
        """Attempt to authenticate the user using DRF's authentication classes."""
        user = None
        # Use DRF authentication methods to attempt authentication
        auth_classes = [
            BasicAuthentication(),
            SessionAuthentication(),
            TokenAuthentication(),
        ]
        for auth_class in auth_classes:
            try:
                user_auth_tuple = auth_class.authenticate(request)
                if user_auth_tuple is not None:
                    user, _ = user_auth_tuple
                    request.user = user
                    break
            except AuthenticationFailed:
                continue  # If one authentication method fails, move to the next

    def get_client_ip(self, request):
        """Extract the client's IP address from the request."""
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[0]
        else:
            ip = request.META.get("REMOTE_ADDR")
        return ip

    def log_user_ip(self, user, ip_address):
        """Log the user's IP address if it hasn't been logged before."""
        UserIPAddress.objects.get_or_create(user=user, ip_address=ip_address)


class TenantMiddleware(MiddlewareMixin):
    def process_request(self, request):
        """Determine the tenant's database and set it in the request context."""
        tenant_name = request.headers.get("X-Tenant")
        tenant_name = get_tenant_from_url(tenant_name)

        # If no tenant name is provided, use the default database
        if not tenant_name or tenant_name not in settings.DATABASES:
            request.tenant_db = "default"  # Default to main database
            request.allowed_apps = settings.INSTALLED_APPS  # Default access
            return

        # Set the tenant database context in the request
        request.tenant_db = tenant_name

        # Optionally, set allowed apps if needed (if you have a list for each tenant)
        # request.allowed_apps = settings.TENANT_APPS.get(tenant_name, settings.INSTALLED_APPS)

        # Store the tenant's database info in the cache for later use in the router
        cache.set(f"tenant_db", tenant_name, timeout=300)  # Cache for 5 minutes

        # Switch to the tenant's database connection
        connections["default"].close()
        connections[tenant_name] = connections[tenant_name]


def get_tenant_from_url(url):
    sites_path = Path(settings.SITE_PATH)
    
    if not sites_path.exists():
        return None
    
    for site_folder in sites_path.iterdir():
        if site_folder.is_dir():
            config_file = site_folder / "site_config.json"
            if config_file.exists():
                with open(config_file, "r") as f:
                    try:
                        config = json.load(f)
                        if "domains" in config and url in config["domains"]:
                            return config.get("site_name")
                    except json.JSONDecodeError:
                        print(f"Error decoding JSON in {config_file}")
    
    return None  # No match found
