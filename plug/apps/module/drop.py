import os
import shutil
import sys
import traceback
from typing import List

import click

from ...sites.migrate.migrate import run_migration
from ...utils.config import PROJECT_ROOT


@click.command()
@click.argument("app_name")
@click.argument("module_name")
def dropmodule(app_name: str, module_name: str) -> None:
    """
    Delete the specified module from the Django app and remove it from modules.txt.

    Args:
        app_name (str): The name of the Django app.
        module_name (str): The name of the module to be deleted.
    """
    # Path to the app's module directory
    app_path = os.path.join(PROJECT_ROOT, "apps", app_name)
    module_path = os.path.join(app_path, module_name)

    # Check if the app folder exists
    if not os.path.exists(app_path):
        click.echo(f"The app '{app_name}' does not exist.")
        return

    # Check if the module folder exists
    if not os.path.exists(module_path):
        click.echo(f"The module '{module_name}' does not exist in '{app_name}'.")
        return

    # Attempt to remove the module directory
    try:
        shutil.rmtree(module_path)
    except Exception as e:
        click.echo(f"An error occurred while trying to delete the module: {e}")
        return

    # Remove the module from modules.txt
    modules_txt_path = os.path.join(app_path, "modules.txt")
    try:
        with open(modules_txt_path, "r") as modules_file:
            modules: List[str] = modules_file.readlines()

        with open(modules_txt_path, "w") as modules_file:
            for line in modules:
                if line.strip() != module_name:
                    modules_file.write(line)

        click.echo(f"The module '{module_name}' has been removed.")
    except Exception as e:
        click.echo(f"Failed to update modules.txt: {e}")
        exc_type, exc_value, exc_tb = sys.exc_info()
        traceback.print_exception(exc_type, exc_value, exc_tb)

    run_migration()
