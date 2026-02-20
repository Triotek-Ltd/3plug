from django.db.models.signals import post_save
from django.dispatch import receiver
from frappe_app.models.core import User as FappeUser
from core.models.auth import User
from ..middleware import get_current_request_user  

@receiver(post_save, sender=FappeUser)
def sync_with_stable_user(sender, instance, created, **kwargs):
    request_user = get_current_request_user()  # ✅ Get the current request user
    
    if not instance.new_password:
        return

    identifier = instance.username
    stable_user = None

    if identifier:
        try:
            stable_user = User.objects.get(username=identifier)
        except User.DoesNotExist:
            stable_user = None

    sync_fields = {
        "username": instance.username,
        "email": instance.email,
        "full_name": getattr(instance, "full_name", ""),
        "phone": getattr(instance, "phone", ""),
        "profile_picture": getattr(instance, "profile_picture", ""),
        "bio": getattr(instance, "bio", ""),
        "location": getattr(instance, "location", ""),
        "birthdate": getattr(instance, "birthdate", None),
        "timezone": getattr(instance, "timezone", ""),
        "branch": getattr(instance, "branch", None),
    }

    if stable_user:
        if request_user and (request_user.is_superuser or request_user.username == instance.username):
            for field, value in sync_fields.items():
                setattr(stable_user, field, value)
            if instance.new_password:
                stable_user.set_password(instance.new_password)
            stable_user.save()
            instance.new_password = None
            instance.save(update_fields=["new_password"])
    else:
        if request_user and (request_user.is_superuser or request_user.username == instance.username):
            stable_user = User(**sync_fields)
            if instance.new_password:
                stable_user.set_password(instance.new_password)
            stable_user.save()
            instance.new_password = None
            instance.save(update_fields=["new_password"])
