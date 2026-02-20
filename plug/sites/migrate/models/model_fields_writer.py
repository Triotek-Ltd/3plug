import os
from typing import Any, Dict, List, TextIO

from django.conf import settings

from ....utils.register_models import get_app_module_for_model
from ....utils.text import to_snake_case
from .reserved_keywords import reserved_keywords
from .format_duration import format_duration_default


def write_model(
    module_file: TextIO, fields: List[Dict[str, Any]], field_order: List, model_name: str, django_path: str
) -> None:
    """Main function to generate Django model fields from Frappe fields.

    Args:
        module_file (TextIO): The file object to write the model fields to.
        fields (List[Dict[str, Any]]): List of field definitions.
        model_name (str): The name of the model.
        django_path (str): The Django app path.
    """
    field_names = set()

    for field in fields:
        field_id = rename_reserved_keywords(field.get("fieldname", ""))
        
        if field_id.endswith("_id"):
            base_field_name = field_id[:-3]  # Remove '_id' from the end
            if base_field_name in field_order:
                # Rename the base field by adding 'custom_' prefix
                field_id = f"custom_{base_field_name}"

        # Skip any field that ends with '_id'
        if field_id == "id":
            field_id = f"{field_id}_custom"

        field_type = field.get("fieldtype")
        field_names.add(field_id)

        if field_type == "Select":
            write_choices_field(module_file, field, "models.CharField", max_length=255)
        elif field_type == "Link":
            write_link_field(module_file, field, model_name, django_path)
        elif field_type in ["Table", "MultiSelect", "Table MultiSelect"]:
            write_table_field(module_file, field, model_name, django_path)
        elif field_type in ["Check", "Boolean"]:
            def parse_boolean(value):
                val = str(value).strip().lower()
                return True if val in ("1", "true") else False if val in ("0", "false") else None

            write_field_declaration(
                module_file,
                field_id,
                "models.BooleanField",
                field_name=field.get("label", ""),
                default_value=parse_boolean(field.get("default"))
            )
        elif field_type == "Date":
            write_field_declaration(
                module_file,
                field_id,
                "models.DateField",
                field_name=field.get("label", ""),
                default_value=field.get("default"),
            )
        elif field_type == "Datetime":
            write_field_declaration(
                module_file,
                field_id,
                "models.DateTimeField",
                field_name=field.get("label", ""),
                default_value=field.get("default"),
            )
        elif field_type == "Int":
            write_field_declaration(
                module_file,
                field_id,
                "models.IntegerField",
                field_name=field.get("label", ""),
                default_value=int(field.get("default")) if field.get("default") else None,
            )
        elif field_type == "Float":
            write_field_declaration(
                module_file,
                field_id,
                "models.FloatField",
                field_name=field.get("label", ""),
                default_value=float(field.get("default")) if field.get("default") else None,
            )
        elif field_type in ["Currency", "Percent"]:
            write_field_declaration(
                module_file,
                field_id,
                "models.DecimalField",
                "max_digits=10, decimal_places=2",
                field_name=field.get("label", ""),
                default_value=float(field.get("default")) if field.get("default") else None,
            )
        elif field_type == "Text":
            write_field_declaration(
                module_file,
                field_id,
                "models.TextField",
                field_name=field.get("label", ""),
                default_value=field.get("default"),
            )
        elif field_type in ["Data"]:
            write_field_declaration(
                module_file,
                field_id,
                "models.CharField",
                "max_length=255",
                field_name=field.get("label", ""),
                default_value=field.get("default"),
            )
        elif field_type == "Duration":
            raw_default = field.get("default")
            duration_default = format_duration_default(raw_default) if raw_default else None

            write_field_declaration(
                module_file,
                field_id,
                "models.DurationField",
                field_name=field.get("label", ""),
                default_value=duration_default,
            )

        elif field_type in [
            "Small Text",
            "Text Area",
            "Text",
            "Long Text",
            "HTML",
            "HTML Editor",
            "Markdown Editor",
        ]:
            write_field_declaration(
                module_file,
                field_id,
                "models.TextField",
                field_name=field.get("label", ""),
                default_value=field.get("default"),
            )
        elif field_type == "Password":
            write_field_declaration(
                module_file,
                field_id,
                "models.CharField",
                "max_length=255",
                field_name=field.get("label", ""),
                default_value=field.get("default"),
            )
        elif field_type == "Phone":
            write_field_declaration(
                module_file,
                field_id,
                "models.CharField",
                "max_length=20",
                field_name=field.get("label", ""),
                default_value=field.get("default"),
            )
        elif field_type == "Rating":
            write_field_declaration(
                module_file,
                field_id,
                "models.DecimalField",
                "max_digits=2, decimal_places=1",
                field_name=field.get("label", ""),
                default_value=field.get("default"),
            )
        elif field_type == "Signature":
            write_field_declaration(
                module_file,
                field_id,
                "models.CharField",
                "max_length=255",
                field_name=field.get("label", ""),
                default_value=field.get("default"),
            )
        elif field_type in ["Attach", "Attach Image", "Image"]:
            write_field_declaration(
                module_file,
                field_id,
                "models.CharField",
                "max_length=255",
                field_name=field.get("label", ""),
                default_value=field.get("default"),
            )
        elif field_type == "JSON":
            write_field_declaration(
                module_file,
                field_id,
                "models.JSONField",
                field_name=field.get("label", ""),
                default_value=field.get("default"),
            )
        elif field_type == "Time":
            write_field_declaration(
                module_file,
                field_id,
                "models.TimeField",
                field_name=field.get("label", ""),
                default_value=field.get("default"),
            )
        elif field_type not in [
            "Section Break",
            "Column Break",
            "Tab Break",
            "Connection",
        ]:
            write_field_declaration(
                module_file,
                field_id,
                "models.CharField",
                "max_length=255",
                field_name=field.get("label", ""),
                default_value=field.get("default"),
            )


