import json
import os
import shutil
import subprocess
from typing import List

import click

from ..sites.utils.uninstalldjangoapp import uninstall_django_app
from ..utils.config import PROJECT_ROOT


@click.command()
@click.argument("app")
def dropapp(app: str) -> None:
    """
    Delete the specified Django app, uninstall it from all sites using `3plug uninstallapp`,
    and remove it from the configuration.

    Args:
        app (str): The name of the app to delete.
    """
    # Path to the custom app directory
    apps_txt_path: str = os.path.join(PROJECT_ROOT, "config", "apps.txt")
    if not os.path.exists(apps_txt_path):
        click.echo("No apps found in apps.txt.")
        return

    # Load apps from apps.txt
    with open(apps_txt_path, "r") as settings_file:
        apps: List[str] = [
            line.strip()
            for line in settings_file.readlines()
            if line.strip() and not line.startswith("#")
        ]

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
            click.echo(f"App '{app}' not found in apps.txt.")
            return

    # Confirm the deletion
    confirm: bool = click.confirm(
        f"Are you sure you want to delete the app '{selected_app}'?", default=False
    )
    if not confirm:
        click.echo("App deletion canceled.")
        return

    # Path to the app folder
    custom_app_path: str = os.path.join(PROJECT_ROOT, "apps", selected_app)

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

    # Remove the app entry from apps.txt
    with open(apps_txt_path, "w") as settings_file:
        for line in apps:
            if line.strip() != selected_app:
                settings_file.write(line + "\n")

    click.echo(f"The app '{selected_app}' has been removed from apps.txt.")
