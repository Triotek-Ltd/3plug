from core.models import App, ChangeLog, Document, Module, PrintFormat, Reminder
from core.models.auth import RoleType
from core.models.core import DEFAULT_LICENSE_CHOICES, SUPPORTED_PLATFORMS_CHOICES
from rest_framework import serializers

from .template import RelationshipHandlerMixin


class AppSerializer(serializers.ModelSerializer):
    # Handle the MultiSelectField correctly
    supported_platforms = serializers.ListField(
        child=serializers.ChoiceField(choices=SUPPORTED_PLATFORMS_CHOICES),
        required=False,  # It's not required, since it can be null or blank
    )

    # Foreign key fields - serialized as primary key or with a nested serializer (if you want detailed info)
    publisher = serializers.CharField(required=False)
    app_url = serializers.URLField(required=False)
    version = serializers.CharField(max_length=50, required=False)
    contact_phone = serializers.CharField(required=False, max_length=20)
    email = serializers.EmailField(required=False)

    license = serializers.ChoiceField(choices=DEFAULT_LICENSE_CHOICES, required=False)
    app_icon = serializers.ImageField(required=False)
    github_url = serializers.URLField(required=False)

    # To represent the relationship with Module, we can use `PrimaryKeyRelatedField` or a custom serializer
    # In this case, I am assuming you might want to return the `Module` id in the response
    modules = serializers.PrimaryKeyRelatedField(
        queryset=Module.objects.all(), many=True, required=False
    )

    class Meta:
        model = App
        fields = "__all__"  # Include all fields defined in the model

    def create(self, validated_data):
        # Ensure we properly handle MultiSelectField if it is provided
        supported_platforms = validated_data.get("supported_platforms", [])
        if isinstance(supported_platforms, str):
            supported_platforms = supported_platforms.split(
                ","
            )  # In case it's coming as a comma-separated string

        # Handle creation logic if you need more customization
        app = App.objects.create(**validated_data)

        # Handle the platform field update correctly
        app.supported_platforms = supported_platforms
        app.save()

        return app

    def update(self, instance, validated_data):
        # Similar to `create`, we need to update the MultiSelectField and other fields
        supported_platforms = validated_data.get(
            "supported_platforms", instance.supported_platforms
        )
        if isinstance(supported_platforms, str):
            supported_platforms = supported_platforms.split(
                ","
            )  # Split string if needed

        # Update the instance with the new data
        instance.supported_platforms = supported_platforms
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = "__all__"


class DocumentSerializer(RelationshipHandlerMixin, serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = "__all__"


class PrintFormatSerializer(RelationshipHandlerMixin, serializers.ModelSerializer):
    class Meta:
        model = PrintFormat
        fields = "__all__"


class ChangeLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChangeLog
        fields = "__all__"


class ReminderSerializer(serializers.ModelSerializer):
    days = serializers.MultipleChoiceField(
        choices=Reminder.CHOICES_DAYS, required=False
    )

    class Meta:
        model = Reminder
        fields = "__all__"


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoleType
        fields = "__all__"
