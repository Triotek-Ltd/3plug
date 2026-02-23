import json
import os
from typing import List, Optional, Tuple

import click
from .default_site import get_default_site_info

def find_project_root(current_path: str) -> str:
    while current_path != "/":
        if "3plug.config" in os.listdir(current_path):
            return current_path
        current_path = os.path.dirname(current_path)
    raise FileNotFoundError("Project root with '3plug.config' not found.")

PROJECT_ROOT = find_project_root(os.getcwd())
PLUGS_TXT_PATH = os.path.join(PROJECT_ROOT, "config", "plugs.txt")
# SITES_JSON_PATH = os.path.join(PROJECT_ROOT, "sites", "sites.json")
DOCS_JSON_PATH = os.path.join(PROJECT_ROOT, "sites", "doctypes.json")
PRINT_JSON_PATH = os.path.join(PROJECT_ROOT, "sites", "print_formats.json")
APPS_PATH = os.path.join(PROJECT_ROOT, "apps")
DJANGO_PATH = os.path.join(PROJECT_ROOT, "manifold")
DEFAULT_SITE = get_default_site_info(PROJECT_ROOT)
SITES_PATH = os.path.join(PROJECT_ROOT, "sites")

SYSTEM_DIRS = {
    ".git",
    ".next",
    ".venv",
    ".vscode",
    "apps",
    "config",
    "logs",
    "manifold",
    "node_modules",
    "plug",
    "public",
    "sites",
    "src",
}


def _read_non_comment_lines(file_path: str) -> List[str]:
    if not os.path.exists(file_path):
        return []
    with open(file_path, "r") as file_handle:
        return [
            line.strip()
            for line in file_handle
            if line.strip()
            and not line.strip().startswith("#")
            and line.strip() not in {"[]", "{}"}
        ]


def _ensure_text_file(file_path: str) -> None:
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    if not os.path.exists(file_path):
        with open(file_path, "w") as file_handle:
            file_handle.write("")
        return

    with open(file_path, "r") as file_handle:
        content = file_handle.read().strip()
    if content in {"[]", "{}"}:
        with open(file_path, "w") as file_handle:
            file_handle.write("")


def get_registered_apps() -> List[str]:
    apps: List[str] = []

    # Plug-local registries.
    for plug_name in get_registered_plugs():
        for app_name in get_plug_apps(plug_name):
            if app_name not in apps:
                apps.append(app_name)

    return apps


def get_registered_plugs() -> List[str]:
    # If plugs.txt is missing/empty, discover top-level directories excluding framework internals.
    plugs = _read_non_comment_lines(PLUGS_TXT_PATH)
    if plugs:
        return plugs

    discovered: List[str] = []
    for entry in os.listdir(PROJECT_ROOT):
        entry_path = os.path.join(PROJECT_ROOT, entry)
        if (
            os.path.isdir(entry_path)
            and not entry.startswith(".")
            and entry not in SYSTEM_DIRS
        ):
            discovered.append(entry)
    return discovered


def ensure_plug_directory(plug_name: str) -> str:
    plug_path = os.path.join(PROJECT_ROOT, plug_name)
    if not os.path.isdir(plug_path):
        raise FileNotFoundError(
            f"Plug '{plug_name}' does not exist. Select one from config/plugs.txt options."
        )
    ensure_plug_scaffold(plug_name)
    return plug_path


def get_plug_apps_txt_path(plug_name: str) -> str:
    return os.path.join(PROJECT_ROOT, plug_name, "apps.txt")


def get_plug_apps(plug_name: str) -> List[str]:
    apps_txt_path = get_plug_apps_txt_path(plug_name)
    _ensure_text_file(apps_txt_path)
    return _read_non_comment_lines(apps_txt_path)


def add_plug_app(plug_name: str, app_name: str) -> None:
    apps = get_plug_apps(plug_name)
    if app_name not in apps:
        with open(get_plug_apps_txt_path(plug_name), "a") as file_handle:
            file_handle.write(f"{app_name}\n")


def remove_plug_app(plug_name: str, app_name: str) -> None:
    apps = [app for app in get_plug_apps(plug_name) if app != app_name]
    with open(get_plug_apps_txt_path(plug_name), "w") as file_handle:
        for app in apps:
            file_handle.write(f"{app}\n")


def ensure_plug_scaffold(plug_name: str) -> None:
    plug_path = os.path.join(PROJECT_ROOT, plug_name)
    os.makedirs(plug_path, exist_ok=True)

    _ensure_text_file(get_plug_apps_txt_path(plug_name))

    readme_path = os.path.join(plug_path, "README.md")
    if not os.path.exists(readme_path):
        with open(readme_path, "w") as readme_file:
            readme_file.write(f"# {plug_name.title()} Plug\n")

    # Base folders for plug-level documentation and translation assets.
    os.makedirs(os.path.join(plug_path, "docs"), exist_ok=True)
    os.makedirs(os.path.join(plug_path, "translations"), exist_ok=True)


def get_app_root_path(app_name: str, plug_name: Optional[str] = None) -> Optional[str]:
    if plug_name:
        candidate = os.path.join(PROJECT_ROOT, plug_name, app_name)
        return candidate if os.path.isdir(candidate) else None

    matches: List[str] = []
    for plug in get_registered_plugs():
        candidate = os.path.join(PROJECT_ROOT, plug, app_name)
        if os.path.isdir(candidate):
            matches.append(candidate)

    if len(matches) == 1:
        return matches[0]
    return None


