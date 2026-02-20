import json
import os

from django.conf import settings


def normalize_name(name):
    """
    Normalize a name by removing spaces and converting to lowercase.
    """
    return name.replace(" ", "").lower()


def find_matching_doc(module, name):
    """
    Find a document in the module by matching either the exact 'id'
    or by removing spaces and ignoring case in both the name and the doc ID.

    Args:
        module (dict): The module containing the documents.
        name (str): The name or ID to search for.

    Returns:
        dict or None: The matched document, or None if no match is found.
    """
    normalized_name = normalize_name(name)
    return next(
        (doc for doc in module["docs"] if normalize_name(doc["id"]) == normalized_name),
        None,
    )


def build_file_path(base_path, app_id, module_id, doc_id, filename=None):
    """
    Construct the file path for a document.

    Args:
        base_path (str): The root path for apps.
        app_id (str): The application ID.
        module_id (str): The module ID.
        doc_id (str): The document ID.
        filename (str, optional): The file name to use. Defaults to `doc_id.json`.

    Returns:
        str: The constructed file path.
    """
    # Default to the doc_id.json if filename is not provided
    target_filename = filename or f"{doc_id}.json"
    return os.path.join(
        base_path, "apps", app_id, app_id, module_id, "doctype", doc_id, target_filename
    )


def get_file_content(name, filename=None):
    """
    Fetch file content for a specific document based on the provided name and filename.

    Args:
        name (str): The name of the document.
        filename (str, optional): The name of the file to retrieve. Defaults to None.

    Returns:
        dict: The content of the file as a dictionary, or an error message if not found.
    """
    try:
        # Load the doctypes.json configuration file
        config_file_path = os.path.join(settings.SITE_PATH, "doctypes.json")
        with open(config_file_path, "r") as file:
            models_data = json.load(file)

        # Define the root path for apps
        base_path = settings.PROJECT_PATH

        # Iterate through the models data to find the matching document
        for app in models_data:
            for module in app["modules"]:
                doc = find_matching_doc(module, name)
                if doc:
                    # Build the file path
                    file_path = build_file_path(
                        base_path, app["id"], module["id"], doc["id"], filename
                    )

                    # Load the file content if it exists
                    if os.path.exists(file_path):
                        with open(file_path, "r", encoding="utf-8") as file:
                            return json.load(file)

                    return {"error": "File not found"}
    except Exception as e:
        # Handle exceptions gracefully
        print(f"Error loading file content: {e}")
        return {"error": str(e)}

    # Return an error if no matching document or file is found
    return {"error": "Module not found"}


def get_model_doctype_json(model_name):
    """
    Fetch settings for a given model from a JSON configuration file,
    including its related doctype information if available.

    Args:
        model_name (str): The name of the model.

    Returns:
        dict: The settings dictionary for the model including doctype data and settings file path,
              or an empty dictionary if not found.
    """
    # Define the directory where JSON files are stored
    doctypes_json = os.path.join(settings.SITE_PATH, "doctypes.json")

    result = {}

    # Check if the doctypes JSON exists
    if os.path.exists(doctypes_json):
        # Read and parse the doctypes JSON file
        with open(doctypes_json, "r") as file:
            doctypes_data = json.load(file)
        # Find the matching doctype information
        for app in doctypes_data:
            for module in app.get("modules", []):
                for doc in module.get("docs", []):
                    if doc.get("model") == model_name:
                        settings_file_path = os.path.join(
                            settings.PROJECT_PATH,
                            "apps",
                            app.get("id"),
                            app.get("id"),
                            module.get("id"),
                            "doctype",
                            doc.get("id"),
                            f"{doc.get('id')}.json",
                        )
                        result = {
                            "app_id": app.get("id"),
                            "app_name": app.get("name"),
                            "module_id": module.get("id"),
                            "module_name": module.get("name"),
                            "doc_id": doc.get("id"),
                            "doc_name": doc.get("name"),
                            "settings_file_path": settings_file_path,
                        }

                        # Load the JSON file for the specific doctype
                        if os.path.exists(settings_file_path):
                            with open(settings_file_path, "r") as settings_file:
                                return json.load(settings_file)

    return None
