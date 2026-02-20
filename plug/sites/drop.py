import os
import platform
import subprocess
from typing import Any, Dict, List

import click

from ..sites.migrate.migrate import run_migration
from ..utils.config import PROJECT_ROOT, get_all_sites


@click.command()
@click.option("--site", type=str, help="The name of the site to delete.")
def dropsite(site: str) -> None:
    """
    Delete a site and remove its entry from sites.json.

    Args:
        site (str): The name of the site to delete.
    """
    
    # Prompt for site if not provided
    if not site:
        sites: List[Dict[str, Any]] = get_all_sites()
        click.echo("Select a site to delete:")
        for i, site_entry in enumerate(sites, 1):
            click.echo(f"{i}. {site_entry}")

        site_choice: int = click.prompt(
            "Enter the number of the site to delete", type=int
        )

        if site_choice < 1 or site_choice > len(sites):
            click.echo("Invalid site selection.")
            return

        site = sites[site_choice - 1]

    # Confirm the deletion
    confirm: bool = click.confirm(
        f"Are you sure you want to delete the site '{site}'?",
        default=False,
    )
    if not confirm:
        click.echo("Site deletion canceled.")
        return

    # Delete the site folder with admin/superuser privileges
    site_folder_path: str = os.path.join(
        PROJECT_ROOT, "sites", site
    )

    try:
        if os.path.exists(site_folder_path):
            click.echo(
                f"Attempting to delete the site folder '{site_folder_path}' with admin privileges..."
            )

            if platform.system() == "Windows":
                # Use PowerShell on Windows
                powershell_command: str = (
                    f'Remove-Item -Recurse -Force "{site_folder_path}"'
                )
                subprocess.check_call(
                    ["powershell", "-Command", powershell_command], shell=True
                )
            else:
                # Use sudo rm -rf on Unix-based systems
                subprocess.check_call(["sudo", "rm", "-rf", site_folder_path])

            click.echo(f"Deleted the site folder '{site_folder_path}'.")
        else:
            click.echo(f"Site folder '{site_folder_path}' does not exist.")
    except subprocess.CalledProcessError as e:
        click.echo(f"Error deleting site folder: {e}")
        return

    click.echo(
        f"Site '{site}' has been successfully removed."
    )

    run_migration()
