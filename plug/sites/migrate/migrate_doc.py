import os
from typing import Optional, TextIO, Tuple

import click

from ...utils.config import find_module_base_path
from ...utils.text import to_snake_case, to_titlecase_no_space
from ..utils.app_actions import get_name_by_id
from .write_filters import write_filters
from .write_models import write_model_fields
from .write_serializers import write_serializer
from .write_viewsets import add_import_to_signals, write_viewset
from .models.json_loader import load_json_file

STRUCTURE = {
    "views": "views",
    "models": "models",
    "filters": "filters",
    "serializers": "serializers",
    "tests": "tests",
}


def migrate_doc(
    app_name: str, module: str, doc: Optional[str] = None, django_path: str = ""
) -> None:
    """Migrate a specific document within a module and app.

    Args:
        app_name (str): The name of the Django app.
        module (str): The name of the module.
        doc (Optional[str]): The name of the document to migrate.
        django_path (str): The base path of the Django project.
    """
    module_name = to_snake_case(module).lower()
    doc_name = to_snake_case(doc).lower() if doc else ""
    doctype_folder_name = "doctype"

    add_import_to_signals(app_name, module_name, doc_name)

    modules_file_path, module_base_path = find_module_base_path(
        app_name=app_name, module_name=module_name
    )
    if not module_base_path:
        return  # Exit if no valid path is found

    doc_folder_path = os.path.join(module_base_path, doctype_folder_name, doc_name)

    for folder, structure_name in STRUCTURE.items():
        module_file_path = os.path.join(
            django_path, f"{app_name}_app", folder, module_name if doc_name else ""
        )
        document_file_path = os.path.join(
            module_file_path, f"{doc_name}.py" if doc_name else ""
        )

        if not doc_name:
            continue

        ensure_directory(module_file_path)
        ensure_init_file(module_file_path, doc_name)

        if (
            os.path.exists(doc_folder_path)
            and os.path.isdir(doc_folder_path)
            and not doc_folder_path.startswith(("_", "pycache"))
        ):
            write_module_content(
                folder,
                document_file_path,
                f"{app_name}_app",
                module_name,
                doc_name,
                doc_folder_path,
                django_path,
            )


def ensure_directory(path: str) -> None:
    """Ensure the directory exists.

    Args:
        path (str): The path to the directory.
    """
    if not os.path.exists(path):
        os.makedirs(path, exist_ok=True)


def ensure_init_file(module_file_path: str, doc_name: str) -> None:
    """Ensure an __init__.py file exists in the module directory and imports the document.

    Args:
        module_file_path (str): The path to the module directory.
        doc_name (str): The name of the document.
    """
    init_file_path = os.path.join(module_file_path, "__init__.py")
    if not os.path.exists(init_file_path):
        with open(init_file_path, "w") as init_file:
            init_file.write("")

    import_statement = f"from .{doc_name} import *\n"
    with open(init_file_path, "r+") as init_file:
        lines = init_file.readlines()
        if import_statement not in lines:
            init_file.write(import_statement)


def write_module_content(
    folder: str,
    module_file_path: str,
    app_name: str,
    module_name: str,
    doc_name: str,
    doc_folder_path: str,
    django_path: str,
) -> None:
    """Write appropriate content to the module file based on the folder type.

    Args:
        folder (str): The type of folder (e.g., 'models', 'views').
        module_file_path (str): The path to the module file.
        app_name (str): The name of the Django app.
        module_name (str): The name of the module.
        doc_name (str): The name of the document.
        doc_folder_path (str): The path to the document folder.
        django_path (str): The base path of the Django project.
    """
    model_name = to_titlecase_no_space(get_name_by_id(doc_name, "doc"))

    with open(module_file_path, "w+") as module_file:
        if folder == "models":
            model_file_path = os.path.join(doc_folder_path, f"{doc_name}.json")
            is_single = False
            if os.path.exists(model_file_path):
                # Load data from doc_name.json and extract fields and settings
                model_data = load_json_file(model_file_path)
                is_single = str((model_data or {}).get("issingle")).lower() in ("1", "true")
            write_model_header(module_file, model_name, is_single)
            write_model_fields(
                module_file,
                module_file_path,
                doc_folder_path,
                model_name,
                doc_name, 
                django_path,
            )
        elif folder == "views":
            write_views_header(module_file, app_name, module_name, model_name, doc_name)
            write_viewset(
                module_file, model_name, module_name, doc_folder_path, doc_name
            )
        elif folder == "serializers":
            write_serializer(
                module_file,
                app_name,
                module_name,
                model_name,
                doc_name,
                doc_folder_path,
            )
        elif folder == "filters":
            write_filters(
                module_file,
                app_name,
                module_name,
                model_name,
                doc_name,
                doc_folder_path,
            )
            

def write_model_header(module_file: TextIO, model_name: str, is_single: bool) -> None:
    """Write the imports and class definition header for models.

    Args:
        module_file (TextIO): The file object for the module file.
        model_name (str): The name of the model class.
        is_single (bool): Whether the model is a singleton.
    """
    module_file.write(
        "from django.db import models\n"
        "from multiselectfield import MultiSelectField\n"
        "from core.models.template import BaseModel, SingletonModel\n"
        "import uuid\nimport os\nfrom django.conf import settings\n\n"
    )
    base_class = "SingletonModel" if is_single else "BaseModel"
    module_file.write(f"class {model_name}({base_class}):\n")


def write_views_header(
    module_file: TextIO, app_name: str, module_name: str, model_name: str, doc_name: str
) -> None:
    """Write the imports and class definition header for views.

    Args:
        module_file (TextIO): The file object for the module file.
        app_name (str): The name of the Django app.
        module_name (str): The name of the module.
        model_name (str): The name of the model class.
        doc_name (str): The name of the document.
    """
    module_file.write(
        f"from rest_framework import viewsets\n"
        f"from core.views.template import GenericViewSet\n"
        f"from {app_name}.models.{module_name}.{doc_name} import {model_name}\n"
        f"from {app_name}.filters.{module_name}.{doc_name} import {model_name}Filter\n"
        f"from {app_name}.serializers.{module_name}.{doc_name} import {model_name}Serializer\n"
        f"from rest_framework.permissions import AllowAny\n"
        f"from core.permissions import HasGroupPermission\n\n"
    )
