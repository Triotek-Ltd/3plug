import os
from typing import List, Tuple

from ...utils.register_models import register_to_model_json
from ...utils.register_prints import register_to_print_json
from ...utils.text import underscore_to_titlecase
from .generate_json import add_single_entry, create_doctypes_json


def configure_app(app_name: str) -> None:
    """
    Register models from multiple modules within an app.

    Args:
        app_name (str): The name of the application.
    """
    # Generate the doctypes.json file
    create_doctypes_json(app_name)


def configure_module(app_name: str, module_name: str) -> None:
    """
    Register models from a specific module within an app.

    Args:
        app_name (str): The name of the application.
        module_name (str): The name of the module.
    """
    create_doctypes_json(app_name, module_name)


def configure_doc(app_name: str, module_name: str, doc_name: str) -> None:
    """
    Register a specific document within a module of an app.

    Args:
        app_name (str): The name of the application.
        module_name (str): The name of the module.
        doc_name (str): The name of the document.
    """
    # Generate the doctypes.json file
    add_single_entry(app_name, module_name, doc_name)


def process_folder_docs(
    app_name: str, module: str, folder_path: str, django_path: str
) -> Tuple[List[str], List[str]]:
    """
    Processes each document or doctype in the specified folder and returns model names and import statements.

    Args:
        app_name (str): The name of the application.
        module (str): The name of the module.
        folder_path (str): The path to the folder containing documents.
        django_path (str): The Django path for the application.

    Returns:
        Tuple[List[str], List[str]]: A tuple containing a list of import statements and a list of model names.
    """

    import_statements: List[str] = []
    models_to_register: List[str] = []

    # Use list comprehension for faster directory listing and processing
    prints = [
        item
        for item in os.listdir(os.path.join(folder_path, "../print_formats"))
        if os.path.isdir(os.path.join(folder_path, "../print_formats", item))
    ]

    for item_name in prints:
        model_name = underscore_to_titlecase(item_name)

        # Register model details
        register_to_print_json(
            app_name=app_name,
            module_name=module,
            doc_name=item_name,
            django_path=django_path,
        )

    # Use list comprehension for faster directory listing and processing
    items = [
        item
        for item in os.listdir(folder_path)
        if os.path.isdir(os.path.join(folder_path, item))
    ]

    for item_name in items:
        model_name = underscore_to_titlecase(item_name)

        # Register model details
        # register_to_model_json(
        #     app_name=app_name,
        #     module_name=module,
        #     doc_name=item_name,
        #     django_path=django_path,
        # )

        # Generate import statement and add to lists
        import_statement = (
            f"from {app_name}.models.{module}.{item_name} import {model_name}"
        )
        import_statements.append(import_statement)
        models_to_register.append(model_name)

    return import_statements, models_to_register
