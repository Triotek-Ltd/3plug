# serializers.py
from core.models import OTP, Branch, User, UserIPAddress
from django.contrib.auth.models import Group, Permission
from rest_framework import serializers


class UserIPAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserIPAddress
        fields = ["ip_address", "timestamp"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class OTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTP
        fields = "__all__"


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = "__all__"


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = "__all__"
