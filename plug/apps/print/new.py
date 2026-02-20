import os
from typing import List, Optional

import click

from ...sites.migrate.migrate import run_migration
from ...utils.config import PROJECT_ROOT
from ...utils.text import to_snake_case
from .file_handler import create_files


@click.command()
@click.argument("print_name")
@click.option("--app", type=str, help="Select the app by number or name.")
@click.option("--module", type=str, help="Select the module by number or name.")
def newprintformat(print_name: str, app: Optional[str], module: Optional[str]) -> None:
    """
    Create a new printtype folder with default files in the specified module.

    Args:
        print_name (str): The name of the printument.
        app (Optional[str]): The name or number of the app.
        module (Optional[str]): The name or number of the module.
    """
    # Convert inputs to snake_case
    print_id: str = to_snake_case(print_name)
    app = to_snake_case(app) if app else None
    module_id = to_snake_case(module) if module else None

    # Load available apps
    apps_txt_path: str = os.path.join(PROJECT_ROOT, "config", "apps.txt")
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
    selected_app: Optional[str] = determine_app_selection(app, apps)
    if selected_app is None:
        click.echo("Invalid app selection.")
        return

    # Load available modules for the selected app
    module_txt_path: str = os.path.join(
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
    selected_module: Optional[str] = determine_module_selection(module_id, modules)
    if selected_module is None:
        click.echo("Invalid module selection.")
        return

    # Define paths
    module_path: str = os.path.join(
        PROJECT_ROOT, "apps", selected_app, selected_app, selected_module
    )
    create_files(module_path, print_name, print_id, module)
    run_migration(app=app, module=module)


def determine_app_selection(app: Optional[str], apps: List[str]) -> Optional[str]:
    """
    Determine the app selection based on user input or provided app name.

    Args:
        app (Optional[str]): The name or number of the app.
        apps (List[str]): The list of available apps.

    Returns:
        Optional[str]: The selected app name or None if invalid.
    """
    if app is None:
        click.echo("Select an app:")
        for i, app_name in enumerate(apps):
            click.echo(f"{i + 1}: {app_name}")
        app_choice: str = click.prompt(
            "Enter the number of the app or the app name", type=str
        )
        if app_choice.isdigit():
            app_index: int = int(app_choice) - 1
            return apps[app_index] if 0 <= app_index < len(apps) else None
        else:
            return (
                to_snake_case(app_choice) if to_snake_case(app_choice) in apps else None
            )
    else:
        return app if app in apps else None


def determine_module_selection(
    module_id: Optional[str], modules: List[str]
) -> Optional[str]:
    """
    Determine the module selection based on user input or provided module name.

    Args:
        module_id (Optional[str]): The name or number of the module.
        modules (List[str]): The list of available modules.

    Returns:
        Optional[str]: The selected module name or None if invalid.
    """
    if module_id is None:
        click.echo("Select a module:")
        for i, module_name in enumerate(modules):
            click.echo(f"{i + 1}: {module_name}")
        module_choice: str = click.prompt(
            "Enter the number of the module or the module name", type=str
        )
        if module_choice.isdigit():
            module_index: int = int(module_choice) - 1
            return modules[module_index] if 0 <= module_index < len(modules) else None
        else:
            return (
                to_snake_case(module_choice)
                if to_snake_case(module_choice) in modules
                else None
            )
    else:
        return module_id if module_id in modules else None
