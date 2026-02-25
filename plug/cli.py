import os
import subprocess
import sys
from datetime import datetime, timezone

import click

from .apps import *
from .main import *
from .sites import *
from .utils.run_process import get_python_executable


class LoggingGroup(click.Group):
    """Click group that logs every invocation, including help-only paths."""

    def main(self, *args, **kwargs):  # type: ignore[override]
        _write_cli_command_log("invoke", "click-main")
        return super().main(*args, **kwargs)


def _write_cli_command_log(status: str, note: str = "") -> None:
    """Append a simple command activity line for local auditing/troubleshooting."""
    try:
        project_root = os.getcwd()
        log_dir = os.path.join(project_root, "logs")
        os.makedirs(log_dir, exist_ok=True)
        log_path = os.path.join(log_dir, "cli-commands.log")
        timestamp = datetime.now(timezone.utc).isoformat()
        command = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "--help"
        line = f"{timestamp}\t{status}\tpython={os.path.basename(sys.executable)}\tcmd={command}"
        if note:
            line += f"\tnote={note}"
        with open(log_path, "a", encoding="utf-8") as log_file:
            log_file.write(line + "\n")
    except Exception:
        # Logging must never block command execution.
        pass


@click.group(cls=LoggingGroup)
@click.pass_context
def cli(ctx: click.Context) -> None:
    # Bootstrap commands are allowed to run without an existing venv.
    if ctx.invoked_subcommand in {"setup", "init"}:
        _write_cli_command_log("start", "bootstrap")
        return

    venv_python = get_python_executable()
    if not venv_python:
        ctx.exit(1)

    current_python = os.path.normcase(os.path.abspath(sys.executable))
    target_python = os.path.normcase(os.path.abspath(venv_python))

    # If already running inside the project venv, continue normally.
    if current_python == target_python:
        _write_cli_command_log("start", "in-venv")
        return

    # Re-exec the same command inside the project virtual environment.
    _write_cli_command_log("handoff", "reexec-to-venv")
    result = subprocess.call([venv_python, "-m", "plug.cli", *sys.argv[1:]])
    ctx.exit(result)


cli.add_command(newapp, name="new-app")
cli.add_command(dropapp, name="drop-app")
cli.add_command(getapp, name="get-app")
cli.add_command(list_plugs, name="list-plugs")
cli.add_command(set_plugs, name="set-plugs")
cli.add_command(list_bundles, name="list-bundles")
cli.add_command(set_bundles, name="set-bundles")
cli.add_command(new_bundle, name="new-bundle")
cli.add_command(drop_bundle, name="drop-bundle")
cli.add_command(new_bundle, name="new-plug")   # compatibility alias
cli.add_command(drop_bundle, name="drop-plug") # compatibility alias

cli.add_command(newmodule, name="new-module")
cli.add_command(dropmodule, name="drop-module")
cli.add_command(newsubmodule, name="new-submodule")
cli.add_command(dropsubmodule, name="drop-submodule")

cli.add_command(newdoc, name="new-doc")
cli.add_command(dropdoc, name="drop-doc")
# Compatibility aliases while migrating terminology
cli.add_command(newdoc, name="new-doctype")
cli.add_command(dropdoc, name="drop-doctype")
cli.add_command(movedoc, name="move-doc")

cli.add_command(newprintformat, name="new-print-format")
cli.add_command(dropprintformat, name="drop-print-format")

cli.add_command(newsite, name="new-site")
cli.add_command(installapp, name="install-app")
cli.add_command(uninstallapp, name="uninstall-app")
cli.add_command(dropsite, name="drop-site")
cli.add_command(installmodule, name="install-module")
cli.add_command(installdoc, name="install-doc")

cli.add_command(pip)
cli.add_command(npm)

cli.add_command(install)
cli.add_command(i)

cli.add_command(migrate)
cli.add_command(migrate_django, name="migrate-django")

cli.add_command(django)

cli.add_command(init)
cli.add_command(setup)
cli.add_command(setup_dev_env, name="setup-dev-env")
cli.add_command(start)
cli.add_command(build)
cli.add_command(deploy, name="deploy")
cli.add_command(setup_site, name="setup-site")

cli.add_command(usesite, name="use")


# Add other commands as needed

if __name__ == "__main__":
    _write_cli_command_log("invoke", "entrypoint")
    cli()
