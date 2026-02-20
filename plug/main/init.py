import json
import os
import shutil
import subprocess
import tempfile
from typing import Any, List

import click

from ..utils.file_operations import ensure_file_exists
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@click.command()
@click.argument("name", required=False, default=".")
def init(name: str) -> None:
    """
    Initialize a new project similar to bench init.

    :param name: The name of the project directory.
    """
    perform_init(name)


def perform_init(name: str) -> None:
    """
    Initialize a new project similar to bench init.

    :param name: The name of the project directory.
    """

    # Determine project root
    project_root: str = os.path.abspath(name)
    if name != ".":
        os.makedirs(project_root, exist_ok=True)

    # Define necessary directories
    directories: List[str] = ["apps", "config", "logs", "sites"]
    for directory in directories:
        os.makedirs(os.path.join(project_root, directory), exist_ok=True)

    # Create necessary files
    sites_json_path: str = os.path.join(project_root, "sites", "common_site_config.json") 
    procfile_path: str = os.path.join(project_root, "Procfile")
    plug_config_path: str = os.path.join(project_root, "3plug.config")

    ensure_file_exists(sites_json_path, initial_data={})
    ensure_file_exists(plug_config_path, initial_data=[])

    with open(procfile_path, "w") as procfile:
        procfile.write(
            """
web: 3plug start
redis_cache: redis-server config/redis_cache.conf
redis_queue: redis-server config/redis_queue.conf
worker: 3plug worker
schedule: 3plug schedule
"""
        )

    # Clone mainsite into sites/default
    core_apps_path: str = os.path.join(project_root, "apps", "core")
    repo_url: str = "https://github.com/Triotek-Ltd/3plug-core.git"
    frappe_apps_path = os.path.join(project_root, "apps", "frappe")
    frappe_repo_url = "https://github.com/Triotek-Ltd/frappe.git"

    # Clone and move 3plug-core repository
    with tempfile.TemporaryDirectory() as temp_dir_plug:
        plug_clone_path = os.path.join(temp_dir_plug, "3plug-core")
        if not clone_repository(repo_url, plug_clone_path):
            return

        if not move_repository_contents(plug_clone_path, core_apps_path):
            return

    # Clone and move frappe repository
    with tempfile.TemporaryDirectory() as temp_dir_frappe:
        frappe_clone_path = os.path.join(temp_dir_frappe, "frappe")
        if not clone_repository(frappe_repo_url, frappe_clone_path):
            return

        if not move_repository_contents(frappe_clone_path, frappe_apps_path):
            return

            
    try:
        with open(sites_json_path, "r") as json_file:
            site_config: dict[str, Any] = json.load(json_file) or {}
    except json.JSONDecodeError:
        site_config = {}

    # Assign available ports
    django_port: int = site_config.get("django_port", 8000)
    nextjs_port: int = site_config.get("nextjs_port", 3000)

    # Update site_config with the assigned ports
    site_config["django_port"] = django_port
    site_config["nextjs_port"] = nextjs_port

    # Write the updated configuration back to the file
    with open(sites_json_path, "w") as json_file:
        json.dump(site_config, json_file, indent=4)

    click.echo("Project initialized successfully!")

    # Run post-install commands
    try:
        # subprocess.check_call(["3plug", "install"])
        subprocess.check_call(["3plug", "migrate"])
        subprocess.check_call(["3plug", "django", "createsuperuser"])
        click.echo("Successfully initialized project.")
    except subprocess.CalledProcessError as e:
        click.echo(f"Failed to run post-creation commands: {e}", err=True)



def clone_repository(repo_url: str, target_path: str) -> bool:
    """Clone a Git repository to the target path."""
    try:
        subprocess.check_call(["git", "clone", repo_url, target_path])
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"Failed to clone the repository {repo_url}: {e}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error while cloning {repo_url}: {e}")
        return False

def move_repository_contents(source_path: str, destination_path: str) -> bool:
    """Move contents from the source path to the destination path."""
    try:
        # Ensure the destination directory exists
        os.makedirs(destination_path, exist_ok=True)

        # Move each item from the source to the destination
        for item in os.listdir(source_path):
            shutil.move(os.path.join(source_path, item), destination_path)
        return True
    except Exception as e:
        logger.error(f"Failed to move contents from {source_path} to {destination_path}: {e}")
        return False
