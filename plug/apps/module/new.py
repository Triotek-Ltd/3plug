import os
import shutil
import sys
import tempfile
import traceback
from typing import List

import click

from ...sites.migrate.migrate import run_migration
from ...utils.config import PROJECT_ROOT
from ...utils.text import to_snake_case


@click.command()
@click.argument("app_name")
@click.argument("module")
def newmodule(app_name: str, module: str) -> None:
    """
    Create a new module within the specified Django app.

    Args:
        app_name (str): The name of the Django app.
        module (str): The name of the new module to create.
    """
    module_name = to_snake_case(module)
    app_path: str = os.path.join(PROJECT_ROOT, "apps", app_name, app_name)
    final_module_path: str = os.path.join(app_path, module_name)

    if not os.path.exists(app_path):
        click.echo(f"The app '{app_name}' does not exist.")
        return

    if os.path.exists(final_module_path):
        click.echo(f"The module '{module}' already exists in '{app_name}'.")
        return

    # Create temporary directory for module
    temp_dir = tempfile.mkdtemp()
    temp_module_path = os.path.join(temp_dir, module_name)
    try:
        os.makedirs(temp_module_path, exist_ok=True)

        # Create __init__.py in module
        open(os.path.join(temp_module_path, "__init__.py"), "w").close()

        # Subfolders to create
        subfolders: List[str] = [
            "doctype",
            "dashboard",
            "report",
            "script",
            "dashboard_chart",
            "print_format",
            "workspace",
        ]

        for sub in subfolders:
            folder_path = os.path.join(temp_module_path, sub)
            os.makedirs(folder_path, exist_ok=True)
            open(os.path.join(folder_path, "__init__.py"), "w").close()

        # Update modules.txt cleanly
        modules_txt_path: str = os.path.join(app_path, "modules.txt")

        if os.path.exists(modules_txt_path):
            with open(modules_txt_path, "r") as f:
                existing_modules = [line.strip() for line in f if line.strip()]
        else:
            existing_modules = []

        if module not in existing_modules:
            existing_modules.append(module)

        with open(modules_txt_path, "w") as f:
            f.write("\n".join(existing_modules) + "\n")

        # Move temp module folder to final destination
        shutil.move(temp_module_path, final_module_path)

        click.echo(f"The module '{module}' has been created successfully in '{app_name}'.")

    except Exception as e:
        click.echo(f"Failed to create module '{module}': {e}")
        exc_type, exc_value, exc_tb = sys.exc_info()
        traceback.print_exception(exc_type, exc_value, exc_tb)

        # Rollback any changes
        if os.path.exists(modules_txt_path):
            # Restore original modules.txt by removing the module if it was added
            try:
                with open(modules_txt_path, "r") as f:
                    lines = [line.strip() for line in f if line.strip()]
                lines = [line for line in lines if line != module]
                with open(modules_txt_path, "w") as f:
                    f.write("\n".join(lines) + "\n")
            except Exception as rollback_error:
                click.echo(f"Rollback error on modules.txt: {rollback_error}")

        if os.path.exists(final_module_path):
            shutil.rmtree(final_module_path)

        click.echo(f"Rolled back the creation of the module '{module}'.")

    finally:
        # Clean up temporary directory
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)

    run_migration()
