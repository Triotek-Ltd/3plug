# permissions.py
from rest_framework.permissions import BasePermission


class IsSuperUser(BasePermission):
    """
    Custom permission to only allow superusers to access the view.
    """

    def has_permission(self, request, view):
        return True
        # return request.user and request.user.is_superuser


class HasGroupPermission(BasePermission):
    """
    Custom permission to check if the user belongs to a group and has the correct default Django permission
    for the current action on the current model. Superusers are granted access to everything.
    """

    def has_permission(self, request, view):
        if request.user and request.user.is_superuser:
            return True

        if not request.user or not request.user.is_authenticated:
            return False

        action = view.action

        permission_map = {
            "list": "view",
            "retrieve": "view",
            "create": "add",
            "update": "change",
            "partial_update": "change",
            "destroy": "delete",
        }

        model = view.queryset.model

        permission_type = permission_map.get(action)
        if permission_type == "view":
            return True
        if permission_type:
            permission = (
                f"{model._meta.app_label}.{permission_type}_{model._meta.model_name}"
            )
            if request.user.groups.exists() and request.user.has_perm(permission):
                return True

        return False
