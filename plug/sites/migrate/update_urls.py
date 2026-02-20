import os
import re
from typing import List

from ...utils.config import APPS_PATH
from ...utils.text import to_titlecase_no_space
from ..utils.app_actions import get_name_by_id


def underscore_to_titlecase(underscore_str: str) -> str:
    """Convert an underscore-separated string to title case.

    Args:
        underscore_str (str): The string to convert.

    Returns:
        str: The converted title case string.
    """
    return re.sub(r"_(.)", lambda m: m.group(1).upper(), underscore_str.title())


def write_urls(url_file: str, model_name: str, module_name: str) -> str:
    """Generate a URL route for a given model.

    Args:
        url_file (str): The URL file path.
        model_name (str): The name of the model.
        module_name (str): The name of the module.

    Returns:
        str: The URL route string.
    """
    return f"router.register(r'{module_name}', {model_name}ViewSet)\n"


def update_urls(app_name: str, module: str, django_path: str) -> None:
    """Update the main urls.py file with new routes.

    Args:
        app_name (str): The name of the application.
        module (str): The module name.
        django_path (str): The Django project path.
    """
    url_file_path = os.path.join(django_path, f"{app_name}_app", "urls.py")

    # Prepare header lines
    header_lines = (
        f"from django.urls import path, include\n"
        f"from rest_framework.routers import DefaultRouter\n"
        f"from {app_name}_app.views import *\n\n"
        f"router = DefaultRouter()\n\n"
    )
    urlpatterns_line = "urlpatterns = [path('', include(router.urls)),]\n"

    custom_app_path = os.path.join(APPS_PATH, app_name)
    doc_folder_path = os.path.join(custom_app_path, module, "doc")

    # Read the current content of urls.py if it exists
    if os.path.exists(url_file_path):
        with open(url_file_path, "r") as f:
            existing_content = f.read()
    else:
        existing_content = ""

    new_content: List[str] = []

    # Add header lines if not already in the file
    if header_lines not in existing_content:
        new_content.append(header_lines)

    # Check for valid folders in the documentation directory and generate routes
    for folder_name in os.listdir(doc_folder_path):
        folder_path = os.path.join(doc_folder_path, folder_name)

        if os.path.isdir(folder_path) and not is_invalid_model_name(folder_name):
            model_name = to_titlecase_no_space(get_name_by_id(folder_name, "doc"))
            line_to_add = (
                f"router.register(r'{module}.{folder_name}', {model_name}ViewSet)\n"
            )

            # Add the route if it doesn't already exist
            if line_to_add not in existing_content:
                new_content.append(line_to_add)

    # Remove the old urlpatterns if it exists
    existing_content = re.sub(
        r"urlpatterns\s*=\s*\[path\(''\s*,\s*include\(router.urls\)\)\s*,?\]\n?",
        "",
        existing_content,
    )

    # Write new content if there are changes
    if new_content or urlpatterns_line not in existing_content:
        # Append the new content to the file and ensure urlpatterns is last
        with open(url_file_path, "w") as url_file:
            url_file.write(existing_content)
            url_file.writelines(new_content)
            url_file.write("\n" + urlpatterns_line)


def is_invalid_model_name(name: str) -> bool:
    """Check if a model name is invalid.

    Args:
        name (str): The model name to check.

    Returns:
        bool: True if the model name is invalid, False otherwise.
    """
    # Skip directories starting with '_' or 'pycache' and names starting or ending with underscores
    return name.startswith("_") or name.endswith("_") or name.lower() == "pycache"
