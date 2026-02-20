import os
from typing import List

import click

from ...utils.text import to_snake_case
from ..utils.app_actions import find_modules
from .migrate_doc import STRUCTURE
from .migrate_module import migrate_module
from .update_urls_app import update_urls_py


def add_init_files(folder_path: str, modules: List[str]) -> None:
    """Create an __init__.py file in the specified folder, importing all modules listed.

    Args:
        folder_path (str): Path to the folder where __init__.py will be created.
        modules (list): List of module names to be imported in the __init__.py file.
    """
    init_file_path = os.path.join(folder_path, "__init__.py")
    os.makedirs(folder_path, exist_ok=True)
    with open(init_file_path, "w") as init_file:
        init_file.truncate(0)  # Clear the contents of the file
        init_file.write(f"from . import *\n")
        # for module in modules:
        #     # Convert module name to snake_case and lowercase before writing
        #     module_snake_case = to_snake_case(module).lower()
        #     init_file.write(f"from .{module_snake_case} import *\n")


def migrate_app(app_name: str, django_path: str) -> None:
    """Migrate a specific app by updating modules and folders as per configuration.

    Args:
        app_name (str): Name of the app to migrate.
        django_path (str): Path to the Django project where the app should be migrated.

    This function performs the following actions:
        - Locates the modules.txt file and determines the module base path.
        - Reads the module names and updates the folder structure.
        - Cleans existing module files, recreates folders, and calls migrate_module for each module.
    """
    click.echo(f"Processing app '{app_name}'...")

    # Locate modules.txt and determine the module base path

    # Absolute path of django_path for comparison
    django_path_abs = os.path.abspath(django_path)

    modules = find_modules(app_name)

    for folder, _ in STRUCTURE.items():
        module_folder_path = os.path.join(django_path, f"{app_name}_app", folder)

        # Ensure module_folder_path is within django_path
        module_folder_path_abs = os.path.abspath(module_folder_path)
        if not module_folder_path_abs.startswith(django_path_abs):
            raise ValueError(
                f"Module folder path '{module_folder_path}' is outside the allowed Django path '{django_path}'."
            )

        # Clean and prepare the folder structure
        if os.path.exists(module_folder_path):
            for filename in os.listdir(module_folder_path):
                file_path = os.path.join(module_folder_path, filename)
                if os.path.isfile(file_path) and not filename.startswith("__init__.py"):
                    os.remove(file_path)

            if not os.listdir(module_folder_path):
                os.rmdir(module_folder_path)
        else:
            os.makedirs(module_folder_path, exist_ok=True)

        add_init_files(module_folder_path, modules)

    update_urls_py(app_name, modules, django_path)
    if modules:
        for module in modules:
            migrate_module(app_name, module, django_path)

    # create_manual_migrations(app_name, django_path)

    click.echo(f"Processed app '{app_name}'.")
