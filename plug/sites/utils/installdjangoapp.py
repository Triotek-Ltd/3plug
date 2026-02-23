import os
import subprocess
import sys

from .module_structure import create_module_structure  # Importing the logic


def get_python_executable(project_root: str) -> str:
    """
    Return the path to the Python executable in the virtual environment.

    Args:
        project_root (str): The root directory of the project.

    Returns:
        str: The path to the Python executable.
    """
    venv_candidates = [
        os.path.join(project_root, "env"),
        os.path.join(project_root, ".venv"),
    ]
    for venv_path in venv_candidates:
        if sys.platform.startswith("win"):
            candidate = os.path.join(venv_path, "Scripts", "python.exe")
        else:
            candidate = os.path.join(venv_path, "bin", "python")
        if os.path.exists(candidate):
            return candidate
    raise FileNotFoundError(
        "Python executable not found in env/.venv. Run `3plug setup` first."
    )


def install_django_app(app: str, project_root: str, app_root_path: str = "") -> None:
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

        custom_app_append = (
            f'if os.path.isdir(os.path.join(BASE_DIR, "{app_name}")):\n'
            f'    CUSTOM_APPS.append("{app_name}")\n'
        )
        if custom_app_append not in "".join(settings_content):
            final_installed_index = None
            for i, line in enumerate(settings_content):
                if line.strip().startswith("INSTALLED_APPS ="):
                    final_installed_index = i
                    break
            if final_installed_index is None:
                raise ValueError("Could not find INSTALLED_APPS assignment in settings.py")
            settings_content.insert(final_installed_index, custom_app_append)

        custom_app_path = app_root_path or os.path.join(project_root, "apps", app)
        relative_custom_path = os.path.relpath(custom_app_path, project_root)
        path_parts = [part for part in relative_custom_path.replace("\\", "/").split("/") if part]
        path_parts_expr = ", ".join([f'"{part}"' for part in path_parts])
        path_append_line = f'\nsys.path.append(str(os.path.join(PROJECT_PATH, {path_parts_expr})))\n'
        if path_append_line not in settings_content:
            settings_content.append(f"\n{path_append_line}")

        with open(settings_path, "w") as settings_file:
            settings_file.writelines(settings_content)

        # Create urls.py for the new app
        app_path = os.path.join(django_path, app_name)
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
