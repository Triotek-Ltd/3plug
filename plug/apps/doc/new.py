import os
from typing import List, Optional

import click

from ...sites.migrate.migrate import run_migration
from ...utils.config import get_app_module_path, get_registered_apps, validate_non_reserved_name
from ...utils.text import to_snake_case
from .file_handler import create_files


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
def newdoc(
    doc_name: str,
    app: Optional[str],
    module: Optional[str],
    submodule_name: Optional[str],
) -> None:
    """
    Create a new 3plug doc scaffold (with legacy doctype bridge files) in a module/submodule.

    Args:
        doc_name (str): The name of the document.
        app (Optional[str]): The name or number of the app.
        module (Optional[str]): The name or number of the module.
    """
    doc_name = validate_non_reserved_name(doc_name, "doc")
    if app:
        app = validate_non_reserved_name(app, "app")
    if module:
        module = validate_non_reserved_name(module, "module")
    if submodule_name:
        submodule_name = validate_non_reserved_name(submodule_name, "submodule")

    # Convert inputs to snake_case
    doc_id: str = to_snake_case(doc_name)
    app = to_snake_case(app) if app else None
    module_id = to_snake_case(module) if module else None
    submodule_id_input = to_snake_case(submodule_name) if submodule_name else None

    # Load available apps
    apps: List[str] = [to_snake_case(app_name) for app_name in get_registered_apps()]

    if not apps:
        click.echo("No apps found.")
        return

    # Determine app selection
    selected_app: Optional[str] = determine_app_selection(app, apps)
    if selected_app is None:
        click.echo("Invalid app selection.")
        return

    # Load available modules for the selected app
    module_base_path = get_app_module_path(selected_app)
    if not module_base_path:
        click.echo(f"Could not locate app '{selected_app}' in any plug.")
        return
    module_txt_path: str = os.path.join(module_base_path, "modules.txt")
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

    module_path: str = os.path.join(module_base_path, selected_module)
    # Determine optional submodule selection (3plug hierarchy)
    submodule_id = determine_submodule_selection(
        module_path=module_path,
        submodule_id=submodule_id_input,
    )
    if submodule_id_input and submodule_id is None:
        click.echo("Invalid submodule selection.")
        return

    created_path = create_files(
        module_path,
        doc_name,
        doc_id,
        selected_module,
        app_name=selected_app,
        submodule_id=submodule_id,
    )
    register_doc_indexes(module_path, doc_id, submodule_id=submodule_id)
    click.echo(f"Created doc scaffold at: {created_path}")
    run_migration(app=selected_app, module=selected_module, doc=doc_name)


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


def determine_submodule_selection(
    module_path: str, submodule_id: Optional[str] = None
) -> Optional[str]:
    submodules_txt = os.path.join(module_path, "submodules.txt")
    if not os.path.exists(submodules_txt):
        return None

    with open(submodules_txt, "r", encoding="utf-8") as f:
        submodules = [
            to_snake_case(line.strip())
            for line in f
            if line.strip() and not line.strip().startswith("#")
        ]
    if not submodules:
        return None

    if submodule_id is not None:
        return submodule_id if submodule_id in submodules else None

    click.echo("Select a submodule (optional, press Enter to skip):")
    for i, submodule_name in enumerate(submodules):
        click.echo(f"{i + 1}: {submodule_name}")
    choice = click.prompt(
        "Enter submodule number/name or leave blank", type=str, default="", show_default=False
    )
    if not choice:
        return None
    if choice.isdigit():
        idx = int(choice) - 1
        return submodules[idx] if 0 <= idx < len(submodules) else None
    value = to_snake_case(choice)
    return value if value in submodules else None


def register_doc_indexes(module_path: str, doc_id: str, submodule_id: Optional[str] = None) -> None:
    docs_txt = os.path.join(module_path, "docs.txt")
    existing: List[str] = []
    if os.path.exists(docs_txt):
        with open(docs_txt, "r", encoding="utf-8") as f:
            existing = [line.strip() for line in f if line.strip()]
    entry = f"{submodule_id}/{doc_id}" if submodule_id else doc_id
    if entry not in existing:
        existing.append(entry)
        with open(docs_txt, "w", encoding="utf-8") as f:
            f.write("\n".join(existing) + "\n")

    if submodule_id:
        sub_docs_txt = os.path.join(module_path, "submodule", submodule_id, "docs.txt")
        if os.path.exists(sub_docs_txt):
            with open(sub_docs_txt, "r", encoding="utf-8") as f:
                sub_existing = [line.strip() for line in f if line.strip()]
        else:
            sub_existing = []
        if doc_id not in sub_existing:
            sub_existing.append(doc_id)
            with open(sub_docs_txt, "w", encoding="utf-8") as f:
                f.write("\n".join(sub_existing) + "\n")
