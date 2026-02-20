import re
import uuid
from datetime import datetime

from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction

from ..models import Series

NAMING_SERIES_PATTERN = re.compile(r"^[\w\- \/.#{}]+$", re.UNICODE)


class InvalidNamingSeriesError(Exception):
    pass


class NamingManager:
    def __init__(self, instance, doctype_config):
        """
        Initialize with the model instance and doctype configuration.

        :param instance: The model instance.
        :param doctype_config: A dict containing `naming_rule` and `autoname`.
        """
        self.instance = instance
        self.config = doctype_config

    def generate_code(self, _, field_options):
        """
        Generate a barcode or QR code based on the field configuration.

        :param fieldname: The name of the field to generate code for.
        :param field_options: The specific field options from the config.
        :return: Generated code as a string.
        """
        return self.generate_by_format(field_options)

    def generate_name(self):
        """
        Generate a name based on the naming configuration.
        :return: Generated name as a string.
        """
        if self.config:
            naming_rule = self.config.get("naming_rule", "Random")
            autoname = self.config.get("autoname", "hash")

            if naming_rule == "Set by user":
                return self.instance.id

            if naming_rule == "Autoincrement":
                return self.generate_autoincrement()

            if naming_rule.startswith("By fieldname"):
                fieldname = autoname.split(":", 1)[1].strip()
                return self.generate_by_field(fieldname)

            if naming_rule == 'By "Naming Series" field':
                # Retrieve the series field from the instance dynamically
                fieldname = (
                    autoname.split(":", 1)[1].strip()
                    or getattr(self.instance, "naming_series", None)
                    or getattr(self.instance, "series", None)
                )

                if not fieldname:
                    # Load from docconfig fields if no series field is found
                    docconfig_fields = self.config.get("fields", [])
                    series_field = next(
                        (
                            field
                            for field in docconfig_fields
                            if field.get("fieldname") in {"series", "naming_series"}
                        ),
                        None,
                    )

                    if not series_field or not series_field.get("options"):
                        raise ValueError(
                            "No naming series field or options found in docconfig."
                        )

                    # Use the first value in the options
                    series = series_field["options"].split("\n")[0]
                else:
                    series = str(getattr(self.instance, fieldname))
                return self.generate_by_naming_series(series)

            if naming_rule == "Expression":
                return self.generate_by_format(
                    autoname[autoname.index(":") + 1 :].strip()
                )

            if naming_rule == "Expression (old style)":
                return self.generate_by_old_style_expression(autoname)

            if naming_rule == "Random":
                return self.generate_by_hash()

            if naming_rule == "By script":
                return self.generate_by_script(autoname)

            raise ValueError(f"Unsupported naming rule: {naming_rule}")

    def generate_autoincrement(self):
        return generate_autoincrement(self.instance)

    def generate_by_field(self, field_name):
        """Generate name based on the value of a specific field."""
        if not hasattr(self.instance, field_name):
            raise ValueError(f"Field '{field_name}' not found in the model.")
        return str(getattr(self.instance, field_name))

    def generate_by_series(self, series_pattern):
        """Generate name using a series pattern."""
        naming_series = NamingSeries(series_pattern)
        return naming_series.generate_next_name(self.instance)

    def generate_by_naming_series(self, series):
        """Generate a name using a naming series."""
        naming_series = NamingSeries()
        return naming_series.generate_next_name(series, self.instance)

    def generate_by_format(self, format_pattern):
        """
        Generate a name using a flexible format pattern.
        Handles tokens like {fieldname}, {MM}, {DD}, {YYYY}, {###}, and more.
        Auto-increment tokens ({###}) consider the latest instance in the database.
        """
        return generate_next_id(self.instance, format_pattern)

    def generate_by_old_style_expression(self, expression):
        """
        Generate name using an old-style expression.
        Supports format like 'PREFIX-.#####' where prefix and series are separated by a dot.
        """
        parts = expression.split(".")
        if len(parts) != 2 or not parts[1].startswith("#"):
            raise ValueError(
                "Invalid old-style expression format. Expected 'PREFIX-.#####'."
            )

        prefix = parts[0]
        series_pattern = parts[1]
        digits = series_pattern.count("#")

        # Generate the next value in the series with the prefix
        next_value = self.get_series_with_prefix(prefix, digits)
        return f"{prefix}.{next_value}"

    def get_series_with_prefix(self, prefix, digits):
        """
        Retrieve the next number in the series for the given prefix.
        Ensures unique numbering for each prefix.
        """
        with transaction.atomic():
            obj, _ = Series.objects.get_or_create(name=prefix, defaults={"current": 0})
            obj.current += 1
            obj.save()
            return str(obj.current).zfill(digits)

    def generate_by_hash(self):
        """Generate a random hash-based name."""
        return str(uuid.uuid4())

    def generate_by_script(self, script):
        """Generate a name using a script or callable."""
        if callable(script):
            return script(self.instance)
        raise ValueError("Script must be a callable")

    def get_series(self, digits):
        """Retrieve the next number in the series with the specified digits."""
        prefix = ""
        with transaction.atomic():
            obj, _ = Series.objects.get_or_create(name=prefix, defaults={"current": 0})
            obj.current += 1
            obj.save()
            return str(obj.current).zfill(digits)


