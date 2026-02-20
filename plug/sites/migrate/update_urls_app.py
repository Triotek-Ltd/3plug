import os
from typing import List

import click

from ...utils.config import find_module_base_path
from ...utils.text import to_snake_case, to_titlecase_no_space
from ..utils.app_actions import get_name_by_id

from .models.json_loader import load_json_file

def update_urls_py(app_name: str, modules: List[str], django_path: str) -> None:
    """
    Update urls.py to register ViewSets for models within an app, including public viewsets.

    Args:
        app_name (str): The name of the Django app.
        modules (List[str]): A list of module names to process.
        django_path (str): The base path to the Django project.
    """
    # Path to urls.py
    urls_path = os.path.join(django_path, f"{app_name}_app", "urls.py")

    # Initialize content for urls.py
    urls_content = "from django.urls import path, include\n"
    urls_content += (
        "from rest_framework.routers import DefaultRouter\nrouter = DefaultRouter()\n"
    )

    if modules:
        # Process each module
        for module in modules:
            module_snake_case = to_snake_case(module)
            _, module_path = find_module_base_path(
                app_name=app_name, module_name=module_snake_case
            )

            # Check if the module path exists
            if not module_path or not os.path.exists(module_path):
                click.echo(
                    f"Module '{module}' does not exist in app '{module_path}'. Skipping..."
                )
                continue

            # Define paths for 'doc' and 'doctype' folders
            doc_path = os.path.join(module_path, "doc")
            doctype_path = os.path.join(module_path, "doctype")

            # Check for 'doc' or 'doctype' folders and process whichever exists
            if os.path.isdir(doc_path):
                models = extract_model_names(doc_path)
            elif os.path.isdir(doctype_path):
                models = extract_model_names(doctype_path)
            else:
                click.echo(
                    f"No 'doc' or 'doctype' folder found for module '{module}' in app '{app_name}'."
                )
                continue

            # Add import statement for the module
            if len(models) > 0:
                urls_content += f"from .views.{module_snake_case} import *\n"

            if models:
                for model in models:
                    model_name = to_titlecase_no_space(get_name_by_id(model, "doc"))
                    viewset_name = f"{model_name}ViewSet"
                    public_viewset_name = f"Public{model_name}ViewSet"

                    # Register the main viewset
                    urls_content += f"router.register(r'{model}', {viewset_name}, basename='{model}')\n"

                    # Check if the model has a public viewset
                    config_file_path = os.path.join(
                        doc_path if os.path.isdir(doc_path) else doctype_path, model, f"{model}.json"
                    )
                    if os.path.exists(config_file_path):
                        config = load_json_file(config_file_path)
                        is_public = config.get("is_public", False)

                        # Register the public viewset if it exists
                        if is_public:
                            urls_content += f"router.register(r'public/{model}', {public_viewset_name}, basename='public-{model}')\n"

        # Add the router's URLs to urlpatterns
    urls_content += """

urlpatterns = [
    path('', include(router.urls)),
]
"""

    # Write the final urls.py
    with open(urls_path, "w") as file:
        file.write(urls_content)
        

def extract_model_names(folder_path: str) -> List[str]:
    """
    Extract model names based on folder contents, skipping directories
    starting with '_' or 'pycache'.

    Args:
        folder_path (str): The path to the folder containing model directories.

    Returns:
        List[str]: A list of model names.
    """
    models = []
    for item_name in os.listdir(folder_path):
        item_path = os.path.join(folder_path, item_name)
        if os.path.isdir(item_path) and not item_name.startswith(("_", "pycache")):
            models.append(item_name)
    return models
