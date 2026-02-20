# core/models/user_role.py
from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()  # Get the user model


class Role(models.Model):
    name = models.CharField(max_length=250, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class UserRole(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    assigned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.role.name}"


class Permission(models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    can_view_documents = models.BooleanField(default=False)
    can_edit_documents = models.BooleanField(default=False)
    can_delete_documents = models.BooleanField(default=False)

    def __str__(self):
        return f"Permissions for {self.role.name}"
