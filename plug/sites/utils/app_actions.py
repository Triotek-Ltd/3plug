from typing import List, Optional, Tuple

from ...utils.config import APPS_TXT_PATH, find_module_base_path
from .load_doc_config import load_existing_data


def update_apps_txt(app_name: str, remove: bool = False) -> None:
    """Update the apps.txt file by adding or removing an application name.

    Args:
        app_name (str): Name of the app to add or remove from apps.txt.
        remove (bool): Set to True to remove the app from apps.txt. Defaults to False.
    """
    with open(APPS_TXT_PATH, "r") as apps_file:
        apps = [
            app.strip()
            for app in apps_file.readlines()
            if not app.strip().startswith("#")
        ]

    if remove and app_name in apps:
        apps.remove(app_name)

    with open(APPS_TXT_PATH, "w") as apps_file:
        for app in apps:
            apps_file.write(f"{app}\n")


def find_modules(app_name: str) -> Optional[List[str]]:
    """Find modules for a given app name.

    Args:
        app_name (str): Name of the app to find modules for.

    Returns:
        Optional[List[str]]: List of module names if found, else None.
    """
    modules_file_path, _ = find_module_base_path(app_name)
    if not modules_file_path:
        update_apps_txt(app_name, remove=True)
        return None

    # Read modules from modules.txt
    with open(modules_file_path, "r") as modules_file:
        modules = [
            module.strip()
            for module in modules_file.readlines()
            if module.strip() and not module.strip().startswith("#")
        ]
    return modules


def get_name_by_id(entity_id: str, entity_type: str) -> Optional[str]:
    """
    Retrieves the name of an app, module, or document by its ID.

    Args:
        entity_id (str): The ID of the app, module, or document.
        entity_type (str): The type of entity ('app', 'module', or 'doc').

    Returns:
        Optional[str]: The name of the entity if found, else None.
    """
    if entity_type not in ["app", "module", "doc"]:
        raise ValueError("Invalid entity_type. Must be 'app', 'module', or 'doc'.")

    # Load existing data
    existing_data = load_existing_data()

    # Search for the entity
    for app_entry in existing_data:
        if entity_type == "app" and app_entry["id"] == entity_id:
            return app_entry["name"]
        if entity_type in ["module", "doc"]:
            for module_entry in app_entry.get("modules", []):
                if entity_type == "module" and module_entry["id"] == entity_id:
                    return module_entry["name"]
                if entity_type == "doc":
                    for doc_entry in module_entry.get("docs", []):
                        if doc_entry["id"] == entity_id:
                            return doc_entry["name"]
    return None


def get_doc_details(
    doc_identifier: str,
) -> Optional[Tuple[Optional[str], Optional[str], Optional[str]]]:
    """
    Retrieves the app ID, module ID, and doc ID associated with a given document name or ID.

    Args:
        doc_identifier (str): The document name or ID to search for.

    Returns:
        Optional[Tuple[Optional[str], Optional[str], Optional[str]]]: A tuple containing 'app_id', 'module_id', and 'doc_id' if found.
              Example: ('app123', 'module456', 'doc789')
              None: If no matching document is found.
    """
    # Load existing data
    existing_data = load_existing_data()

    # Search for the document
    for app_entry in existing_data:
        app_id = app_entry.get("id")
        for module_entry in app_entry.get("modules", []):
            module_id = module_entry.get("id")
            for doc_entry in module_entry.get("docs", []):
                # Check if the doc identifier matches either name or ID
                if (
                    doc_entry.get("id") == doc_identifier
                    or doc_entry.get("name") == doc_identifier
                ):
                    return app_id, module_id, doc_entry.get("id")

    return None, None, None
