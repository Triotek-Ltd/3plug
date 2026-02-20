import json
import os
from typing import List, Optional

import click

from ..sites.migrate.migrate import run_migration
from ..utils.config import DEFAULT_SITE, DJANGO_PATH, PROJECT_ROOT
from ..utils.file_operations import ensure_file_exists


@click.command()
@click.option(
    "--site", type=str, help="The name of the site where the module will be installed."
)
@click.option("--app", type=str, help="The name of the app containing the module.")
@click.option("--module", type=str, help="The name of the module to install.")
@click.option("--doc", type=str, help="The name of the doc to install.")
def installdoc(
    site: Optional[str], app: Optional[str], module: Optional[str], doc: Optional[str]
) -> None:
    """
    Install a doc into a selected app without modifying sites.json.

    Args:
        site (Optional[str]): The name of the site where the module will be installed.
        app (Optional[str]): The name of the app containing the module.
        module (Optional[str]): The name of the module to install.
        doc (Optional[str]): The name of the doc to install.
    """

    if not site:
        site = DEFAULT_SITE

    # Load available apps from apps.txt
    apps_txt_path = os.path.join(PROJECT_ROOT, "config", "apps.txt")
    with open(apps_txt_path, "r") as apps_file:
        apps = [
            line.strip()
            for line in apps_file
            if line.strip() and not line.startswith("#")
        ]

    # Prompt for app if not provided
    if not app:
        click.echo(f"Select an app to install the module in '{site}':")
        for i, app_entry in enumerate(apps, 1):
            click.echo(f"{i}. {app_entry}")

        app_choice = click.prompt("Enter the number of the app", type=int)

        if app_choice < 1 or app_choice > len(apps):
            click.echo("Invalid app selection.")
            return

        app = apps[app_choice - 1]

    app_name = f"{app}_app"

    # Load available modules from modules.txt
    custom_app_path = os.path.join(PROJECT_ROOT, "apps", app)
    module_txt_path = os.path.join(custom_app_path, "modules.txt")
    if not os.path.exists(module_txt_path):
        click.echo(f"modules.txt not found in {custom_app_path}.")
        return

    with open(module_txt_path, "r") as module_file:
        available_modules = [
            line.strip()
            for line in module_file
            if line.strip() and not line.startswith("#")
        ]

    # Prompt for module if not provided
    if not module:
        click.echo("Select a module to install:")
        for i, mod in enumerate(available_modules, 1):
            click.echo(f"{i}. {mod}")

        module_choice = click.prompt("Enter the number of the module", type=int)

        if module_choice < 1 or module_choice > len(available_modules):
            click.echo("Invalid module selection.")
            return

        module = available_modules[module_choice - 1]

    # Define the app path
    django_path = os.path.join(DJANGO_PATH, app_name)

    structure = ["views", "models", "tests", "serializers", "filters"]

    for folder in structure:
        folder_path = os.path.join(django_path, folder)
        os.makedirs(folder_path, exist_ok=True)  # Ensure the folder exists

        # Initialize __init__.py content
        init_imports: List[str] = []
        module_path = os.path.join(folder_path, module)
        os.makedirs(module_path, exist_ok=True)  # Create module folder

        # Create individual files for each document in the module's folder
        doc_base_path = os.path.join(custom_app_path, module, "doc")

        if os.path.exists(doc_base_path):
            # Prompt for doc if not provided
            if not doc:
                click.echo("Select a doc to install:")
                docs = [
                    d
                    for d in os.listdir(doc_base_path)
                    if os.path.isdir(os.path.join(doc_base_path, d))
                ]

                for i, doc_folder in enumerate(docs, 1):
                    click.echo(f"{i}. {doc_folder}")

                doc_choice = click.prompt("Enter the number of the doc", type=int)

                if doc_choice < 1 or doc_choice > len(docs):
                    click.echo("Invalid doc selection.")
                    return

                doc = docs[doc_choice - 1]

            subfolder_path = os.path.join(doc_base_path, doc)

            if os.path.isdir(subfolder_path):
                # Create a .py file for the folder only if it doesn't exist
                doc_file_path = os.path.join(module_path, f"{doc}.py")
                if not os.path.exists(doc_file_path):
                    with open(doc_file_path, "w") as f:
                        f.write(f"# {doc}.py for {folder} in {module} module\n")

                # Add import statement to init_imports
                import_statement = f"from .{module}.{doc} import *\n"
                if import_statement not in init_imports:
                    init_imports.append(import_statement)

                # Handle __init__.py if necessary
                init_file_path = os.path.join(module_path, "__init__.py")
                if not os.path.exists(init_file_path):
                    with open(init_file_path, "w") as f:
                        f.write(f"# __init__.py for {folder} in {module} module\n")

        # Write import statements to __init__.py only if they are new
        init_file_path = os.path.join(folder_path, "__init__.py")
        with open(init_file_path, "a") as init_file:
            init_file.write(f"# {folder}\n")
            for import_stmt in init_imports:
                if (
                    import_stmt not in open(init_file_path).read()
                ):  # Check if import already exists
                    init_file.write(import_stmt)

    click.echo(
        f"Doc '{doc}' installed for module '{module}' in '{app}' for site '{site}'."
    )
    run_migration()


if __name__ == "__main__":
    installdoc()
