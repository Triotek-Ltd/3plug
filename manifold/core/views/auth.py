from datetime import timedelta

from core.filters import GroupFilter, PermissionFilter, UserFilter
from core.models import OTP, User, UserIPAddress
from core.models.auth import RoleType
from core.permissions import HasGroupPermission, IsSuperUser
from core.serializers import (
    GroupSerializer,
    PermissionSerializer,
    UserIPAddressSerializer,
    UserSerializer,
)
from core.utils import generate_simple_password, send_custom_email
from core.utils.sms import send_sms
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout as django_logout
from django.contrib.auth.models import Group, Permission
from django.utils import timezone
from django.utils.crypto import get_random_string
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token as AuthToken
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .template import GenericViewSet


class UserGroupPermissions(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # If the user is a superuser, return "all"
        if user.is_superuser:
            return Response("all")

        # Get all groups the user belongs to
        groups = user.groups.all()

        # Initialize a set to store unique permissions
        user_permissions = set()

        # Loop through each group to get the permissions
        for group in groups:
            permissions = group.permissions.all()  # Get all permissions for the group
            user_permissions.update(perm.codename for perm in permissions)

        # Return the list of all unique permissions
        return Response(list(user_permissions))


class GroupViewSet(GenericViewSet):
    """
    A simple viewset for viewing and editing user groups.
    Only accessible by admins or users with sufficient permissions.
    """

    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    filterset_class = GroupFilter
    permission_classes = [IsSuperUser, HasGroupPermission]


class PermissionViewSet(GenericViewSet):
    """
    A viewset for viewing and editing user permissions.
    Only accessible by superusers.
    """

    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    filterset_class = PermissionFilter
    permission_classes = [IsSuperUser, HasGroupPermission]


class ResendOTPView(APIView):
    def post(self, request):
        username = request.data.get("username")

        try:
            user = User.objects.get(username=username)
            otp_instance = OTP.objects.get(user=user, is_active=False)

            # Check if the OTP was sent recently
            cooldown_period = timedelta(minutes=5)
            if timezone.now() - otp_instance.created_at < cooldown_period:
                return Response(
                    {"error": "You can only request a new OTP after 5 minutes."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Generate and update the OTP code
            otp_code = get_random_string(length=6, allowed_chars="0123456789")
            otp_instance.otp_code = otp_code
            otp_instance.save()

            # Send OTP via SMS and Email
            if user.phone:
                send_sms(
                    user.phone,
                    message=f"Hi there! Your OTP code for verification is {otp_code}. Please use this code to complete your login process.",
                )

            subject = "Resend OTP"
            template_name = "email/otp.html"
            context = {
                "name": user.first_name if user.first_name else "User",
                "email": user.email,
                "otp_code": otp_code,
            }
            recipient_list = [user.email]
            send_custom_email(subject, template_name, context, recipient_list)

            return Response(
                {"username": user.username},
                status=status.HTTP_200_OK,
            )

        except User.DoesNotExist:
            return Response(
                {"error": "User not found."}, status=status.HTTP_400_BAD_REQUEST
            )
        except OTP.DoesNotExist:
            return Response(
                {"error": "No inactive OTP found for this user."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        user = request.user
        data = request.data
        try:
            # Update basic user fields
            user.first_name = data.get("first_name", user.first_name)
            user.last_name = data.get("last_name", user.last_name)
            user.email = data.get("email", user.email)
            user.bio = data.get("bio", user.bio)
            user.phone = data.get("phone", user.phone)
            user.location = data.get("location", user.location)
            user.profile_picture = data.get("profile_picture", user.profile_picture)
            user.birthdate = data.get("birthdate", user.birthdate)
            user.timezone = data.get("timezone", user.timezone)
            user.full_name = data.get("full_name", user.full_name)
            user.branch = data.get("branch", user.branch)

            # Handle password separately
            password = data.get("password")
            if password:
                user.set_password(password)

            user.save()
            return Response(
                {"message": "Profile updated successfully"}, status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        user = request.user
        data = request.data
        try:
            # Update only fields that are provided
            if "first_name" in data:
                user.first_name = data["first_name"]
            if "last_name" in data:
                user.last_name = data["last_name"]
            if "email" in data:
                user.email = data["email"]
            if "bio" in data:
                user.bio = data["bio"]
            if "phone" in data:
                user.phone = data["phone"]
            if "location" in data:
                user.location = data["location"]
            if "profile_picture" in data:
                user.profile_picture = data["profile_picture"]
            if "birthdate" in data:
                user.birthdate = data["birthdate"]
            if "timezone" in data:
                user.timezone = data["timezone"]
            if "full_name" in data:
                user.full_name = data["full_name"]
            if "branch" in data:
                user.branch = data["branch"]

            # Handle password separately
            if "password" in data:
                password = data["password"]
                user.set_password(password)

            user.save()
            return Response(
                {"message": "Profile updated successfully"}, status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        username = request.data["username"]
        password = request.data["password"]
        user = authenticate(username=username, password=password)
        if user is not None:
            token, created = AuthToken.objects.get_or_create(user=user)
            login(request, user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        return Response(
            {"error": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST
        )


class OTPActivationView(APIView):
    def post(self, request):
        otp_code = request.data["otp"]
        try:
            otp = OTP.objects.get(otp_code=otp_code, is_active=False)
            otp.is_active = True
            otp.save()
            user = otp.user

            token, created = AuthToken.objects.get_or_create(user=user)

            login(request, user)

            return Response({"token": token.key}, status=status.HTTP_200_OK)
        except OTP.DoesNotExist:
            return Response(
                {"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST
            )


class LogoutView(APIView):
    def post(self, request):
        django_logout(request)
        return Response(
            {"detail": "Logged out successfully."}, status=status.HTTP_200_OK
        )


class UserViewSet(GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filterset_class = UserFilter
    permission_classes = [HasGroupPermission]

    def create(self, request):
        try:
            data = request.data
            # Generate a random password if not provided
            if "password" not in data:
                password = generate_simple_password()
                data["password"] = password
            else:
                password = data["password"]

            role = data.get("role")

            # Create the user instance but do not save it yet
            user = User(
                username=data["username"],
                email=data["email"],
                first_name=data.get("first_name", ""),
                last_name=data.get("last_name", ""),
                role=role,
                phone=data.get("phone", ""),
            )

            # Hash the password
            user.set_password(password)

            user.full_clean()  # Validate the data before saving
            user.save()

            # Send a welcome email
            subject = "Welcome to Our Platform"
            template_name = "email/welcome.html"
            context = {
                "name": user.first_name or "User",
                "username": user.username,
                "email": user.email,
                "password": password,
            }
            try:
                recipient_list = [user.email]
                send_custom_email(subject, template_name, context, recipient_list)

                # Send SMS if a phone number is provided
                if user.phone:
                    message = f"Welcome, {user.first_name or user.username}! Your account has been created. Your login credentials are Username: {user.username}, Password: {password}"
                    send_sms(user.phone, message)
            except Exception as e:
                print(f"Failed to send email or SMS: {str(e)}")

            serializer = self.get_serializer(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop("partial", False)
            instance = self.get_object()
            serializer = self.get_serializer(
                instance, data=request.data, partial=partial
            )
            serializer.is_valid(raise_exception=True)

            # Update the user data
            self.perform_update(serializer)

            # If a new password is provided, hash it and update the instance
            if "password" in request.data:
                instance.set_password(request.data["password"])
                instance.save()

            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserIPAddressViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserIPAddressSerializer

    def get_queryset(self):
        user = self.request.user
        return UserIPAddress.objects.filter(user=user).distinct()


class UserGetViewSet(APIView):
    def get(self, request):
        userid = request.query_params.get("user")
        try:
            # Fetch the user using the primary key (username in this case)
            user = User.objects.get(id=userid)

            # Serialize the user data
            serializer = UserSerializer(user)

            # Return serialized data as response
            return Response(serializer.data, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
