import click

from ..utils.config import PLUGS_TXT_PATH, ensure_plug_scaffold, get_registered_plugs


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


@click.command(name="set-plugs")
@click.argument("plug_names", nargs=-1, required=True)
def set_plugs(plug_names: tuple[str, ...]) -> None:
    """Set allowed plug options and create missing plug directories."""
    normalized = []
    for plug_name in plug_names:
        clean = plug_name.strip()
        if clean and clean not in normalized:
            normalized.append(clean)

    with open(PLUGS_TXT_PATH, "w") as file_handle:
        for plug_name in normalized:
            file_handle.write(f"{plug_name}\n")

    for plug_name in normalized:
        ensure_plug_scaffold(plug_name)

    click.echo(f"Updated config/plugs.txt with: {', '.join(normalized)}")
