import os
from typing import List, Dict, Any,  Optional

import json

import click
from django.conf import settings


def load_json_file(file_path: str) -> Optional[Any]:
    """
    Load JSON data from a file.

    Args:
        file_path (str): The path to the JSON file.

    Returns:
        Optional[Any]: The JSON data if successfully loaded, otherwise None.
    """
    try:
        with open(file_path, "r") as file:
            return json.load(file)
    except (json.JSONDecodeError, AttributeError, FileNotFoundError) as e:
        click.echo(f"Error reading {file_path}: {e}")
        return None

def get_public_fields(app_name: str, module_name: str, doctype_name: str, view_type: str) -> List[str]:
    """
    Retrieve public fields for a given doctype based on the view type (list or detail).

    Args:
        app_name (str): The name of the app.
        module_name (str): The name of the module.
        doctype_name (str): The name of the doctype.
        view_type (str): The type of view ('list' or 'detail').

    Returns:
        List[str]: A list of field names that are public for the specified view type.
    """
    # Construct the path to the config file
    # Get the apps path from Django settings

    config_file_path = os.path.join(
        settings.PROJECT_PATH,
        "apps",
        app_name,
        app_name,
        module_name,
        "doctype",
        doctype_name,
        f"{doctype_name}.json"
    )

    # Load the config file
    if not os.path.exists(config_file_path):
        raise FileNotFoundError(f"Config file not found at {config_file_path}")

    config: Dict[str, Any] = load_json_file(config_file_path)

    # Check if the doctype is public
    is_public = config.get("is_public", False)
    if not is_public:
        raise ValueError(f"The doctype {doctype_name} is not public.")

    # Extract fields and filter based on view type
    fields = config.get("fields", [])
    public_fields = []

    for field in fields:
        if view_type == "list" and field.get("public_in_list", False):
            public_fields.append(field["fieldname"])
        elif view_type == "detail" and field.get("public_in_detail", False):
            public_fields.append(field["fieldname"])

    return public_fields