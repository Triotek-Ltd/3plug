import os
import subprocess
import sys
import traceback
from typing import NoReturn

import click

from ..utils.config import PROJECT_ROOT
from ..utils.run_process import get_python_executable, get_venv_path


@click.command()
def build() -> NoReturn:
    """
    Build the project by collecting Django static files and building the Next.js project.

    This function checks for the existence of a virtual environment, collects Django static files,
    and builds the Next.js project. If any step fails, it prints an error message.
    """
    run_build() 
    
def run_build() -> NoReturn:
    if not get_venv_path():
        click.echo("Virtual environment not found. Please run '3plug setup' first.")
        return

    python_executable = get_python_executable()
    if not python_executable:
        return

    try:
        # Build Django static files
        click.echo(click.style("Building Django static files...", fg="blue"))
        subprocess.check_call(
            [python_executable, "manage.py", "collectstatic", "--noinput"],
            cwd=os.path.join(PROJECT_ROOT, "manifold"),
        )
        click.echo(click.style("Django static files built successfully.", fg="green"))

        # Build Next.js project
        click.echo(click.style("Building Next.js project...", fg="blue"))
        subprocess.check_call(
            ["npm", "run", "build"], cwd=os.path.join(PROJECT_ROOT)
        )
        click.echo(click.style("Next.js project built successfully.", fg="green"))

    except subprocess.CalledProcessError as e:
        click.echo(click.style(f"Build failed: {str(e)}", fg="red"))
    except Exception as e:
        click.echo(click.style(f"An unexpected error occurred: {str(e)}", fg="red"))
        exc_type, exc_value, exc_tb = sys.exc_info()
        traceback.print_exception(exc_type, exc_value, exc_tb)
