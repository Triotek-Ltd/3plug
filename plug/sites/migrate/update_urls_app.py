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
    if app_name == "platform_core":
        urls_content += (
            "from .views.platform_api import (\n"
            "    plt_doc_action,\n"
            "    plt_doc_detail,\n"
            "    plt_doc_list,\n"
            "    plt_doc_meta,\n"
            "    plt_launcher_catalog,\n"
            "    plt_apps,\n"
            "    plt_modules,\n"
            "    plt_sandbox_catalog,\n"
            "    plt_session_bootstrap,\n"
            "    plt_submodules,\n"
            "    plt_workspaces,\n"
            ")\n"
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

            # Prefer new app/module/submodule/docs structure, then fall back to legacy doc/doctype.
            submodule_root = os.path.join(module_path, "submodule")
            doc_path = os.path.join(module_path, "doc")
            doctype_path = os.path.join(module_path, "doctype")

            models = []
            model_source_root = None
            if os.path.isdir(submodule_root):
                models = extract_model_names_from_submodule_docs(submodule_root)
                if models:
                    model_source_root = "submodule_docs"

            # Check for legacy 'doc' or 'doctype' folders and process whichever exists
            if not models and os.path.isdir(doc_path):
                models = extract_model_names(doc_path)
                model_source_root = doc_path
            elif not models and os.path.isdir(doctype_path):
                models = extract_model_names(doctype_path)
                model_source_root = doctype_path
            elif not models:
                click.echo(
                    f"No submodule docs, 'doc', or 'doctype' folder found for module '{module}' in app '{app_name}'."
                )
                continue

            if models:
                for model in models:
                    model_name = to_titlecase_no_space(get_name_by_id(model, "doc"))
                    viewset_name = f"{model_name}ViewSet"
                    public_viewset_name = f"Public{model_name}ViewSet"
                    urls_content += (
                        f"from .views.{module_snake_case}.{model} import {viewset_name}\n"
                    )

                    # Register the main viewset
                    urls_content += f"router.register(r'{model}', {viewset_name}, basename='{model}')\n"

                    # Check if the model has a public viewset
                    if model_source_root == "submodule_docs":
                        config_file_path = find_submodule_runtime_json(submodule_root, model)
                    else:
                        config_file_path = os.path.join(model_source_root, model, f"{model}.json")
                    if os.path.exists(config_file_path):
                        config = load_json_file(config_file_path)
                        is_public = config.get("is_public", False)

                        # Register the public viewset if it exists
                        if is_public:
                            urls_content += (
                                f"from .views.{module_snake_case}.{model} import {public_viewset_name}\n"
                            )
                            urls_content += f"router.register(r'public/{model}', {public_viewset_name}, basename='public-{model}')\n"

        # Add the router's URLs to urlpatterns
    urls_content += """

urlpatterns = [
"""
    if app_name == "platform_core":
        urls_content += (
            "    path('platform/session/bootstrap/', plt_session_bootstrap),\n"
            "    path('platform/launcher/catalog/', plt_launcher_catalog),\n"
            "    path('platform/apps/', plt_apps),\n"
            "    path('platform/modules/', plt_modules),\n"
            "    path('platform/submodules/', plt_submodules),\n"
            "    path('platform/workspaces/', plt_workspaces),\n"
            "    path('platform/sandbox/catalog/', plt_sandbox_catalog),\n"
            "    path('docs/meta/<str:doc_key>/', plt_doc_meta),\n"
            "    path('docs/<str:doc_key>/', plt_doc_list),\n"
            "    path('docs/<str:doc_key>/<str:doc_id>/', plt_doc_detail),\n"
            "    path('docs/<str:doc_key>/<str:doc_id>/actions/<str:action_id>/', plt_doc_action),\n"
        )
    urls_content += """
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


def extract_model_names_from_submodule_docs(submodule_root: str) -> List[str]:
    models = []
    seen = set()
    if not os.path.isdir(submodule_root):
        return models

    for submodule_name in os.listdir(submodule_root):
        docs_root = os.path.join(submodule_root, submodule_name, "docs")
        if not os.path.isdir(docs_root):
            continue
        for doc_key in os.listdir(docs_root):
            doc_dir = os.path.join(docs_root, doc_key)
            if not os.path.isdir(doc_dir):
                continue
            if doc_key.startswith(("_", "pycache")):
                continue
            if doc_key in seen:
                continue
            seen.add(doc_key)
            models.append(doc_key)
    return models


def find_submodule_runtime_json(submodule_root: str, model: str) -> str:
    for submodule_name in os.listdir(submodule_root):
        candidate = os.path.join(submodule_root, submodule_name, "docs", model, f"{model}.json")
        if os.path.exists(candidate):
            return candidate
    return ""
