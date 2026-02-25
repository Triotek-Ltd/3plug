import os
import shutil
from typing import List, Optional

import click

from ...sites.migrate.migrate import run_migration
from ...utils.config import PROJECT_ROOT, get_app_module_path, get_registered_apps
from ...utils.text import to_snake_case


@click.command()
@click.argument("doc_name")
@click.option("--app", type=str, help="Select the app by number or name.")
@click.option("--module", type=str, help="Select the module by number or name.")
@click.option(
    "--submodule",
    "submodule_name",
    type=str,
    default=None,
    help="Optional submodule name/number (3plug hierarchy).",
)
def dropdoc(
    doc_name: str, app: Optional[str], module: Optional[str], submodule_name: Optional[str]
) -> None:
    """
    Delete the specified document folder from the module and remove it from the document list.

    Args:
        doc_name (str): The name of the document folder to delete.
        app (Optional[str]): The app name or number.
        module (Optional[str]): The module name or number.
    """
    # Convert inputs to snake_case
    doc_name = to_snake_case(doc_name)
    app = to_snake_case(app) if app else None
    module = to_snake_case(module) if module else None
    submodule_name = to_snake_case(submodule_name) if submodule_name else None

    # Load available apps
    apps: List[str] = [to_snake_case(app_name) for app_name in get_registered_apps()]

    if not apps:
        click.echo("No apps found.")
        return

    # Determine app selection
    selected_app = determine_app_selection(app, apps)
    if selected_app is None:
        click.echo("Invalid app selection.")
        return

    # Load available modules for the selected app
    module_base_path = get_app_module_path(selected_app)
    if not module_base_path:
        click.echo(f"Could not locate app '{selected_app}' in any plug.")
        return
    module_txt_path = os.path.join(module_base_path, "modules.txt")
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

    module_path = os.path.join(module_base_path, selected_module)

    # Path to the doc folder (prefer 3plug hierarchy if submodule is provided/found)
    doc_path = None
    if submodule_name:
        candidate = os.path.join(
            module_path, "submodule", submodule_name, "docs", doc_name
        )
        if os.path.exists(candidate):
            doc_path = candidate
    if doc_path is None:
        candidate = os.path.join(module_path, "doc", doc_name)
        if os.path.exists(candidate):
            doc_path = candidate

    # Always remove legacy bridge folder if present
    legacy_doc_path = os.path.join(module_path, "doctype", doc_name)

    # Check if the doc folder exists
    if doc_path is None and not os.path.exists(legacy_doc_path):
        click.echo(f"Doc '{doc_name}' not found.")
        return

    # Remove the doc directory/directories
    if doc_path and os.path.exists(doc_path):
        shutil.rmtree(doc_path)
    if os.path.exists(legacy_doc_path):
        shutil.rmtree(legacy_doc_path)

    _remove_doc_from_indexes(module_path, doc_name, submodule_name)
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


def _remove_doc_from_indexes(
    module_path: str, doc_name: str, submodule_name: Optional[str]
) -> None:
    docs_txt = os.path.join(module_path, "docs.txt")
    if os.path.exists(docs_txt):
        with open(docs_txt, "r", encoding="utf-8") as f:
            entries = [line.strip() for line in f if line.strip()]
        filtered = []
        for entry in entries:
            if entry == doc_name:
                continue
            if submodule_name and entry == f"{submodule_name}/{doc_name}":
                continue
            if entry.endswith(f"/{doc_name}"):
                # remove any stale submodule entry if doc was targeted by name
                continue
            filtered.append(entry)
        with open(docs_txt, "w", encoding="utf-8") as f:
            if filtered:
                f.write("\n".join(filtered) + "\n")

    if submodule_name:
        sub_docs_txt = os.path.join(module_path, "submodule", submodule_name, "docs.txt")
        if os.path.exists(sub_docs_txt):
            with open(sub_docs_txt, "r", encoding="utf-8") as f:
                entries = [line.strip() for line in f if line.strip()]
            entries = [entry for entry in entries if entry != doc_name]
            with open(sub_docs_txt, "w", encoding="utf-8") as f:
                if entries:
                    f.write("\n".join(entries) + "\n")
