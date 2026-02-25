import json
import os
import shutil
import sys
import tempfile
import traceback
from typing import List

import click

from ...sites.migrate.migrate import run_migration
from ...utils.config import get_app_module_path
from ...utils.text import to_snake_case, underscore_to_titlecase_main


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
    app_name = to_snake_case(app_name)
    app_path = get_app_module_path(app_name)

    if not app_path or not os.path.exists(app_path):
        click.echo(f"The app '{app_name}' does not exist.")
        return
    final_module_path: str = os.path.join(app_path, module_name)

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

        # Subfolders to create (legacy bridge + 3plug hierarchy)
        subfolders: List[str] = [
            "doctype",
            "doc",
            "submodule",
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

        # New 3plug registries for module scaffolding
        open(os.path.join(temp_module_path, "submodules.txt"), "w").close()
        open(os.path.join(temp_module_path, "docs.txt"), "w").close()

        module_meta = {
            "id": module_name,
            "title": underscore_to_titlecase_main(module_name),
            "app_id": app_name,
            "type": "module",
            "status": "draft",
            "supports_submodules": True,
        }
        with open(
            os.path.join(temp_module_path, "module.json"), "w", encoding="utf-8"
        ) as module_meta_file:
            json.dump(module_meta, module_meta_file, indent=2)
            module_meta_file.write("\n")
        with open(
            os.path.join(temp_module_path, "module.schema.json"), "w", encoding="utf-8"
        ) as module_schema_file:
            json.dump(
                {
                    "id": module_name,
                    "entity": "module",
                    "children": {
                        "submodules_registry": "submodules.txt",
                        "docs_registry": "docs.txt",
                    },
                    "supports": ["submodule", "doc", "report", "dashboard", "print_format", "workspace"],
                },
                module_schema_file,
                indent=2,
            )
            module_schema_file.write("\n")

        # Update modules.txt cleanly
        modules_txt_path: str = os.path.join(app_path, "modules.txt")

        if os.path.exists(modules_txt_path):
            with open(modules_txt_path, "r") as f:
                existing_modules = [line.strip() for line in f if line.strip()]
        else:
            existing_modules = []

        if module_name not in [to_snake_case(m) for m in existing_modules]:
            existing_modules.append(module_name)

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