class NamingSeries:
    def __init__(self):
        pass

    def validate(self, series):
        """
        Validates the provided naming series format.

        Args:
            series (str): The naming series to validate.

        Raises:
            InvalidNamingSeriesError: If the series is invalid.
        """
        if "." not in series:
            raise InvalidNamingSeriesError(
                f"Invalid naming series {series}: dot (.) missing"
            )

        if not NAMING_SERIES_PATTERN.match(series):
            raise InvalidNamingSeriesError(
                f"Special characters except '-', '#', '.', '/', '{{' and '}}' not allowed in naming series {series}"
            )

    def generate_next_name(self, series, instance):
        """
        Generate the next name based on the provided naming series and instance.

        Args:
            series (str): The naming series defining the format.
            instance: The model instance for which the name is generated.

        Returns:
            str: The next name in the series.
        """
        # Add default numeric placeholder if not present
        if "#" not in series:
            series += ".#####"

        # Validate the series format
        self.validate(series)

        # Split the series into parts and process it
        parts = series.split(".")
        return parse_naming_series(parts, instance, series)


def parse_naming_series(parts, instance, series, number_generator=None):
    if isinstance(parts, str):
        parts = parts.split(".")

    if not number_generator:
        number_generator = get_series

    name = ""
    today = datetime.now()

    # Get the model name (doctype) to ensure uniqueness per doctype
    doctype = instance._meta.model_name  # This gets the model name (lowercase)

    for part in parts:
        if part.startswith("#"):
            digits = len(part)
            name += number_generator(
                doctype, digits, series
            )  # Pass the doctype to the number generator
        elif part in ["YY", "MM", "DD", "YYYY"]:
            name += today.strftime(
                {"YY": "%y", "MM": "%m", "DD": "%d", "YYYY": "%Y"}[part]
            )
        else:
            name += str(getattr(instance, part, part))

    return name


def get_series(doctype, digits, series):
    """
    Get the next series number for a given doctype, ensuring uniqueness,
    but still keeping the original series name.

    Args:
        doctype (str): The name of the doctype (model).
        digits (int): The number of digits to pad the series number.

    Returns:
        str: The next series number with padding, keeping original name.
    """
    with transaction.atomic():
        # Keep the original series name, but make it unique by adding the doctype
        obj, _ = Series.objects.get_or_create(
            id=f"{doctype}_{series}_series",
            name=f"{doctype}_{series}_series",
            defaults={"current": 0},
        )
        obj.current += 1
        obj.save()
        return str(obj.current).zfill(digits)


def generate_autoincrement(instance):
    model = instance._meta.model
    try:
        # Get the last entry in the table based on the primary key
        last_entry = model.objects.latest("id")
        new_id = int(last_entry.id) + 1
    except ObjectDoesNotExist:
        # If there are no entries in the table, start with ID 1
        new_id = 1

    return new_id


def extract_field_and_index(token):
    """
    Extracts the field name and optional indexing/slicing from a token.
    Example: "field[-1]" -> ("field", "[-1]")
    """
    match = re.match(r"(\w+)\[([\d:-]+)\]", token)
    if match:
        return match.group(1), match.group(2)
    return token, None


def apply_indexing(value, index_str):
    """
    Applies list indexing or slicing to a value.
    """
    try:
        if isinstance(value, (list, str)):
            return eval(f"value[{index_str}]")  # Safe because value is controlled
    except (IndexError, SyntaxError, TypeError):
        pass  # Return the original value if indexing fails
    return value


def generate_next_id(instance, format_pattern):
    """
    Generate the next ID by matching the last ID to the format pattern,
    replacing placeholders with current or incremented values.
    """
    model = instance._meta.model
    try:
        last_entry = model.objects.latest("created")  # Adjust 'created' field if needed
        last_id = str(getattr(last_entry, "id", ""))
    except ObjectDoesNotExist:
        last_id = ""

    token_pattern = re.compile(r"{([^{}]+)}")
    tokens = token_pattern.findall(format_pattern)
    escaped_pattern = re.escape(format_pattern)

    for token in tokens:
        field_name, index_str = extract_field_and_index(token)
        if field_name.startswith("#"):
            token_length = len(field_name)
            escaped_pattern = escaped_pattern.replace(
                re.escape(f"{{{token}}}"), rf"(\d{{{token_length}}})"
            )
        elif any(c in field_name for c in ["Y", "m", "d", "H", "M", "S", "%"]):
            escaped_pattern = escaped_pattern.replace(
                re.escape(f"{{{token}}}"), r"(\d+)"
            )
        else:
            escaped_pattern = escaped_pattern.replace(
                re.escape(f"{{{token}}}"), r"(.*?)"
            )

    match = re.match(escaped_pattern, last_id)
    matched_values = match.groups() if match else ["_"] * len(tokens)

    result = format_pattern
    for i, token in enumerate(tokens):
        field_name, index_str = extract_field_and_index(token)

        if field_name.startswith("#"):
            try:
                last_number = int(matched_values[i])
            except ValueError:
                last_number = 0
            replacement = str(last_number + 1).zfill(len(field_name))
        elif hasattr(instance, field_name):
            value = getattr(instance, field_name, "")
            if hasattr(value, "id"):
                value = str(value.id)
            else:
                value = str(value)
            if index_str:
                value = apply_indexing(value, index_str)
            replacement = str(value)
        elif any(c in field_name for c in ["Y", "m", "d", "H", "M", "S", "%"]):
            today = datetime.today()
            replacement = today.strftime(
                field_name.replace("YYYY", "%Y")
                .replace("YY", "%y")
                .replace("MM", "%m")
                .replace("DD", "%d")
                .replace("hh", "%H")
                .replace("mm", "%M")
                .replace("ss", "%S")
            )
        else:
            replacement = matched_values[i] if matched_values[i] else f"{{{token}}}"

        result = result.replace(f"{{{token}}}", replacement, 1)

    return result
