# from core.models.user_role import Role, UserRole, Permission
from core.models import *
from django.contrib import admin

# from core.models.reminder import Reminder
from django.contrib.auth.models import Permission

admin.site.register([User, App, Document, Permission, Module, UserIPAddress])
