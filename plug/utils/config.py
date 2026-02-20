import json
import os
from typing import Optional, Tuple

import click

from ..utils.file_operations import ensure_file_exists
from .default_site import get_default_site_info

def find_project_root(current_path: str) -> str:
    while current_path != "/":
        if "3plug.config" in os.listdir(current_path):
            return current_path
        current_path = os.path.dirname(current_path)
    raise FileNotFoundError("Project root with '3plug.config' not found.")

PROJECT_ROOT = find_project_root(os.getcwd())
APPS_TXT_PATH = os.path.join(PROJECT_ROOT, "config", "apps.txt")
# SITES_JSON_PATH = os.path.join(PROJECT_ROOT, "sites", "sites.json")
DOCS_JSON_PATH = os.path.join(PROJECT_ROOT, "sites", "doctypes.json")
PRINT_JSON_PATH = os.path.join(PROJECT_ROOT, "sites", "print_formats.json")
APPS_PATH = os.path.join(PROJECT_ROOT, "apps")
DJANGO_PATH = os.path.join(PROJECT_ROOT, "manifold")
DEFAULT_SITE = get_default_site_info(PROJECT_ROOT)
SITES_PATH = os.path.join(PROJECT_ROOT, "sites")



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
    # Determine the base path for the app, defaults to APPS_PATH/app_name
    base_path = os.path.join(APPS_PATH, app_name, app_name)

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
