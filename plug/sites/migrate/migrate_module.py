import os
import shutil
from typing import List, Tuple

import click

from ...utils.config import find_module_base_path
from ...utils.text import to_snake_case
from .migrate_doc import migrate_doc
from .update_urls import underscore_to_titlecase


def add_init_files(folder_path: str) -> None:
    """
    Create __init__.py file importing all modules in the folder.

    Args:
        folder_path (str): Path to the folder where __init__.py should be created.
    """
    os.makedirs(folder_path, exist_ok=True)
    init_file_path = os.path.join(folder_path, "__init__.py")

    with open(init_file_path, "w+") as init_file:
        init_file.truncate(0)  # Clear the contents of the file

        # List all .py files except __init__.py
        files = [
            f[:-3]
            for f in os.listdir(folder_path)
            if f.endswith(".py") and f != "__init__.py"
        ]

        # Write imports for each file in snake_case and lowercase
        for file in files:
            snake_case_file = to_snake_case(file).lower()
            init_file.write(f"from .{snake_case_file} import *\n")


def underscore_to_titlecase(s: str) -> str:
    """
    Convert an underscore-separated string to title case.

    Args:
        s (str): The underscore-separated string.

    Returns:
        str: The string converted to title case.
    """
    return "".join(word.title() for word in s.split("_"))


def write_empty_view(folder_name: str, view_path: str) -> None:
    """
    Write a default class to the views.py file if it is empty.

    Args:
        folder_name (str): The name of the folder.
        view_path (str): The path to the views.py file.
    """
    class_name = underscore_to_titlecase(folder_name)
    with open(view_path, "w") as f:
        f.write(f"from rest_framework.response import Response\n\n")
        f.write(f"class Custom{class_name}:\n")
        f.write(f"    pass\n")


def migrate_module(app_name: str, module: str, django_path: str) -> None:
    """
    Migrate a specific module within an app by processing either the 'doc' or 'doctype' folder, whichever exists first.

    Args:
        app_name (str): The name of the Django app.
        module (str): The name of the module to migrate.
        django_path (str): The base path of the Django project.
    """
    # Convert module name to snake_case
    module_name = to_snake_case(module)
    _, module_path = find_module_base_path(app_name=app_name, module_name=module_name)

    # Check if the module path exists
    if not module_path or not os.path.exists(module_path):
        click.echo(
            f"Module '{module}' does not exist in app '{module_path}'. Skipping..."
        )
        return

    # Define the paths for new 3plug submodule docs and legacy 'doc'/'doctype' folders
    submodule_path = os.path.join(module_path, "submodule")
    doc_path = os.path.join(module_path, "doc")
    doctype_path = os.path.join(module_path, "doctype")

    processed_submodule_doc_count = 0
    if os.path.isdir(submodule_path):
        processed_submodule_doc_count = process_submodule_docs(
            app_name=app_name,
            module=module,
            submodule_root=submodule_path,
            django_path=django_path,
        )

    # If no submodule docs were found, check legacy paths.
    processed_doc_count = 0
    if processed_submodule_doc_count == 0 and os.path.isdir(doc_path) and not doc_path.startswith(("_", "pycache")):
        processed_doc_count = process_folder_docs(app_name, module, doc_path, "doc", django_path)

    # If 'doc' folder is not found, check for the 'doctype' folder
    processed_doctype_count = 0
    if (
        processed_submodule_doc_count == 0
        and processed_doc_count == 0
        and os.path.isdir(doctype_path)
        and not doctype_path.startswith(("_", "pycache"))
    ):
        processed_doctype_count = process_folder_docs(app_name, module, doctype_path, "doctype", django_path)

    # If neither folder is found, print a message
    if processed_submodule_doc_count == 0 and processed_doc_count == 0 and processed_doctype_count == 0:
        click.echo(
            f"No 'doc' or 'doctype' folder found for module '{module}' in app '{app_name} {module_path}'."
        )


STRUCTURE = {
    "views": "views",
    "models": "models",
    "filters": "filters",
    "serializers": "serializers",
    "tests": "tests",
}


def reset_module_structure_dirs(app_name: str, module: str, django_path: str) -> None:
    module_snake = to_snake_case(module)
    for _, structure_item in STRUCTURE.items():
        module_path = os.path.join(django_path, f"{app_name}_app", structure_item, module_snake)
        if os.path.exists(module_path):
            shutil.rmtree(module_path)
        os.makedirs(module_path, exist_ok=True)


def process_submodule_docs(app_name: str, module: str, submodule_root: str, django_path: str) -> int:
    """
    Process docs from the new structure:
    module/submodule/<submodule>/docs/<doc_key>/

    Uses the generated <doc_key>.json inside each docs folder as the migration source.
    """
    module_snake = to_snake_case(module)
    doc_folders: List[Tuple[str, str]] = []

    for submodule_name in os.listdir(submodule_root):
        submodule_path = os.path.join(submodule_root, submodule_name)
        if not os.path.isdir(submodule_path) or submodule_name.startswith(("_", "pycache")):
            continue
        docs_dir = os.path.join(submodule_path, "docs")
        if not os.path.isdir(docs_dir):
            continue
        for doc_name in os.listdir(docs_dir):
            doc_path = os.path.join(docs_dir, doc_name)
            if not os.path.isdir(doc_path) or doc_name.startswith(("_", "pycache")):
                continue
            # Require generated doc runtime json to exist in the docs folder
            if not os.path.exists(os.path.join(doc_path, f"{doc_name}.json")):
                continue
            doc_folders.append((doc_name, doc_path))

    if not doc_folders:
        return 0

    # Reset module wrapper folders once, then generate all docs from submodule docs.
    reset_module_structure_dirs(app_name, module_snake, django_path)

    for doc_name, doc_path in doc_folders:
        migrate_doc(
            app_name=app_name,
            module=module_snake,
            doc=doc_name,
            django_path=django_path,
            doc_folder_override=doc_path,
        )

    return len(doc_folders)


def process_folder_docs(
    app_name: str, module: str, folder_path: str, folder_type: str, django_path: str
) -> int:
    """
    Processes each document or doctype in the specified folder.

    Args:
        app_name (str): The name of the Django app.
        module (str): The name of the module to process.
        folder_path (str): The path to the folder containing documents or doctypes.
        folder_type (str): The type of folder ('doc' or 'doctype').
        django_path (str): The base path of the Django project.

    Returns:
        int: Number of document folders processed.
    """
    # List all documents in the folder
    folder_docs = [
        item_name
        for item_name in os.listdir(folder_path)
        if os.path.isdir(os.path.join(folder_path, item_name))
        and not item_name.startswith(("_", "pycache"))
    ]

    module = to_snake_case(module)

    # Iterate over the STRUCTURE and delete all files in the module path
    for key, structure_item in STRUCTURE.items():
        module_path = os.path.join(
            django_path, f"{app_name}_app", structure_item, module
        )

        if os.path.exists(module_path):
            shutil.rmtree(module_path)
        os.makedirs(module_path, exist_ok=True)

    # Process each document in the folder
    for item_name in folder_docs:
        item_path = os.path.join(folder_path, item_name)

        if os.path.isdir(item_path):
            migrate_doc(
                app_name=app_name,
                module=module,
                doc=item_name,
                django_path=django_path,
            )

    return len(folder_docs)