def rename_reserved_keywords(field_id: str) -> str:
    """Rename field ID if it is a reserved keyword."""
    return reserved_keywords.get(field_id, field_id)


def write_field_declaration(
    module_file: TextIO,
    field_id: str,
    field_type: str,
    extra_params: str = "",
    field_name: str = "",
    default_value: Any = None,
) -> None:
    """Writes a field declaration with optional default."""
    module_file.write(f"    {field_id} = {field_type}(")
    if extra_params:
        module_file.write(f"{extra_params}, ")
    if default_value is not None:
        module_file.write(f"default={repr(default_value)}, ")
    if field_type != "models.ManyToManyField":
        module_file.write("null=True, blank=True")
    module_file.write(")\n")


def write_choices_field(
    module_file: TextIO, field: Dict[str, Any], field_type: str, max_length: int = None
) -> None:
    """Handles Select fields with choices."""
    field_id = rename_reserved_keywords(field.get("fieldname", ""))
    choices = field.get("options", "").strip().split("\n")

    if choices:
        options_var = f"CHOICES_{field_id.upper()}"
        module_file.write(f"    {options_var} = [\n")
        for choice in choices:
            sanitized_choice = choice.replace('"', "'")
            module_file.write(
                f'        ("{sanitized_choice}", "{sanitized_choice}"),\n'
            )
        module_file.write("    ]\n")

        max_length_param = f", max_length={max_length}" if max_length else ""
        write_field_declaration(
            module_file,
            field_id,
            field_type,
            f"choices={options_var}{max_length_param}",
            field.get("label", ""),
            default_value=field.get("default"),
        )


def write_link_field(
    module_file: TextIO, field: Dict[str, Any], model_name: str, django_path: str
) -> None:
    """Handles Link fields (ForeignKey)."""
    field_id = rename_reserved_keywords(field.get("fieldname", ""))
    related_model = field.get("options")
    if not related_model:
        return

    app_name, _ = get_app_module_for_model(to_snake_case(related_model), django_path)
    related_model = "".join(
        part.capitalize() for part in related_model.replace("_", " ").split()
    )
    modela_name = "".join(
        part.capitalize() for part in field_id.replace("_", " ").split()
    )

    related_name = f"{model_name}{modela_name}"
    if app_name == "core":
        related_model = f"{app_name}.{related_model}"
    elif app_name:
        related_model = f"{app_name}_app.{related_model}" 

    write_field_declaration(
        module_file,
        field_id,
        "models.ForeignKey",
        f'"{related_model}", related_name="{related_name}", on_delete=models.CASCADE',
        field_name=field.get("label", ""),
        default_value=field.get("default"),
    )


def write_table_field(
    module_file: TextIO, field: Dict[str, Any], model_name: str, django_path: str
) -> None:
    """Handles Table fields (ManyToMany)."""
    field_id = rename_reserved_keywords(field.get("fieldname", ""))
    related_model = field.get("options")
    if not related_model:
        return

    app_name, _ = get_app_module_for_model(to_snake_case(related_model), django_path)
    related_model = "".join(
        part.capitalize() for part in related_model.replace("_", " ").split()
    )
    modela_name = "".join(
        part.capitalize() for part in field_id.replace("_", " ").split()
    )

    related_name = f"{model_name}{modela_name}"
    if app_name == "core":
        related_model = f"{app_name}.{related_model}"
    elif app_name:
        related_model = f"{app_name}_app.{related_model}"

    write_field_declaration(
        module_file,
        field_id,
        "models.ManyToManyField",
        f'"{related_model}", related_name="{related_name}"',
        field_name=field.get("label", ""),
        default_value=field.get("default"),
    )


def write_save_method(module_file: TextIO, fields: List[Dict[str, Any]]) -> None:
    """Writes the save method for barcode handling."""
    module_file.write("\n    def save(self, *args, **kwargs):\n")
    for field in fields:
        if field.get("fieldtype") == "BarcodeField":
            field_id = rename_reserved_keywords(field.get("fieldname", ""))
            module_file.write(
                f"        if not self.{field_id} or not os.path.exists(os.path.join(settings.MEDIA_ROOT, self.{field_id}.name)):\n"
            )
            module_file.write(
                f"            self = write_barcode(self, self.{field_id})\n"
            )
    module_file.write("        super().save(*args, **kwargs)\n\n")
