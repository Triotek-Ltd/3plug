import json
import os
from typing import Optional, Tuple

from .config import DOCS_JSON_PATH


def register_to_model_json(
    app_id: str,
    app_name: str,
    module_id: str,
    module_name: str,
    doc_id: str,
    doc_name: str,
    django_path: str,
) -> None:
    """
    Registers a model in config/models.json grouped by app and module with unique entries.

    Args:
        app_id (str): The app's identifier.
        app_name (str): The app's display name.
        module_id (str): The module's identifier.
        module_name (str): The module's display name.
        doc_id (str): The document's identifier.
        doc_name (str): The document's display name.
        django_path (str): Path to the Django project, used to locate config/models.json.
    """
    # Load existing data if models.json exists, otherwise start with an empty list
    if os.path.exists(DOCS_JSON_PATH):
        with open(DOCS_JSON_PATH, "r") as file:
            model_entries = json.load(file)
    else:
        model_entries = []

    # Find or create the app entry
    app_entry = next((app for app in model_entries if app["id"] == app_id), None)
    if not app_entry:
        app_entry = {"id": app_id, "name": app_name, "modules": []}
        model_entries.append(app_entry)

    # Find or create the module entry
    module_entry = next(
        (mod for mod in app_entry["modules"] if mod["id"] == module_id), None
    )
    if not module_entry:
        module_entry = {"id": module_id, "name": module_name, "docs": []}
        app_entry["modules"].append(module_entry)

    # Check if the doc is already present; if not, add it
    if not any(doc["id"] == doc_id for doc in module_entry["docs"]):
        module_entry["docs"].append({"id": doc_id, "name": doc_name})

    # Write back to models.json
    with open(DOCS_JSON_PATH, "w") as file:
        json.dump(model_entries, file, indent=4)


def get_app_module_for_model(
    doc_id: str, django_path: str
) -> Tuple[Optional[str], Optional[str]]:
    """
    Retrieves the app and module names for a given model (doc_id).

    Args:
        doc_id (str): The model's document identifier.
        django_path (str): Path to the Django project, used to locate config/models.json.

    Returns:
        tuple: A tuple containing (app_id, module_id) or (None, None) if not found.
    """

    # Load models.json data
    if os.path.exists(DOCS_JSON_PATH):
        with open(DOCS_JSON_PATH, "r") as file:
            model_entries = json.load(file)
    else:
        raise FileNotFoundError(
            "models.json not found in the expected config directory."
        )

    # Search for the doc_id within the model_entries
    for app in model_entries:
        for module in app["modules"]:
            if any(doc["id"] == doc_id for doc in module["docs"]):
                return app["id"], module["id"]
    return None, None
