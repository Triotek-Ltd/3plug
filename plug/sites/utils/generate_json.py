import json
import os
from typing import Any, Dict, List, Optional

import click

from ...utils.config import DOCS_JSON_PATH, find_module_base_path
from ...utils.text import to_snake_case, to_titlecase_no_space
from .app_actions import find_modules
from .load_doc_config import load_existing_data


def process_docs(folder_path: str) -> List[Dict[str, str]]:
    """
    Processes all documents in the specified folder and returns a list of document names.

    Args:
        folder_path (str): The path to the folder containing documents.

    Returns:
        List[Dict[str, str]]: A list of dictionaries containing document details.
    """
    docs = []
    for item_name in os.listdir(folder_path):
        if item_name.startswith("_"):
            continue  # Skip folders starting with '_'
        item_path = os.path.join(folder_path, item_name)
        if os.path.isdir(item_path):  # Only process directories (docs)
            json_file_path = os.path.join(item_path, f"{item_name}.json")
            doc_name = item_name  # Default to the folder name

            if os.path.isfile(json_file_path):
                try:
                    with open(json_file_path, "r") as json_file:
                        data = json.load(json_file)
                        doc_name = data.get(
                            "name", item_name
                        )  # Fallback to folder name if 'name' not found
                except (json.JSONDecodeError, IOError):
                    click.echo(
                        f"Error reading or parsing JSON file: {json_file_path}. Using folder name."
                    )

            doc_data = {
                "id": to_snake_case(item_name),  # Convert doc name to snake_case for ID
                "model": to_titlecase_no_space(doc_name),
                "name": doc_name,
            }
            docs.append(doc_data)
    return docs


def save_data_to_file(data: List[Dict[str, Any]]) -> None:
    """
    Saves the updated data back to the JSON file.

    Args:
        data (List[Dict[str, Any]]): The data to be saved.
    """
    with open(DOCS_JSON_PATH, "w") as json_file:
        json.dump(data, json_file, indent=4)


def find_or_create_app_entry(
    existing_data: List[Dict[str, Any]], app_id: str, app_name: str
) -> Dict[str, Any]:
    """
    Finds an app entry by ID or creates a new one, always replacing the name if found.

    Args:
        existing_data (List[Dict[str, Any]]): The existing data.
        app_id (str): The ID of the app.
        app_name (str): The name of the app.

    Returns:
        Dict[str, Any]: The app entry.
    """
    app_entry = next((app for app in existing_data if app["id"] == app_id), None)
    if not app_entry:
        app_entry = {"id": app_id, "name": app_name, "modules": []}
        existing_data.append(app_entry)
    else:
        app_entry["name"] = app_name  # Always replace the name
    return app_entry


def find_or_create_module_entry(
    app_entry: Dict[str, Any], module_id: str, module_name: str
) -> Dict[str, Any]:
    """
    Finds a module entry by ID within an app or creates a new one, always replacing the name if found.

    Args:
        app_entry (Dict[str, Any]): The app entry.
        module_id (str): The ID of the module.
        module_name (str): The name of the module.

    Returns:
        Dict[str, Any]: The module entry.
    """
    module_entry = next(
        (mod for mod in app_entry["modules"] if mod["id"] == module_id), None
    )
    if not module_entry:
        module_entry = {"id": module_id, "name": module_name, "docs": []}
        app_entry["modules"].append(module_entry)
    else:
        module_entry["name"] = module_name  # Always replace the name
    return module_entry


def update_module_docs(
    module_entry: Dict[str, Any],
    docs: List[Dict[str, str]],
    prints: List[Dict[str, str]] = [],
) -> None:
    """
    Updates the documents in a module, replacing names if IDs match.

    Args:
        module_entry (Dict[str, Any]): The module entry.
        docs (List[Dict[str, str]]): The list of documents to update.
        prints (List[Dict[str, str]]): The list of print formats to update.
    """
    if "docs" not in module_entry:
        module_entry["docs"] = []
    if "print_formats" not in module_entry:
        module_entry["print_formats"] = []

    existing_docs = {doc["id"]: doc for doc in module_entry["docs"]}
    for doc in docs:
        if doc["id"] in existing_docs:
            existing_docs[doc["id"]]["name"] = doc["name"]
        else:
            module_entry["docs"].append(doc)

    existing_print_formats = {doc["id"]: doc for doc in module_entry["print_formats"]}
    for doc in prints:
        if doc["id"] in existing_print_formats:
            existing_print_formats[doc["id"]]["name"] = doc["name"]
        else:
            module_entry["print_formats"].append(doc)


