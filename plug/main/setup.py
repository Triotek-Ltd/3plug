import os
import subprocess
import sys
import json
from typing import Optional

import click

from ..utils.config import PROJECT_ROOT
from ..utils.run_process import get_python_executable, get_venv_path


def _run_command(command: list[str], cwd: Optional[str] = None) -> None:
    if sys.platform.startswith("win"):
        subprocess.check_call(["cmd.exe", "/c"] + command, cwd=cwd)
    else:
        subprocess.check_call(command, cwd=cwd)


def _ensure_virtualenv() -> str:
    venv_path = get_venv_path()
    if venv_path:
        return venv_path

    venv_path = os.path.join(PROJECT_ROOT, "env")
    click.echo("Creating virtual environment at 'env'...")
    _run_command([sys.executable, "-m", "venv", "env"], cwd=PROJECT_ROOT)
    return venv_path


def _ensure_runtime_structure() -> None:
    for dirname in ("sites", "logs", "config"):
        os.makedirs(os.path.join(PROJECT_ROOT, dirname), exist_ok=True)

    common_site_config = os.path.join(PROJECT_ROOT, "sites", "common_site_config.json")
    if not os.path.exists(common_site_config):
        with open(common_site_config, "w", encoding="utf-8") as f:
            json.dump({}, f, indent=2)


@click.command()
@click.option(
    "--with-superuser/--no-superuser",
    default=True,
    show_default=True,
    help="Run Django createsuperuser at the end of setup.",
)
def setup(with_superuser: bool) -> None:
    """One-shot first-time project setup."""
    click.echo("Starting 3plug setup...")

    if not os.path.exists(os.path.join(PROJECT_ROOT, "manifold", "manage.py")):
        click.echo(
            click.style(
                "Django project not found at 'manifold/manage.py'. Setup aborted.",
                fg="red",
            )
        )
        return

    _ensure_virtualenv()
    _ensure_runtime_structure()
    python_executable = get_python_executable()
    if not python_executable:
        return

    click.echo("Upgrading pip...")
    _run_command([python_executable, "-m", "pip", "install", "--upgrade", "pip"])

    click.echo("Installing required Python package: env...")
    _run_command([python_executable, "-m", "pip", "install", "env"])

    click.echo("Installing Python dependencies (editable)...")
    _run_command([python_executable, "-m", "pip", "install", "-e", "."], cwd=PROJECT_ROOT)

    click.echo("Installing Node dependencies...")
    _run_command(["npm", "install"], cwd=PROJECT_ROOT)

    click.echo("Running Django migrations...")
    _run_command([python_executable, "manage.py", "migrate", "--noinput"], cwd=os.path.join(PROJECT_ROOT, "manifold"))

    if with_superuser:
        click.echo("Creating Django superuser...")
        _run_command([python_executable, "manage.py", "createsuperuser"], cwd=os.path.join(PROJECT_ROOT, "manifold"))

    click.echo(click.style("Setup completed successfully.", fg="green"))
