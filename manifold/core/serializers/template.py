from datetime import date, datetime, time

from django.db.models import Model
from django.db.models.fields.related import ForeignKey, ManyToManyField, OneToOneField
from django.forms.models import model_to_dict
from django.utils.dateparse import parse_date, parse_datetime, parse_time
from rest_framework import serializers


class RelationshipHandlerMixin(serializers.ModelSerializer):
    """
    Mixin to handle dynamic related fields serialization and deserialization.
    - Handles list and detail views differently for related fields.
    - Allows creation and update of related objects dynamically.
    """

    def validate(self, data):
        """
        Validate and modify field names that end with '_id' or are 'id' to append '_custom'.
        """
        modified_data = {}
        for field_id, value in data.items():
            if field_id.endswith("_id") or field_id == "id":
                field_id = f"{field_id}_custom"
            modified_data[field_id] = value

        return super().validate(modified_data)

    def is_valid(self, raise_exception=False):
        self._validated_data = self.initial_data
        self._errors = {}
        return True

    def _get_or_create_related_objects(self, data, model, many=False):
        """
        Fetch or create related objects based on the input data.
        Handles both dictionaries with 'id' and direct integer IDs, as well as nested dictionaries and lists of related objects.
        """
        # If it's a Many-to-Many relationship, ensure the data is a
        if many:
            for field_name, field_value in data.items():
                if not isinstance(field_value, list):
                    raise serializers.ValidationError(
                        f"Expected a list for field '{model.__name__}', but got {type(field_value).__name__}."
                    )
                return [
                    self._get_or_create_related_objects({field_name: item}, model)
                    for item in field_value
                ]

        for field_name, field_value in data.items():
            if isinstance(field_value, dict):
                related_model = self._get_related_model_for_field(model, field_name)

                if related_model:
                    # If related object has an ID, handle it as update, else create
                    if "id" in field_value:
                        # Update existing related object
                        data[field_name] = self._get_or_create_related_objects(
                            field_value, related_model
                        )
                    else:
                        # Create a new related object
                        data[field_name] = self._get_or_create_related_objects(
                            field_value, related_model
                        )

            elif isinstance(field_value, list):
                related_model = self._get_related_model_for_field(model, field_name)

                if related_model:
                    data[field_name] = [
                        self._get_or_create_related_objects(item, related_model)
                        for item in field_value
                    ]
            else:
                related_model = self._get_related_model_for_field(model, field_name)
                if related_model:
                    obj = related_model.objects.get(pk=field_value)
                    return obj

        if hasattr(self, "instance") and self.instance:
            # Update the instance if it's an existing instance (update operation)
            return self._update_instance(data, model)
        else:
            # Create a new instance if it's a new instance (create operation)
            return self._create_instance(data, model)

    def _get_related_model_for_field(self, model, field_name):
        """
        Helper function to extract the related model dynamically from a related field (ForeignKey, OneToOneField, ManyToManyField).
        This function is invoked based on the field name.
        """
        try:
            # Get the field by name and check if it is a related field
            field = model._meta.get_field(field_name)

            # If the field is a related field (ForeignKey, OneToOneField, or ManyToManyField), return the related model
            if isinstance(field, (ForeignKey, OneToOneField, ManyToManyField)):
                return field.related_model
        except Exception as e:
            raise serializers.ValidationError(
                f"Error while getting related model for field '{field_name}': {str(e)}"
            )

        return None  # Return None if no related model is found

    def _create_instance(self, data, model):
        """
        Create a new instance of the model with the provided data, or return the existing one if it has an ID.
        """
        try:
            # Check if the 'id' field exists in data
            if "id" in data:
                # If 'id' exists, try to fetch the existing object
                obj = model.objects.filter(pk=data["id"]).first()
                if obj:
                    # If the object exists, return the existing object
                    return obj
                else:
                    # If the object doesn't exist, raise an error
                    raise serializers.ValidationError(
                        f"{model.__name__} with ID {data['id']} does not exist."
                    )

            # If no 'id' field, create a new instance
            return model.objects.create(**data)

        except Exception as e:
            raise serializers.ValidationError(
                f"Error creating or fetching {model.__name__} instance: {str(e)}"
            )

    def _update_instance(self, data, model):
        """
        Update the existing instance with the provided data.
        """
        try:
            # Use the instance (already fetched) to update it with new data
            for attr, value in data.items():
                setattr(self.instance, attr, value)
            self.instance.save()
            return self.instance
        except Exception as e:
            raise serializers.ValidationError(
                f"Error updating {model.__name__} instance: {str(e)}"
            )

    def handle_related_fields(self, validated_data):
        """
        Handle creation or retrieval of related fields dynamically.
        """
        related_fields = getattr(self.Meta, "related_fields", {})
        related_instances = {}

        for field_name, model_config in related_fields.items():
            field_data = validated_data.pop(field_name, None)
            if field_data is None:
                continue

            # model = model_config['model']
            model = getattr(self.Meta, "model")
            many = model_config.get("many", False)

            field_data = {field_name: field_data}

            related_instances[field_name] = self._get_or_create_related_objects(
                field_data, model, many
            )

        return validated_data, related_instances

    def clean_field_types(self, data):
        """
        Convert fields of type `time`, `date`, `datetime`, or `duration` to Django-compatible formats.
        """
        for field in self.Meta.model._meta.get_fields():
            field_name = field.name

            # Skip fields not in data or fields set to None
            if field_name not in data or data[field_name] is None:
                continue

            value = data[field_name]

            if isinstance(field, (ManyToManyField, ForeignKey, OneToOneField)):
                continue  # Skip relationship fields here

            # Handle datetime fields
            if field.get_internal_type() == "DateTimeField":
                data[field_name] = self._parse_datetime(value)

            # Handle date fields
            elif field.get_internal_type() == "DateField":
                data[field_name] = self._parse_date(value)

            # Handle time fields
            elif field.get_internal_type() == "TimeField":
                data[field_name] = self._parse_time(value)

        return data

    def _parse_datetime(self, value):
        """
        Parse a datetime value into a Python datetime object or return the value unchanged if already correct.
        """
        if isinstance(value, datetime):
            return value
        if isinstance(value, str):
            parsed_value = parse_datetime(value)
            if not parsed_value:
                raise serializers.ValidationError(f"Invalid datetime format: '{value}'")
            return parsed_value
        raise serializers.ValidationError(
            f"Unexpected type for datetime: {type(value).__name__}"
        )

    def _parse_date(self, value):
        """
        Parse a date value into a Python date object or return the value unchanged if already correct.
        """
        if isinstance(value, date):
            return value
        if isinstance(value, str):
            parsed_value = parse_date(value)
            if not parsed_value:
                raise serializers.ValidationError(f"Invalid date format: '{value}'")
            return parsed_value
        raise serializers.ValidationError(
            f"Unexpected type for date: {type(value).__name__}"
        )

    def _parse_time(self, value):
        """
        Parse a time value into a Python time object or return the value unchanged if already correct.
        """
        if isinstance(value, time):
            return value
        if isinstance(value, str):
            parsed_value = parse_time(value)
            if not parsed_value:
                raise serializers.ValidationError(f"Invalid time format: '{value}'")
            return parsed_value
        raise serializers.ValidationError(
            f"Unexpected type for time: {type(value).__name__}"
        )

    # def create(self, validated_data):
    #     validated_data = self.clean_field_types(validated_data)
    #     validated_data, related_instances = self.handle_related_fields(validated_data)

    #     instance = super().create(validated_data)

    #     for field_name, related_instance in related_instances.items():
    #         if isinstance(related_instance, list):
    #             getattr(instance, field_name).set(related_instance)
    #         else:
    #             setattr(instance, field_name, related_instance)

    #     instance.save()
    #     return instance

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        related_fields = getattr(self.Meta, "related_fields", {})
        is_list_view = self.context.get("is_list_view", False)

        for field_name, field_config in related_fields.items():
            if field_name in ret:
                value = getattr(instance, field_name, None)
                model = field_config["model"]
                many = field_config.get("many", False)

                if value is None:
                    ret[field_name] = [] if many else None
                elif is_list_view:
                    if many:
                        ret[field_name] = (
                            [obj.id for obj in value.all()] if value else []
                        )
                    else:
                        ret[field_name] = value.id if value else None
                else:
                    if many:
                        ret[field_name] = (
                            self._serialize_model_objects(value.all(), model)
                            if value
                            else []
                        )
                    else:
                        ret[field_name] = (
                            self._serialize_model_object(value, model)
                            if value
                            else None
                        )

        return ret

    def _serialize_model_object(self, obj, model):
        if isinstance(obj, Model):
            obj_dict = model_to_dict(obj)
            obj_dict = {
                key: value for key, value in obj_dict.items() if value not in [None, ""]
            }
            return obj_dict
        return obj

    def _serialize_model_objects(self, objs, model):
        return [self._serialize_model_object(obj, model) for obj in objs]

    def update(self, instance, validated_data):
        validated_data = self.clean_field_types(validated_data)
        validated_data, related_instances = self.handle_related_fields(validated_data)

        # Handle updates for normal fields
        for attr, value in validated_data.items():
            if attr.endswith("_id") or attr == "id":
                attr = f"{attr}_custom"
            setattr(instance, attr, value)
        # Handle Many-to-Many or ForeignKey relationships
        for field_name, related_instance in related_instances.items():
            if isinstance(related_instance, list):
                getattr(instance, field_name).set(related_instance)
            else:
                setattr(instance, field_name, related_instance)

        instance.save()
        return instance
