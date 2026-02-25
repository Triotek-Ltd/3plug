import os
import subprocess
import sys

import click

from .apps import *
from .main import *
from .sites import *
from .utils.run_process import get_python_executable


@click.group()
@click.pass_context
def cli(ctx: click.Context) -> None:
    # Bootstrap commands are allowed to run without an existing venv.
    if ctx.invoked_subcommand in {"setup", "init"}:
        return

    venv_python = get_python_executable()
    if not venv_python:
        ctx.exit(1)

    current_python = os.path.normcase(os.path.abspath(sys.executable))
    target_python = os.path.normcase(os.path.abspath(venv_python))

    # If already running inside the project venv, continue normally.
    if current_python == target_python:
        return

    # Re-exec the same command inside the project virtual environment.
    result = subprocess.call([venv_python, "-m", "plug.cli", *sys.argv[1:]])
    ctx.exit(result)


cli.add_command(newapp, name="new-app")
cli.add_command(dropapp, name="drop-app")
cli.add_command(getapp, name="get-app")
cli.add_command(list_plugs, name="list-plugs")
cli.add_command(set_plugs, name="set-plugs")

cli.add_command(newmodule, name="new-module")
cli.add_command(dropmodule, name="drop-module")

cli.add_command(newdoc, name="new-doc")
cli.add_command(dropdoc, name="drop-doc")
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
    cli()
