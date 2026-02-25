import os
import shutil
import subprocess
from typing import List

import click

from ..sites.utils.uninstalldjangoapp import uninstall_django_app
from ..utils.config import (
    PROJECT_ROOT,
    get_app_root_path,
    get_registered_apps,
    remove_plug_app,
)


@click.command()
@click.argument("app")
@click.option(
    "--bundle",
    "--plug",
    "plug_name",
    default=None,
    help="Optional bundle name to disambiguate app location (legacy alias: --plug).",
)
def dropapp(app: str, plug_name: str) -> None:
    """
    Delete the specified Django app, uninstall it from all sites using `3plug uninstallapp`,
    and remove it from the configuration.

    Args:
        app (str): The name of the app to delete.
    """
    # Path to the custom app directory
    # Load apps from plug apps.txt files
    apps: List[str] = get_registered_apps()
    if not apps:
        click.echo("No apps found in plug registries.")
        return

    # Prompt for app if not provided
    if not app:
        click.echo("Select an app to delete:")
        for i, app_entry in enumerate(apps, 1):
            click.echo(f"{i}. {app_entry}")

        app_choice: int = click.prompt(
            "Enter the number of the app to delete", type=int
        )

        if app_choice < 1 or app_choice > len(apps):
            click.echo("Invalid app selection.")
            return

        selected_app: str = apps[app_choice - 1]
    else:
        selected_app = app
        if selected_app not in apps:
            click.echo(f"App '{app}' not found in plug registries.")
            return

    # Confirm the deletion
    confirm: bool = click.confirm(
        f"Are you sure you want to delete the app '{selected_app}'?", default=False
    )
    if not confirm:
        click.echo("App deletion canceled.")
        return

    # Path to the app folder
    custom_app_path = get_app_root_path(selected_app, plug_name=plug_name)
    if not custom_app_path:
        click.echo(
            f"App folder for '{selected_app}' was not found. "
            "Provide --plug if the app name exists in multiple plugs."
        )
        return

    # Delete the app folder using PowerShell with admin privileges on Windows
    try:
        if os.path.exists(custom_app_path):
            click.echo(
                f"Attempting to delete the app folder '{custom_app_path}' with admin privileges..."
            )

            if os.name == "nt": 
                powershell_command: str = (
                    f'Remove-Item -Recurse -Force "{custom_app_path}"'
                )
                subprocess.check_call(
                    ["powershell", "-Command", powershell_command], shell=True
                )
            else:
                # For Unix-based systems, use shutil.rmtree
                shutil.rmtree(custom_app_path)

            click.echo(f"Deleted the app folder '{custom_app_path}'.")

            uninstall_django_app(selected_app, PROJECT_ROOT)
        else:
            click.echo(f"App folder '{custom_app_path}' does not exist.")
    except subprocess.CalledProcessError as e:
        click.echo(f"Error deleting app folder: {e}")
        return

    # Remove the app entry from plug apps.txt
    resolved_plug_name = os.path.basename(os.path.dirname(custom_app_path))
    remove_plug_app(resolved_plug_name, selected_app)
    click.echo(f"The app '{selected_app}' has been removed from plug apps.txt.")
