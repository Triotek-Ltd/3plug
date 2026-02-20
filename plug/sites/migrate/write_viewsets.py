import ast
import os
import re
from difflib import get_close_matches
from typing import List, Optional, Union, Dict, Any
from .models.json_loader import load_json_file

from ...utils.config import DJANGO_PATH


def find_matching_class(file_content: str, model_name: str) -> Union[str, List[str]]:
    """
    Check if the model_name matches a class in the Python file.

    Args:
        file_content (str): The content of the Python file.
        model_name (str): The name of the model to find.

    Returns:
        Union[str, List[str]]: The exact match of the model name or a list of all class names.
    """
    parsed_content = ast.parse(file_content)
    class_names = [
        node.name for node in parsed_content.body if isinstance(node, ast.ClassDef)
    ]
    if model_name in class_names:
        return model_name  # Exact match
    return class_names  # Return all available class names for further matching


def find_nearest_class(model_name: str, class_names: List[str]) -> Optional[str]:
    """
    Find the nearest match to model_name from a list of class names.

    Args:
        model_name (str): The name of the model to find.
        class_names (List[str]): A list of class names to match against.

    Returns:
        Optional[str]: The nearest matching class name or None if no match is found.
    """
    matches = get_close_matches(model_name, class_names, n=1, cutoff=0.6)
    return matches[0] if matches else None

def write_viewset(
    view_file, model_name: str, module_name: str, folder_path: str, doc_name: str
) -> None:
    """
    Write a viewset for a given model, including a public viewset if configured.

    Args:
        view_file (TextIO): The file object to write the viewset to.
        model_name (str): The name of the model.
        module_name (str): The name of the module.
        folder_path (str): The path to the folder containing the model file.
        doc_name (str): The name of the document (model file) without extension.
    """
    model_file_path = os.path.join(folder_path, f"{doc_name}.py")

    # Check if the file exists and is not empty
    modelimport_name = None
    if not os.path.exists(model_file_path) or os.path.getsize(model_file_path) == 0:
        pass
    else:
        # Load model file content
        with open(model_file_path, "r", encoding="utf-8") as f:
            model_data = f.read()

        # Skip if the file is empty after reading
        if not model_data.strip():
            return

        # Match the class in the model file
        class_names = find_matching_class(model_data, model_name)
        if isinstance(class_names, list):  # If no exact match, find the nearest
            nearest_class = find_nearest_class(model_name, class_names)
            if nearest_class:
                modelimport_name = nearest_class
            modelimport_name = model_name
        else:
            modelimport_name = model_name

    # Write the main viewset
    view_file.write(f"class {model_name}ViewSet(GenericViewSet):\n")
    view_file.write(f"    queryset = {model_name}.objects.all()\n")
    view_file.write(f"    filterset_class = {model_name}Filter\n")
    view_file.write(f"    permission_classes = [HasGroupPermission]\n")
    view_file.write(f"    serializer_class = {model_name}Serializer\n\n")

    # Load config file
    config_file_path = os.path.join(folder_path, f"{doc_name}.json")
    config: Dict[str, Any] = {}

    if os.path.exists(config_file_path):
        config = load_json_file(config_file_path)
        is_public = config.get("is_public", False)

        # If public, create a new public viewset
        if is_public:
            view_file.write(f"class Public{model_name}ViewSet(GenericViewSet):\n")
            view_file.write(f"    queryset = {model_name}.objects.all()\n")
            view_file.write(f"    serializer_class = {model_name}Serializer\n")
            view_file.write(f"    permission_classes = [AllowAny]\n")
            view_file.write(f"    http_method_names = ['get']\n\n")
                       

def add_import_to_signals(app_name, module_name, doc_name):
    signals_path = os.path.join(DJANGO_PATH, f"{app_name}_app", "signals.py")
    import_statement = (
        f"from {app_name}.{module_name}.doctype.{doc_name}.{doc_name} import *"
    )

    # Ensure the file exists
    if not os.path.exists(signals_path):
        with open(signals_path, "w") as f:
            f.write(f"{import_statement}\n")
        return

    # Read the existing lines to check for duplicates
    with open(signals_path, "r") as f:
        lines = f.readlines()

    if import_statement in [line.strip() for line in lines]:
        return

    # Append the import if it does not exist
    with open(signals_path, "a") as f:
        f.write(f"\n{import_statement}")
