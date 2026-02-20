import random
import string
import uuid

from django.conf import settings
from django.db import models
from django.core.exceptions import ValidationError


def generate_random_slug(length=10):
    characters = string.ascii_letters + string.digits
    return "".join(random.choices(characters, k=length))


def generate_by_hash():
    """Generate a random hash-based name."""
    return str(uuid.uuid4())


class BaseModel(models.Model):
    id = models.CharField(
        primary_key=True, max_length=255, default=generate_by_hash, editable=True
    )
    created = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="%(app_label)s_%(class)s_created",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="The user who created this record.",
    )
    modified = models.DateTimeField(auto_now=True)
    modified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="%(app_label)s_%(class)s_modified",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="The user who last modified this record.",
    )

    class Meta:
        abstract = True
        

class SingletonModel(BaseModel):
    id = models.AutoField(primary_key=True)
    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if not self.pk:
            if self.__class__.objects.exists():
                raise ValidationError(f"Only one instance of {self.__class__.__name__} is allowed.")
            self.pk = 1  # Force id=1 on creation

        elif self.pk != "1" and self.pk != 1:
            raise ValidationError(f"The primary key for {self.__class__.__name__} - {self.pk } must be 1.")
        
        print(self)
        super().save(*args, **kwargs)

    @classmethod
    def get_instance(cls):
        instance, created = cls.objects.get_or_create(pk=1)
        return instance



class Series(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=255)
    current = models.IntegerField(default=0)
