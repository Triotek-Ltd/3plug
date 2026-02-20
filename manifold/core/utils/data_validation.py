from datetime import datetime

from django.core.exceptions import ValidationError
from django.db.models import (
    BooleanField,
    CharField,
    DateField,
    DateTimeField,
    DecimalField,
    EmailField,
    FloatField,
    IntegerField,
    TextField,
    TimeField,
    URLField,
    UUIDField,
)
from rest_framework import serializers


# Function to validate and convert a datetime string (ISO 8601 format)
def validate_and_convert_datetime(date_str):
    try:
        # Try parsing the date string with the expected format
        return datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        try:
            # Try parsing the date string with the ISO 8601 format
            return datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        except ValueError:
            raise ValidationError(
                f"Invalid datetime format: {date_str}. Expected format: YYYY-MM-DD HH:MM:SS or ISO 8601 format."
            )


# Function to validate and convert a date string from any format
def validate_and_convert_date(date_str):
    formats = [
        "%Y-%m-%d",  # Standard format: 2025-01-23
        "%d-%m-%Y",  # European format: 23-01-2025
        "%m/%d/%Y",  # US format: 01/23/2025
        "%d %b %Y",  # Short month name: 23 Jan 2025
        "%d %B %Y",  # Full month name: 23 January 2025
        "%Y/%m/%d",  # Alternative ISO-like: 2025/01/23
        "%Y.%m.%d",  # Dotted format: 2025.01.23
        "%Y-%m-%dT%H:%M:%S.%fZ",  # ISO 8601 with microseconds and 'Z'
        "%Y-%m-%dT%H:%M:%S",  # ISO 8601 without microseconds
    ]

    for fmt in formats:
        try:
            # Try parsing with the current format
            return datetime.strptime(date_str, fmt).date()
        except ValueError:
            continue  # Try the next format

    # If all formats fail, raise a validation error
    raise ValidationError(f"Invalid date format: {date_str}. Unable to parse.")


# Function to validate and convert a time string (HH:MM:SS)
def validate_and_convert_time(time_str):
    try:
        # Parse the time string
        return datetime.strptime(time_str, "%H:%M:%S").time()
    except ValueError:
        raise ValidationError(
            f"Invalid time format: {time_str}. Expected format: HH:MM:SS."
        )


# Function to validate and convert an integer value
def validate_and_convert_integer(value):
    try:
        return int(value)
    except (ValueError, TypeError):
        raise ValidationError(
            f"Invalid integer: {value}. Please enter a valid integer."
        )


# Function to validate and convert a float value
def validate_and_convert_float(value):
    try:
        return float(value)
    except (ValueError, TypeError):
        raise ValidationError(f"Invalid float: {value}. Please enter a valid float.")


# Function to validate and convert a boolean value
def validate_and_convert_boolean(value):
    if isinstance(value, bool):
        return value
    if value in ["true", "True", "1"]:
        return True
    if value in ["false", "False", "0"]:
        return False
    raise ValidationError(
        f"Invalid boolean value: {value}. Please enter a valid boolean (true/false)."
    )


# Function to validate and convert a string value (simply returns the string)
def validate_and_convert_string(value):
    if not isinstance(value, str):
        raise ValidationError(f"Invalid string: {value}. Please enter a valid string.")
    return value


# Function to validate model data
def validate_model_data(instance):
    """
    Validate the data of the model instance before saving.
    """
    for field in instance._meta.get_fields():
        value = getattr(instance, field.name, None)
        if value:
            if isinstance(field, DateTimeField):
                validate_and_convert_datetime(value)
            elif isinstance(field, DateField):
                validate_and_convert_date(value)
            elif isinstance(field, TimeField):
                validate_and_convert_time(value)
            elif isinstance(field, IntegerField):
                validate_and_convert_integer(value)
            elif isinstance(field, FloatField):
                validate_and_convert_float(value)
            elif isinstance(field, BooleanField):
                validate_and_convert_boolean(value)
            elif isinstance(field, (CharField, TextField)):
                validate_and_convert_string(value)
            elif isinstance(field, EmailField):
                validate_and_convert_string(
                    value
                )  # Assuming string validation is enough
            elif isinstance(field, URLField):
                validate_and_convert_string(
                    value
                )  # Assuming string validation is enough
            elif isinstance(field, UUIDField):
                validate_and_convert_string(
                    value
                )  # Assuming string validation is enough
            elif isinstance(field, DecimalField):
                validate_and_convert_float(value)  # Assuming float validation is enough


# Function to validate serializer data
def validate_serializer_data(serializer, serializer_data):
    """
    Validate the data in the serializer and update it in place.

    Args:
        serializer (Serializer): The serializer instance containing data and field definitions.

    Returns:
        Serializer: The updated serializer with validated data.
    """
    validated_data = serializer_data
    for field_name, field in serializer.fields.items():
        value = validated_data.get(field_name, None)

        if value is not None:
            # Perform validation based on the field type
            if isinstance(field, serializers.DateTimeField):
                validated_data[field_name] = validate_and_convert_datetime(value)
            elif isinstance(field, serializers.DateField):
                validated_data[field_name] = validate_and_convert_date(value)
            elif isinstance(field, serializers.TimeField):
                validated_data[field_name] = (
                    validate_and_convert_time(value) if value else "00:00:00"
                )
            elif isinstance(field, serializers.IntegerField):
                validated_data[field_name] = (
                    validate_and_convert_integer(value) if value else 0
                )
            elif isinstance(field, serializers.FloatField):
                validated_data[field_name] = (
                    validate_and_convert_float(value) if value else 0.0
                )
            elif isinstance(field, serializers.BooleanField):
                validated_data[field_name] = validate_and_convert_boolean(value)
            elif isinstance(field, serializers.CharField):  # Includes all string fields
                validated_data[field_name] = validate_and_convert_string(value)
            elif isinstance(field, serializers.EmailField):
                validated_data[field_name] = validate_and_convert_string(value)
            elif isinstance(field, serializers.URLField):
                validated_data[field_name] = validate_and_convert_string(value)
            elif isinstance(field, serializers.UUIDField):
                validated_data[field_name] = validate_and_convert_string(value)
            elif isinstance(field, serializers.DecimalField):
                validated_data[field_name] = (
                    validate_and_convert_float(value) if value else 0.0
                )

    return serializer
