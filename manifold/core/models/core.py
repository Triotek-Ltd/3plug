import random
import string
import uuid

from django.db import models
from multiselectfield import MultiSelectField

from .template import BaseModel

RESERVED_KEYNAMES = ["admin", "system"]


def generate_random_slug(length=10):
    characters = string.ascii_lowercase + string.digits
    return "".join(random.choices(characters, k=length))


# Default choices for the license field and supported platforms
DEFAULT_LICENSE_CHOICES = [
    ("MIT", "MIT"),
    ("GPL-3.0", "GPL-3.0"),
    ("Apache-2.0", "Apache-2.0"),
    ("BSD", "BSD"),
    ("Custom", "Custom (Add New)"),  # Option to add a custom license
]

SUPPORTED_PLATFORMS_CHOICES = [
    ("Web", "Web"),
    ("Android", "Android"),
    ("iOS", "iOS"),
    ("Windows", "Windows"),
    ("Linux", "Linux"),
    ("MacOS", "MacOS"),
    ("Custom", "Custom (Add New)"),  # Option to add a custom platform
]


class ChangeLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    model_name = models.CharField(max_length=255)
    object_id = models.CharField(max_length=255)
    changes = models.JSONField(null=True, blank=True)  # Stores all changes as JSON
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"ChangeLog for {self.model_name} {self.object_id} at {self.timestamp}"


class AbstractApp(BaseModel):
    status = models.CharField(max_length=255, default="Active")
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    id = models.CharField(
        max_length=255,
        primary_key=True,  # Set as the primary key
        editable=False,  # Prevent manual editing
    )

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.name}"

    def save(self, *args, **kwargs):
        if not self.id:
            base_id = self.name.lower().replace(" ", "_")[:50]
            unique_id = base_id
            num = 1

            # Check if the generated ID is in the reserved key names
            while (
                unique_id in RESERVED_KEYNAMES
                or self.__class__.objects.filter(id=unique_id).exists()
            ):
                unique_id = f"{base_id[:9]}{num}"
                num += 1

            self.id = unique_id
        super(AbstractApp, self).save(*args, **kwargs)


class App(AbstractApp):
    email = models.EmailField(null=True, blank=True)

    # License field with choices and option to add custom
    license = models.CharField(
        max_length=50, choices=DEFAULT_LICENSE_CHOICES, default="MIT"
    )

    publisher = models.CharField(max_length=255, null=True, blank=True)
    app_url = models.URLField(null=True, blank=True)  # URL associated with the app

    # Additional Information
    version = models.CharField(
        max_length=50, default="1.0.0", null=True, blank=True
    )  # Version of the app
    contact_phone = models.CharField(
        max_length=20, null=True, blank=True
    )  # Optional phone number

    # MultiSelectField for supported platforms, allowing multiple selections
    supported_platforms = MultiSelectField(
        choices=SUPPORTED_PLATFORMS_CHOICES, null=True, blank=True
    )

    app_icon = models.ImageField(
        upload_to="app_icons/", null=True, blank=True
    )  # App icon (image)
    github_url = models.URLField(
        null=True, blank=True
    )  # Link to GitHub (if applicable)


class Module(AbstractApp):
    app = models.ForeignKey(App, on_delete=models.CASCADE, related_name="modules")

    def __str__(self):
        return f"{self.name} {self.app}"


class Document(AbstractApp):
    TYPE_CHOICES = [
        ("single", "Single"),
        ("list", "List"),
        ("dynamic", "Dynamic"),
    ]
    app = models.ForeignKey(App, on_delete=models.CASCADE, related_name="app")

    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name="modules")
    type = models.CharField(max_length=255, choices=TYPE_CHOICES, default="list")

    def __str__(self):
        return f"{self.name} - {self.module}"


class PrintFormat(AbstractApp):
    app = models.ForeignKey(App, on_delete=models.CASCADE, related_name="print_formats")

    module = models.ForeignKey(
        Module, on_delete=models.CASCADE, related_name="print_formats"
    )
    type = models.CharField(max_length=255, default="custom")

    def __str__(self):
        return f"{self.name} - {self.module}"


class Tenant(models.Model):
    name = models.CharField(max_length=255, unique=True)
    database_name = models.CharField(max_length=255, unique=True)
    allowed_apps = models.JSONField(default=list)  # Stores allowed apps as a list

    def __str__(self):
        return self.name
