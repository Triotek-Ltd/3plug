import os
import shutil

import click

from ..utils.config import (
    BUNDLES_ROOT,
    PLUGS_TXT_PATH,
    ensure_plug_scaffold,
    get_plug_apps,
    get_registered_plugs,
    normalize_plug_name,
)


@click.command(name="list-plugs")
def list_plugs() -> None:
    """List allowed plug options for app placement."""
    plugs = get_registered_plugs()
    if not plugs:
        click.echo("No plug options found. Add them in config/plugs.txt.")
        return

    click.echo("Available plugs:")
    for index, plug_name in enumerate(plugs, 1):
        click.echo(f"{index}. {plug_name}")


@click.command(name="list-bundles")
def list_bundles() -> None:
    """List bundle options (3plug terminology)."""
    plugs = get_registered_plugs()
    if not plugs:
        click.echo("No bundle options found. Add them in config/plugs.txt.")
        return

    click.echo("Available bundles:")
    for index, plug_name in enumerate(plugs, 1):
        click.echo(f"{index}. {plug_name}")


@click.command(name="set-plugs")
@click.argument("plug_names", nargs=-1, required=True)
def set_plugs(plug_names: tuple[str, ...]) -> None:
    """Set allowed plug options and create missing plug directories."""
    normalized = []
    for plug_name in plug_names:
        clean = normalize_plug_name(plug_name)
        if clean and clean not in normalized:
            normalized.append(clean)

    with open(PLUGS_TXT_PATH, "w") as file_handle:
        for plug_name in normalized:
            file_handle.write(f"{plug_name}\n")

    for plug_name in normalized:
        ensure_plug_scaffold(plug_name)

    click.echo(f"Updated config/plugs.txt with: {', '.join(normalized)}")


@click.command(name="set-bundles")
@click.argument("bundle_names", nargs=-1, required=True)
def set_bundles(bundle_names: tuple[str, ...]) -> None:
    """Set bundle options (3plug terminology) and create missing bundle directories."""
    set_plugs.callback(bundle_names)  # click callback reuse


@click.command(name="new-bundle")
@click.argument("bundle_name")
def new_bundle(bundle_name: str) -> None:
    """Create/register a single bundle directory under bundles/."""
    bundle_name = normalize_plug_name(bundle_name)
    if not bundle_name:
        click.echo("Bundle name is required.")
        return

    os.makedirs(BUNDLES_ROOT, exist_ok=True)
    existing = get_registered_plugs()
    if bundle_name in existing:
        ensure_plug_scaffold(bundle_name)
        click.echo(f"Bundle '{bundle_name}' already exists.")
        return

    ensure_plug_scaffold(bundle_name)
    with open(PLUGS_TXT_PATH, "a") as file_handle:
        file_handle.write(f"{bundle_name}\n")

    click.echo(f"Created and registered bundle '{bundle_name}'.")


@click.command(name="drop-bundle")
@click.argument("bundle_name")
def drop_bundle(bundle_name: str) -> None:
    """Remove a bundle from registry and delete empty bundle directory."""
    bundle_name = normalize_plug_name(bundle_name)
    bundles = get_registered_plugs()
    if bundle_name not in bundles:
        click.echo(f"Bundle '{bundle_name}' is not registered.")
        return

    bundle_path = os.path.join(BUNDLES_ROOT, bundle_name)
    if get_plug_apps(bundle_name):
        click.echo(
            f"Bundle '{bundle_name}' is not empty. Remove apps first before dropping the bundle."
        )
        return

    if os.path.isdir(bundle_path):
        shutil.rmtree(bundle_path)

    remaining = [b for b in bundles if b != bundle_name]
    with open(PLUGS_TXT_PATH, "w") as file_handle:
        for b in remaining:
            file_handle.write(f"{b}\n")
    click.echo(f"Dropped bundle '{bundle_name}'.")
