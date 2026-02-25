import json
import os
import shutil
from typing import Optional

import click

from ..sites.use import set_default_site
from ..utils.config import PROJECT_ROOT
from ..utils.run_process import get_python_executable
from .setup import _run_command, run_setup


DEV_SITE_NAME = "dev-site"
DEV_ADMIN_USERNAME = "adm"
DEV_ADMIN_PASSWORD = "1234"


def _ensure_dev_site(site_name: str) -> None:
    site_folder = os.path.join(PROJECT_ROOT, "sites", site_name)
    os.makedirs(site_folder, exist_ok=True)

    db_name = os.path.join(PROJECT_ROOT, "manifold", f"{site_name}.sqlite3")
    site_info = {
        "site_name": site_name,
        "database": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": db_name,
        },
        "installed_apps": [],
        "domains": [
            "localhost",
            "127.0.0.1",
            f"{site_name}.localhost",
            f"{site_name}.127.0.0.1",
        ],
    }

    config_path = os.path.join(site_folder, "site_config.json")
    with open(config_path, "w", encoding="utf-8") as json_file:
        json.dump(site_info, json_file, indent=4)


def _get_current_default_site() -> Optional[str]:
    common_config_path = os.path.join(PROJECT_ROOT, "sites", "common_site_config.json")
    if not os.path.exists(common_config_path):
        return None

    with open(common_config_path, "r", encoding="utf-8") as f:
        config = json.load(f) or {}
    return config.get("default_site") or config.get("default")


def _remove_site_if_exists(site_name: str) -> None:
    site_folder = os.path.join(PROJECT_ROOT, "sites", site_name)
    site_config_path = os.path.join(site_folder, "site_config.json")

    sqlite_path = None
    if os.path.exists(site_config_path):
        try:
            with open(site_config_path, "r", encoding="utf-8") as f:
                site_config = json.load(f) or {}
            database = site_config.get("database", {})
            if database.get("ENGINE") == "django.db.backends.sqlite3":
                sqlite_path = database.get("NAME")
        except Exception:
            sqlite_path = None

    if os.path.isdir(site_folder):
        shutil.rmtree(site_folder, ignore_errors=True)
        click.echo(f"Removed existing default site folder '{site_name}'.")

    if sqlite_path and os.path.exists(sqlite_path):
        try:
            os.remove(sqlite_path)
            click.echo(f"Removed SQLite DB for previous default site '{site_name}'.")
        except OSError:
            click.echo(
                click.style(
                    f"Warning: could not remove SQLite DB '{sqlite_path}'.",
                    fg="yellow",
                )
            )


def _run_dev_site_migrations(site_name: str) -> None:
    python_executable = get_python_executable()
    if not python_executable:
        raise click.ClickException("Python executable not found in project virtual environment.")

    django_cwd = os.path.join(PROJECT_ROOT, "manifold")
    _run_command([python_executable, "manage.py", "makemigrations"], cwd=django_cwd)
    _run_command([python_executable, "manage.py", "migrate", "--noinput"], cwd=django_cwd)
    _run_command(
        [python_executable, "manage.py", "migrate", "--noinput", f"--database={site_name}"],
        cwd=django_cwd,
    )


def _ensure_dev_admin(site_name: str, email: str) -> None:
    python_executable = get_python_executable()
    if not python_executable:
        raise click.ClickException("Python executable not found in project virtual environment.")

    django_cwd = os.path.join(PROJECT_ROOT, "manifold")
    _run_command(
        [
            python_executable,
            "manage.py",
            "createsuperuser_tenant",
            site_name,
            "--username",
            DEV_ADMIN_USERNAME,
            "--email",
            email,
            "--password",
            DEV_ADMIN_PASSWORD,
        ],
        cwd=django_cwd,
    )


@click.command(name="setup-dev-env")
@click.option("--site-name", default=DEV_SITE_NAME, show_default=True, help="Dev site name.")
@click.option(
    "--email",
    default=None,
    help="Admin email for the dev tenant. If omitted, you will be prompted.",
)
@click.option(
    "--install-native-prereqs",
    is_flag=True,
    help="Attempt to auto-install OS-level native prerequisites needed by some npm packages (e.g., canvas).",
)
def setup_dev_env(site_name: str, email: Optional[str], install_native_prereqs: bool) -> None:
    """Bootstrap project + local dev tenant site with default credentials."""
    admin_email = email or click.prompt("Enter admin email for dev site")

    click.echo("Running base setup (without global Django superuser prompt)...")
    run_setup(with_superuser=False, install_native_prereqs=install_native_prereqs)

    current_default = _get_current_default_site()
    if current_default and current_default != site_name:
        click.echo(f"Removing current default site '{current_default}' before creating '{site_name}'...")
        _remove_site_if_exists(current_default)

    click.echo(f"Creating/updating dev site '{site_name}'...")
    _ensure_dev_site(site_name)

    click.echo(f"Setting default site to '{site_name}'...")
    set_default_site(site_name)

    click.echo(f"Running migrations for site '{site_name}'...")
    _run_dev_site_migrations(site_name)

    click.echo(f"Creating tenant admin '{DEV_ADMIN_USERNAME}' (password: {DEV_ADMIN_PASSWORD})...")
    _ensure_dev_admin(site_name, admin_email)

    click.echo(click.style(f"Dev environment ready. Default site: '{site_name}'", fg="green"))
