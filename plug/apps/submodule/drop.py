import os
import shutil

import click

from ...utils.config import get_app_module_path
from ...utils.text import to_snake_case


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
def dropsubmodule(app_name: str, module_name: str, submodule_name: str) -> None:
    """Drop a 3plug submodule scaffold from a module."""
    app_id = to_snake_case(app_name)
    module_id = to_snake_case(module_name)
    submodule_id = to_snake_case(submodule_name)

    app_module_root = get_app_module_path(app_id)
    if not app_module_root:
        click.echo(f"App '{app_id}' not found.")
        return
    module_root = os.path.join(app_module_root, module_id)
    submodule_root = os.path.join(module_root, "submodule", submodule_id)
    if not os.path.isdir(submodule_root):
        click.echo(f"Submodule '{submodule_id}' not found.")
        return

    shutil.rmtree(submodule_root)

    submodules_txt = os.path.join(module_root, "submodules.txt")
    if os.path.exists(submodules_txt):
        values = [v for v in _read_lines(submodules_txt) if v != submodule_id]
        _write_lines(submodules_txt, values)

    click.echo(f"Dropped submodule '{submodule_id}'.")

