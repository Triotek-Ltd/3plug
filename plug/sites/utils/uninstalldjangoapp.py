import os
import subprocess
import sys
from typing import List, Optional


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


def remove_app_from_installed_apps(app: str, app_name: str, settings_path: str) -> None:
    """
    Remove the app from INSTALLED_APPS and sys.path in the settings.py.

    Args:
        app (str): The name of the app.
        app_name (str): The name of the app in INSTALLED_APPS.
        settings_path (str): The path to the settings.py file.
    """
    with open(settings_path, "r") as file:
        settings_content: List[str] = file.readlines()

    # Find the installed apps section
    installed_apps_index: Optional[int] = None
    for i, line in enumerate(settings_content):
        if "CUSTOM_APPS = [" in line:
            installed_apps_index = i
            break

    if installed_apps_index is None:
        raise ValueError("Could not find INSTALLED_APPS in the settings file.")

    # Remove the app from the INSTALLED_APPS list and sys.path.append
    updated_settings: List[str] = []
    app_found: bool = False
    path_app_found: bool = False
    skip_next_custom_append = False
    for line in settings_content:
        if skip_next_custom_append:
            if line.strip() == f'CUSTOM_APPS.append("{app_name}")':
                path_app_found = True
                skip_next_custom_append = False
                continue
            skip_next_custom_append = False

        # Remove the app from INSTALLED_APPS
        if line.strip() == f"'{app_name}'," or line.strip() == f'"{app_name}",':
            app_found = True
            continue  # Skip this line (removing the app)

        if line.strip() == f'if os.path.isdir(os.path.join(BASE_DIR, "{app_name}")):':
            path_app_found = True
            skip_next_custom_append = True
            continue

        # Remove both single and double quotes sys.path.append lines for the app
        if (
            "sys.path.append(str(os.path.join(PROJECT_PATH" in line
            and f'"{app}"' in line
        ) or (
            "sys.path.append(str(os.path.join(PROJECT_PATH" in line
            and f"'{app}'" in line
        ):
            path_app_found = True
            continue  # Skip this line (removing sys.path.append)

        updated_settings.append(line)

    # Write changes back to settings.py if any changes were made
    if app_found or path_app_found:
        with open(settings_path, "w") as settings_file:
            settings_file.writelines(updated_settings)

        if app_found:
            print(f"App '{app}' has been removed from INSTALLED_APPS.")
        if path_app_found:
            print(f"sys.path.append for '{app}' has been removed.")
    else:
        print(f"App '{app}' or its sys.path.append entry was not found.")


def remove_app_urls(app: str, app_name: str, urls_path: str) -> None:
    """
    Remove the app's URL pattern from the project's main urls.py.

    Args:
        app (str): The name of the app.
        app_name (str): The name of the app in the URL pattern.
        urls_path (str): The path to the main urls.py file.
    """
    with open(urls_path, "r") as file:
        urls_content: List[str] = file.readlines()

    # Remove the app's URL entry
    updated_urls: List[str] = []
    app_found: bool = False
    for line in urls_content:
        if f"path('{app}/', include('{app_name}.urls'))," in line:
            app_found = True
            continue  # Skip this line (removing the URL entry)
        updated_urls.append(line)

    if app_found:
        with open(urls_path, "w") as urls_file:
            urls_file.writelines(updated_urls)
        print(f"URLs for app '{app}' have been removed.")
    else:
        print(f"No URL entry found for app '{app}'.")


def uninstall_django_app(app: str, project_root: str) -> None:
    """
    Uninstall a Django app from a selected site by reversing actions taken during installation.

    Args:
        app (str): The name of the app to uninstall.
        project_root (str): The root directory of the project.
    """
    app_name = f"{app}_app"

    django_path = os.path.join(project_root, "manifold")

    # Determine Python executable
    get_python_executable(project_root)

    # Check if app exists in the site
    app_path = os.path.join(django_path, app_name)
    if not os.path.exists(app_path):
        raise ValueError(f"App '{app}' does not exist in site.")

    # Remove the app's entry in settings.py
    settings_path = os.path.join(
        django_path, "manifold", "settings.py"
    )  # Adjust path as necessary
    remove_app_from_installed_apps(app, app_name, settings_path)

    # Remove the app's URL from the project's main urls.py
    main_urls_path = os.path.join(
        django_path, "core", "urls.py"
    )  # Adjust path as necessary
    remove_app_urls(app, app_name, main_urls_path)

    # Simulate removing the app directory
    try:
        if os.name == "nt":  # Windows
            subprocess.check_call(["cmd", "/c", "rmdir", "/s", "/q", app_path])
        else:  # Unix-based systems
            subprocess.check_call(["rm", "-rf", app_path])
        print(f"App '{app}' has been removed from site'.")
    except subprocess.CalledProcessError as e:
        print(f"Failed to remove the app '{app}' from site': {e}")