def get_app_module_path(app_name: str, plug_name: Optional[str] = None) -> Optional[str]:
    app_root = get_app_root_path(app_name, plug_name=plug_name)
    if not app_root:
        return None
    module_root = os.path.join(app_root, app_name)
    return module_root if os.path.isdir(module_root) else None



def find_django_path(site: str) -> str:
    return os.path.join(PROJECT_ROOT, f"manifold")


def write_running_ports(django_port: int, nextjs_port: int) -> None:
    next_path = os.path.join(PROJECT_ROOT)
    env_file_path = os.path.join(next_path, ".env.local")

    # Update the .env.local file
    if not os.path.exists(env_file_path):
        with open(env_file_path, "w") as f:
            f.write(f"NEXT_PUBLIC_DJANGO_PORT={django_port}\n")
            f.write(f"NEXT_PUBLIC_NEXTJS_PORT={nextjs_port}\n")
    else:
        with open(env_file_path, "r") as f:
            lines = f.readlines()

        with open(env_file_path, "w") as f:
            updated = False
            for line in lines:
                if line.startswith("NEXT_PUBLIC_DJANGO_PORT="):
                    f.write(f"NEXT_PUBLIC_DJANGO_PORT={django_port}\n")
                    updated = True
                elif line.startswith("NEXT_PUBLIC_NEXTJS_PORT="):
                    f.write(f"NEXT_PUBLIC_NEXTJS_PORT={nextjs_port}\n")
                    updated = True
                else:
                    f.write(line)

            if not updated:
                f.write(f"NEXT_PUBLIC_DJANGO_PORT={django_port}\n")
                f.write(f"NEXT_PUBLIC_NEXTJS_PORT={nextjs_port}\n")


def find_module_base_path(
    app_name: str, module_name: Optional[str] = None, app_path: Optional[str] = None
) -> Tuple[Optional[str], Optional[str]]:
    """Locate the modules.txt file and determine the base path for modules, searching specified directories.

    Args:
        app_name (str): Name of the app to search within.
        module_name (str, optional): Specific module name to look for within the app. Defaults to None.
        app_path (str, optional): Path to the app directory. If not provided, defaults to APPS_PATH/app_name.

    Returns:
        tuple: Path to modules.txt and the base directory for modules, or (None, None) if not found.
    """
    # Determine base module path either from provided path or by resolving app from plugs.
    if app_path:
        base_path = os.path.join(app_path, app_name)
    else:
        resolved_module_path = get_app_module_path(app_name)
        if not resolved_module_path:
            return None, None
        base_path = resolved_module_path

    # First, check for modules.txt directly in the base_path
    modules_file_path = os.path.join(base_path, "modules.txt")
    if module_name:
        modules_path = os.path.join(base_path, module_name)
        if os.path.isfile(modules_file_path):
            return modules_file_path, modules_path
    else:
        if os.path.isfile(modules_file_path):
            return modules_file_path, base_path

    return None, None


def get_all_sites() -> list: 
    """
    Returns a list of all valid site folder names in the given directory.
    A site is considered valid if it contains a `site_config.json` file.

    Args:
        SITES_PATH (str): Path to the directory containing site subfolders.

    Returns:
        list: A list of valid site folder names.
    """
    valid_sites = []

    for site_folder in os.listdir(SITES_PATH):
        site_path = os.path.join(SITES_PATH, site_folder)
        
        if os.path.isdir(site_path):
            site_config_path = os.path.join(site_path, "site_config.json")
            if os.path.exists(site_config_path):
                valid_sites.append(site_folder)

    return valid_sites


def get_site_config(site_name : str) -> Optional[dict]:
    """
    Returns the site configuration for the given site folder if it exists.

    Args:
        SITES_PATH (str): Path to the directory containing site subfolders.
        site_name (str): Name of the site folder.

    Returns:
        dict or None: The loaded site configuration if valid, otherwise None.
    """
    if not site_name:
        print("Site name is required.")
        return {}
    site_path = os.path.join(SITES_PATH, site_name)
    
    if not os.path.isdir(site_path):
        print(f"Site folder '{site_name}' does not exist.")
        return None
    
    site_config_path = os.path.join(site_path, "site_config.json")
    
    if not os.path.exists(site_config_path):
        print(f"Site '{site_name}' does not contain a site_config.json file.")
        return None
    
    with open(site_config_path, "r") as f:
        site_config = json.load(f)
    return site_config


def update_site_config(site_name: str, config: dict, key: Optional[str] = None) -> None:
    """
    Updates the site configuration for the given site folder. If a key is provided, updates or adds the key.
    Otherwise, replaces the entire configuration. If the configuration file does not exist, it creates one.

    Args:
        site_name (str): Name of the site folder.
        config (dict): Configuration data to update.
        key (str, optional): Specific key to update in the configuration. Defaults to None.
    """
    site_path = os.path.join(SITES_PATH, site_name)
    
    if not os.path.isdir(site_path):
        print(f"Site folder '{site_name}' does not exist.")
        return
    
    site_config_path = os.path.join(site_path, "site_config.json")
    
    if os.path.exists(site_config_path):
        with open(site_config_path, "r") as f:
            site_config = json.load(f)
    else:
        site_config = {}
    
    if key:
        site_config[key] = config
    else:
        site_config = config
    
    with open(site_config_path, "w") as f:
        json.dump(site_config, f, indent=4)
