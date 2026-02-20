import os
import re
from typing import Any, Dict, List

from ...utils.text import to_snake_case, to_titlecase_no_space
from .models.field_mappings import get_field_type
from .models.json_loader import load_json_file
from .models.reserved_keywords import reserved_keywords


def rename_reserved_keywords(field_id: str) -> str:
    """
    Rename field ID if it is a reserved keyword.

    Args:
        field_id (str): The original field ID.

    Returns:
        str: The renamed field ID if it was a reserved keyword, otherwise the original field ID.
    """
    return reserved_keywords.get(field_id, field_id)


def sanitize_field_name(field_id: str) -> str:
    """
    Sanitize the field name to ensure it is a valid Python variable name.
    - Replace invalid characters with underscores.
    - Prefix with an underscore if the name starts with a digit.

    Args:
        field_id (str): The original field ID.

    Returns:
        str: The sanitized field name.
    """
    sanitized = re.sub(r"\W|^(?=\d)", "_", field_id)
    return sanitized


def load_fields(folder_path: str, doc_name: str) -> List[Dict[str, Any]]:
    """
    Load fields from doc_name.json.

    Args:
        folder_path (str): The path to the folder containing the JSON file.
        doc_name (str): The name of the document (without .json extension).

    Returns:
        List[Dict[str, Any]]: A list of fields loaded from the JSON file.
    """
    model_file_path = os.path.join(folder_path, f"{doc_name}.json")

    field_list = []

    if os.path.exists(model_file_path):
        model_data = load_json_file(model_file_path)
        field_list = model_data.get("fields", [])
    else:
        return []

    return field_list


def write_serializers_header(
    module_file: Any,
    app_name: str,
    module_name: str,
    model_name: str,
    doc_name: str,
    related_fields: Dict[str, Dict[str, Any]],
) -> None:
    """
    Write the imports for the serializers at the top of the file.
    Only import serializers for related models that are not the same as the current model.

    Args:
        module_file (Any): The file object to write to.
        app_name (str): The name of the app.
        module_name (str): The name of the module.
        model_name (str): The name of the model.
        doc_name (str): The name of the document.
        related_fields (Dict[str, Dict[str, Any]]): A dictionary of related fields.
    """
    # Start with basic imports
    module_file.write(
        f"from rest_framework import serializers\n"
        f"from core.serializers.template import RelationshipHandlerMixin\n"
    )

    # Import the main model for the current serializer
    module_file.write(
        f"from {app_name}.models.{module_name}.{doc_name} import {model_name}\n\n"
    )


def write_meta_class(
    module_file: Any, model_name: str, related_fields: Dict[str, Dict[str, Any]]
) -> None:
    """
    Write the Meta class, including related fields, for the serializer.

    Args:
        module_file (Any): The file object to write to.
        model_name (str): The name of the model.
        related_fields (Dict[str, Dict[str, Any]]): A dictionary of related fields.
    """
    module_file.write("    class Meta:\n")
    module_file.write(f"        model = {model_name}\n")
    module_file.write("        fields = '__all__'\n")


def process_field(
    field: Dict[str, Any], model_name: str, current_doc_name: str
) -> Dict[str, Dict[str, Any]]:
    """
    Process a single field and return its related field definition if applicable.
    Handles nested representation for self-referencing fields, ManyToManyField, and OneToOneField relationships.

    Args:
        field (Dict[str, Any]): The field to process.
        model_name (str): The name of the model.
        current_doc_name (str): The name of the current document.

    Returns:
        Dict[str, Dict[str, Any]]: A dictionary of related fields.
    """
    if not isinstance(field, dict):
        raise ValueError(f"Invalid field format: {field}. Expected a dictionary.")

    # Rename and sanitize the field name
    raw_field_id = field.get("fieldname", "")
    field_id = sanitize_field_name(
        rename_reserved_keywords(to_snake_case(raw_field_id).lower())
    )
    field_type = get_field_type(field.get("fieldtype", ""))
    related_fields = {}

    # Skip fields ending with '_id' or named 'id'
    if field_id.endswith("_id") or field_id == "id":
        return related_fields

    if field_type in ["Link", "ForeignKey", "ManyToManyField", "OneToOneField"]:
        related_model = field.get("options", "")
        if not related_model:
            raise ValueError(
                f"Field {field_id} has a '{field_type}' type but no related model specified."
            )

        # Determine the serializer name for the related model
        serializer_name = f"{to_titlecase_no_space(related_model)}Serializer"
        related_fields[field_id] = {
            "model": related_model,
            "serializer": serializer_name,
            "many": False,  # Default for relationships
        }

        # Update the 'many' property for ManyToManyField relationships
        if field_type == "ManyToManyField":
            related_fields[field_id]["many"] = True

        # Add special handling for OneToOneField relationships
        if field_type == "OneToOneField":
            related_fields[field_id]["one_to_one"] = True

    return related_fields


def write_serializer(
    module_file: Any,
    app_name: str,
    module_name: str,
    model_name: str,
    doc_name: str,
    doc_folder_path: str,
) -> None:
    """
    Generate and write a single serializer class for the given model, focusing on related fields.
    Use SerializerMethodField for self-referencing fields and declare related fields before Meta.

    Args:
        module_file (Any): The file object to write to.
        app_name (str): The name of the app.
        module_name (str): The name of the module.
        model_name (str): The name of the model.
        doc_name (str): The name of the document.
        doc_folder_path (str): The path to the folder containing the document.
    """
    load_fields(doc_folder_path, doc_name)

    related_fields = {}

    # Write imports
    write_serializers_header(
        module_file, app_name, module_name, model_name, doc_name, related_fields
    )

    # Start defining the main serializer class
    module_file.write(
        f"class {model_name}Serializer(RelationshipHandlerMixin, serializers.ModelSerializer):\n\n"
    )

    # Write the Meta class for the serializer
    write_meta_class(module_file, model_name, related_fields)
