import os
import subprocess
from typing import List, Optional

import click

from ...utils.config import PROJECT_ROOT
from ...utils.run_process import get_python_executable, get_venv_path


@click.command()
@click.argument("command")
@click.argument("args", nargs=-1)
def django(command: str, args: List[str], site: Optional[str] = None) -> None:
    """Run Django management commands.

    Args:
        command (str): The Django management command to run.
        args (List[str]): Additional arguments for the command.
        site (Optional[str], optional): The site to run the command for. Defaults to None.
    """
    django_path = os.path.join(PROJECT_ROOT, "manifold")

    if not get_venv_path():
        click.echo("Virtual environment not found. Please run '3plug setup' first.")
        return

    python_executable = get_python_executable()
    if not python_executable:
        return

    # Construct the command to be executed
    command_list = [python_executable, "manage.py", command] + list(args)

    # Execute the command
    subprocess.run(command_list, cwd=django_path)


if __name__ == "__main__":
    django()