def add_single_doc(
    app_id: str,
    app_name: str,
    module_id: str,
    module_name: str,
    doc_id: str,
    doc_name: str,
) -> None:
    """
    Adds or updates a single document in the specified app and module.

    Args:
        app_id (str): The ID of the app.
        app_name (str): The name of the app.
        module_id (str): The ID of the module.
        module_name (str): The name of the module.
        doc_id (str): The ID of the document.
        doc_name (str): The name of the document.
    """
    existing_data = load_existing_data()

    app_entry = find_or_create_app_entry(existing_data, app_id, app_name)
    module_entry = find_or_create_module_entry(app_entry, module_id, module_name)

    doc_entry = next((doc for doc in module_entry["docs"] if doc["id"] == doc_id), None)
    if doc_entry:
        doc_entry["name"] = doc_name
    else:
        doc_entry = {
            "id": doc_id,
            "model": to_titlecase_no_space(doc_name),
            "name": doc_name,
        }
        module_entry["docs"].append(doc_entry)
        click.echo(
            f"Document '{doc_name}' added to module '{module_name}' in app '{app_name}'."
        )

    save_data_to_file(existing_data)


def process_module(app_name: str, module: str, app_entry: Dict[str, Any]) -> None:
    """
    Processes a module, updates its docs, and appends it to the app entry.

    Args:
        app_name (str): The name of the app.
        module (str): The name of the module.
        app_entry (Dict[str, Any]): The app entry.
    """
    module_id = to_snake_case(module)
    module_name = module

    _, module_path = find_module_base_path(app_name=app_name, module_name=module_id)

    if not module_path or not os.path.exists(module_path):
        click.echo(
            f"Module '{module}' does not exist in app '{module_path}'. Skipping..."
        )
        return

    prints_path = os.path.join(module_path, "print_format")
    doctype_path = os.path.join(module_path, "doctype")

    docs: List[Dict[str, str]] = []
    prints: List[Dict[str, str]] = []
    if os.path.isdir(prints_path):
        prints = process_docs(prints_path)
    if os.path.isdir(doctype_path):
        docs = process_docs(doctype_path)

    module_entry = find_or_create_module_entry(app_entry, module_id, module_name)
    update_module_docs(module_entry, docs, prints)


def create_doctypes_json(app_name: str, module_name: Optional[str] = None) -> None:
    """
    Generates or updates the doctypes.json file for the app with its modules and docs.

    Args:
        app_name (str): The name of the app.
        module_name (Optional[str]): The name of the module. If None, all modules will be processed.
    """
    existing_data = load_existing_data()

    app_id = to_snake_case(app_name)
    app_entry = find_or_create_app_entry(existing_data, app_id, app_name)

    if module_name:
        process_module(app_name, module_name, app_entry)
    else:
        modules = find_modules(app_name)
        if modules:
            for module in modules:
                process_module(app_name, module, app_entry)

    save_data_to_file(existing_data)


def add_single_entry(
    app_name: Optional[str] = None,
    module_name: Optional[str] = None,
    doc_name: Optional[str] = None,
) -> None:
    """
    Allows adding a single doc, module, or app.

    Args:
        app_name (Optional[str]): The name of the app.
        module_name (Optional[str]): The name of the module.
        doc_name (Optional[str]): The name of the document.
    """
    app_id = to_snake_case(app_name) if app_name else None
    module_id = to_snake_case(module_name) if module_name else None
    doc_id = to_snake_case(doc_name) if doc_name else None

    existing_data = load_existing_data()

    if app_name and module_name and doc_name:
        add_single_doc(app_id, app_name, module_id, module_name, doc_id, doc_name)
    elif app_name and module_name:
        app_entry = find_or_create_app_entry(existing_data, app_id, app_name)
        find_or_create_module_entry(app_entry, module_id, module_name)
        save_data_to_file(existing_data)
    elif app_name:
        find_or_create_app_entry(existing_data, app_id, app_name)
        save_data_to_file(existing_data)
    else:
        click.echo("Invalid parameters provided.")
