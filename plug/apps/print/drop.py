import os
import shutil
from typing import List, Optional

import click

from ...sites.migrate.migrate import run_migration
from ...utils.config import PROJECT_ROOT
from ...utils.text import to_snake_case


@click.command()
@click.argument("print_name")
@click.option("--app", type=str, help="Select the app by number or name.")
@click.option("--module", type=str, help="Select the module by number or name.")
def dropprintformat(print_name: str, app: Optional[str], module: Optional[str]) -> None:
    """
    Delete the specified printument folder from the module and remove it from the printument list.

    Args:
        print_name (str): The name of the printument folder to delete.
        app (Optional[str]): The app name or number.
        module (Optional[str]): The module name or number.
    """
    # Convert inputs to snake_case
    print_name = to_snake_case(print_name)
    app = to_snake_case(app) if app else None
    module = to_snake_case(module) if module else None

    # Load available apps
    apps_txt_path = os.path.join(PROJECT_ROOT, "config", "apps.txt")
    apps: List[str] = []
    with open(apps_txt_path, "r") as f:
        apps = [
            to_snake_case(line.strip())
            for line in f
            if line.strip() and not line.startswith("#")
        ]

    if not apps:
        click.echo("No apps found.")
        return

    # Determine app selection
    selected_app = determine_app_selection(app, apps)
    if selected_app is None:
        click.echo("Invalid app selection.")
        return

    # Load available modules for the selected app
    module_txt_path = os.path.join(
        PROJECT_ROOT, "apps", selected_app, selected_app, "modules.txt"
    )
    modules: List[str] = []
    with open(module_txt_path, "r") as f:
        modules = [
            to_snake_case(line.strip())
            for line in f
            if line.strip() and not line.startswith("#")
        ]

    if not modules:
        click.echo(f"No modules found for app '{selected_app}'.")
        return

    # Determine module selection
    selected_module = determine_module_selection(module, modules)
    if selected_module is None:
        click.echo("Invalid module selection.")
        return

    # Path to the print folder
    print_path = os.path.join(
        PROJECT_ROOT,
        "apps",
        selected_app,
        selected_app,
        selected_module,
        "print_format",
        print_name,
    )

    # Check if the print folder exists
    if not os.path.exists(print_path):
        return

    # Remove the print directory
    shutil.rmtree(print_path)
    run_migration(app=selected_app, module=selected_module)


def determine_app_selection(app: Optional[str], apps: List[str]) -> Optional[str]:
    """
    Determine the app selection based on user input or provided app name.

    Args:
        app (Optional[str]): The app name or number.
        apps (List[str]): List of available apps.

    Returns:
        Optional[str]: The selected app name or None if invalid.
    """
    if app is None:
        click.echo("Select an app:")
        for i, app_name in enumerate(apps):
            click.echo(f"{i + 1}: {app_name}")
        app_choice = click.prompt(
            "Enter the number of the app or the app name", type=str
        )
        if app_choice.isdigit():
            app_index = int(app_choice) - 1
            return apps[app_index] if 0 <= app_index < len(apps) else None
        else:
            return (
                to_snake_case(app_choice) if to_snake_case(app_choice) in apps else None
            )
    else:
        return app if app in apps else None


def determine_module_selection(
    module: Optional[str], modules: List[str]
) -> Optional[str]:
    """
    Determine the module selection based on user input or provided module name.

    Args:
        module (Optional[str]): The module name or number.
        modules (List[str]): List of available modules.

    Returns:
        Optional[str]: The selected module name or None if invalid.
    """
    if module is None:
        click.echo("Select a module:")
        for i, module_name in enumerate(modules):
            click.echo(f"{i + 1}: {module_name}")
        module_choice = click.prompt(
            "Enter the number of the module or the module name", type=str
        )
        if module_choice.isdigit():
            module_index = int(module_choice) - 1
            return modules[module_index] if 0 <= module_index < len(modules) else None
        else:
            return (
                to_snake_case(module_choice)
                if to_snake_case(module_choice) in modules
                else None
            )
    else:
        return module if module in modules else None
