import os
from typing import Any, Dict, List, TextIO

from .models.json_loader import load_json_file


def write_filter_fields(
    module_file: TextIO,
    folder_path: str,
    model_name: str,
    doc_name: str,
    django_path: str,
) -> List[str]:
    """
    Write filter fields for a given model, including only filterable fields.

    Args:
        module_file (TextIO): The file object to write the filter fields to.
        folder_path (str): The path to the folder containing the JSON files.
        model_name (str): The name of the model.
        doc_name (str): The name of the document (JSON file) containing model data.
        django_path (str): The Django app path.

    Returns:
        List[str]: A list of filterable field names.
    """
    fields_file_path = os.path.join(folder_path, "fields.json")
    model_file_path = os.path.join(folder_path, f"{doc_name}.json") 
    settings_file_path = os.path.join(folder_path, "settings.json")

    field_list: List[Dict[str, Any]] = []
    settings: Dict[str, Any] = {}

    # Load fields from fields.json or doc_name.json
    if os.path.exists(fields_file_path):
        field_list = load_json_file(fields_file_path)
        # If fields.json exists, load settings.json
        if os.path.exists(settings_file_path):
            settings = load_json_file(settings_file_path)
        else:
            return []
    elif os.path.exists(model_file_path):
        # Load data from doc_name.json and extract fields and settings
        model_data = load_json_file(model_file_path)
        field_list = model_data.get("fields", [])
        settings = {k: v for k, v in model_data.items() if k != "fields"}
    else:
        module_file.write("    id = filters.NumberFilter(label='ID')\n\n")
        return ["id"]

    # If there are no fields, clear the file and write an id filter
    if not field_list:
        module_file.write("    id = filters.NumberFilter(label='ID')\n\n")
        return ["id"]

    # Always include 'id' as a filterable field
    filter_fields: List[str] = ["id"]

    # Field types to exclude from filters (non-relevant fields)
    non_filterable_types = [
        "Image",
        "File",
        "Password",
        "HTML",
        "Code",
        "Table",
        "Text",
    ]

    # Add valid filterable fields to the list
    for field in field_list:
        field_id = field.get("fieldname")
        field_type = field.get("fieldtype")
        in_filter = field.get("in_filter", 0)

        # Skip non-filterable fields
        if in_filter != 1 or field_type in non_filterable_types:
            continue

        filter_fields.append(field_id)

    # Write the filter fields to the module file
    for field in filter_fields:
        if field == "id":
            module_file.write(f"    {field} = filters.NumberFilter(label='ID')\n")
        else:
            module_file.write(
                f"    {field} = filters.CharFilter(lookup_expr='icontains', label='{field.replace('_', ' ').title()}')\n"
            )

    return filter_fields  # Return the filter fields list for use in the header


def write_filters(
    module_file: TextIO,
    app_name: str,
    module_name: str,
    model_name: str,
    doc_name: str,
    folder_path: str,
) -> None:
    """
    Write the imports and class definition header for filters.

    Args:
        module_file (TextIO): The file object to write the filter class to.
        app_name (str): The name of the Django app.
        module_name (str): The name of the module.
        model_name (str): The name of the model.
        doc_name (str): The name of the document (JSON file) containing model data.
        folder_path (str): The path to the folder containing the JSON files.
    """
    # Write imports for django_filters and the model
    module_file.write(
        f"import django_filters as filters\n"
        f"from {app_name}.models.{module_name}.{doc_name} import {model_name}\n\n"
    )

    # Write the filter class header
    module_file.write(f"class {model_name}Filter(filters.FilterSet):\n")

    # Write the filter fields dynamically
    filter_fields = write_filter_fields(
        module_file, folder_path, model_name, doc_name, app_name
    )

    # Write the Meta class at the end
    module_file.write(f"\n    class Meta:\n")
    module_file.write(f"        model = {model_name}\n")
    module_file.write(
        f"        fields = {filter_fields}\n\n"
    )  # Add the dynamically generated filter fields here
