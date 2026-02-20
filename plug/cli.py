from typing import Any

import click

from .apps import *
from .main import *
from .sites import *


@click.group()
def cli() -> None:
    pass


cli.add_command(newapp, name="new-app")
cli.add_command(dropapp, name="drop-app")
cli.add_command(getapp, name="get-app")

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
cli.add_command(start)
cli.add_command(build)
cli.add_command(deploy, name="deploy")
cli.add_command(setup_site, name="setup-site")

cli.add_command(usesite, name="use")


# Add other commands as needed

if __name__ == "__main__":
    cli()
