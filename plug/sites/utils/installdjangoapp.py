import json
import os
import subprocess
import sys
from typing import List

from .module_structure import create_module_structure  # Importing the logic


def activate_virtualenv(project_root: str) -> str:
    """
    Return the path to the activate script of the virtual environment.

    Args:
        project_root (str): The root directory of the project.

    Returns:
        str: The path to the activate script.
    """
    if sys.platform.startswith("win"):
        return os.path.join(project_root, "env", "Scripts", "activate")
    return os.path.join(project_root, "env", "bin", "activate")


def get_python_executable(project_root: str) -> str:
    """
    Return the path to the Python executable in the virtual environment.

    Args:
        project_root (str): The root directory of the project.

    Returns:
        str: The path to the Python executable.
    """
    venv_path = os.path.join(project_root, "env")
    if sys.platform.startswith("win"):
        return os.path.join(venv_path, "Scripts", "python.exe")
    return os.path.join(venv_path, "bin", "python")


def install_django_app(app: str, project_root: str) -> None:
    """
    Create a Django app in a selected site using the Django startapp command.

    Args:
        app (str): The name of the app to create.
        project_root (str): The root directory of the project.

    Returns:
        None
    """
    app_name = f"{app}_app"

    # Define paths
    django_path = os.path.join(project_root, "manifold")

    # Load app options from apps.txt
    apps_txt_path = os.path.join(project_root, "config", "apps.txt")
    with open(apps_txt_path, "r") as apps_file:
        apps: List[str] = [
            line.strip()
            for line in apps_file
            if line.strip() and not line.startswith("#")
        ]

    # Determine Python executable
    python_executable = get_python_executable(project_root)

    # Run Django's startapp command
    try:
        command = [python_executable, "manage.py", "startapp", app_name]
        subprocess.check_call(command, cwd=django_path)

        # Update INSTALLED_APPS in settings.py
        settings_path = os.path.join(django_path, "manifold", "settings.py")
        with open(settings_path, "r") as file:
            settings_content = file.readlines()

        installed_apps_index = None
        for i, line in enumerate(settings_content):
            if "CUSTOM_APPS = [" in line:
                installed_apps_index = i
                break

        if installed_apps_index is not None:
            end_index = installed_apps_index
            while not settings_content[end_index].strip().endswith("]"):
                end_index += 1
            settings_content.insert(end_index, f"    '{app_name}',\n")

        path_append_line = (
            f'\nsys.path.append(str(os.path.join(PROJECT_PATH, "apps", "{app}")))\n'
        )
        if path_append_line not in settings_content:
            settings_content.append(f"\n{path_append_line}")

        with open(settings_path, "w") as settings_file:
            settings_file.writelines(settings_content)

        # Create urls.py for the new app
        app_path = os.path.join(django_path, app_name)
        custom_app_path = os.path.join(project_root, "apps", app)
        urls_path = os.path.join(app_path, "urls.py")
        with open(urls_path, "w") as urls_file:
            urls_file.write("from django.urls import path\n\n")
            urls_file.write("urlpatterns = [\n")
            urls_file.write("    # Define your app's URLs here\n")
            urls_file.write("]\n")

        # Add the new app's URL to project's urls.py
        main_urls_path = os.path.join(django_path, "core", "urls.py")
        with open(main_urls_path, "a") as main_urls_file:
            main_urls_file.write("urlpatterns += [")
            main_urls_file.write(f"    path('{app}/', include('{app_name}.urls')),")
            main_urls_file.write("]\n")

        # Modify apps.py to include the `ready` method
        apps_py_path = os.path.join(app_path, "apps.py")
        with open(apps_py_path, "r") as apps_file:
            apps_py_content = apps_file.readlines()

        # Find the AppConfig class and insert the `ready` method
        for i, line in enumerate(apps_py_content):
            if "class" in line and "AppConfig" in line:
                insert_index = i + 4  # Insert after class definition
                break

        ready_method = f"""\n    def ready(self):\n        import core.signals\n        import {app_name}.signals\n"""

        apps_py_content.insert(insert_index, ready_method)

        with open(apps_py_path, "w") as apps_file:
            apps_file.writelines(apps_py_content)

        # Create signals.py
        signals_path = os.path.join(app_path, "signals.py")
        with open(signals_path, "w") as signals_file:
            signals_file.write("\n")

        # Create module structure
        create_module_structure(app_path, custom_app_path, app)

    except subprocess.CalledProcessError as e:
        print(f"Failed to create the app '{app}': {e}")
