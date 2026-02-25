import json
import os

import click

from ...utils.config import get_app_module_path, validate_non_reserved_name
from ...utils.text import to_snake_case, underscore_to_titlecase_main


def _read_lines(path: str) -> list[str]:
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return [line.strip() for line in f if line.strip()]


def _write_lines(path: str, values: list[str]) -> None:
    with open(path, "w", encoding="utf-8") as f:
        for value in values:
            f.write(f"{value}\n")


@click.command()
@click.argument("app_name")
@click.argument("module_name")
@click.argument("submodule_name")
def newsubmodule(app_name: str, module_name: str, submodule_name: str) -> None:
    """Create a 3plug submodule scaffold under an app module."""
    app_name = validate_non_reserved_name(app_name, "app")
    module_name = validate_non_reserved_name(module_name, "module")
    submodule_name = validate_non_reserved_name(submodule_name, "submodule")
    app_id = to_snake_case(app_name)
    module_id = to_snake_case(module_name)
    submodule_id = to_snake_case(submodule_name)

    app_module_root = get_app_module_path(app_id)
    if not app_module_root:
        click.echo(f"App '{app_id}' not found.")
        return

    module_root = os.path.join(app_module_root, module_id)
    if not os.path.isdir(module_root):
        click.echo(f"Module '{module_id}' not found in '{app_id}'.")
        return

    submodules_txt = os.path.join(module_root, "submodules.txt")
    docs_index = os.path.join(module_root, "docs.txt")
    os.makedirs(module_root, exist_ok=True)
    if not os.path.exists(submodules_txt):
        open(submodules_txt, "w", encoding="utf-8").close()
    if not os.path.exists(docs_index):
        open(docs_index, "w", encoding="utf-8").close()

    submodule_root = os.path.join(module_root, "submodule", submodule_id)
    if os.path.exists(submodule_root):
        click.echo(f"Submodule '{submodule_id}' already exists.")
        return

    os.makedirs(os.path.join(submodule_root, "docs"), exist_ok=True)
    os.makedirs(os.path.join(submodule_root, "workflows"), exist_ok=True)
    os.makedirs(os.path.join(submodule_root, "reports"), exist_ok=True)
    os.makedirs(os.path.join(submodule_root, "prints"), exist_ok=True)

    with open(os.path.join(submodule_root, "docs.txt"), "w", encoding="utf-8") as f:
        f.write("")

    meta = {
        "id": submodule_id,
        "title": underscore_to_titlecase_main(submodule_id),
        "app_id": app_id,
        "module_id": module_id,
        "type": "submodule",
        "status": "draft",
    }
    with open(os.path.join(submodule_root, "submodule.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2)
        f.write("\n")
    with open(os.path.join(submodule_root, "submodule.schema.json"), "w", encoding="utf-8") as f:
        json.dump(
            {
                "id": submodule_id,
                "entity": "submodule",
                "children": {"docs_registry": "docs.txt"},
                "supports": ["doc", "workflow", "report", "print"],
            },
            f,
            indent=2,
        )
        f.write("\n")

    current = _read_lines(submodules_txt)
    if submodule_id not in current:
        current.append(submodule_id)
        _write_lines(submodules_txt, current)

    click.echo(
        f"Created submodule '{submodule_id}' in module '{module_id}' (app '{app_id}')."
    )
