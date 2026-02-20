import json
import os
import re
import subprocess
import sys
from typing import Optional

import click

from ...utils.config import DEFAULT_SITE, DJANGO_PATH, PROJECT_ROOT, find_django_path, get_all_sites, get_site_config
from ..utils.app_database_utils import create_entries_from_config
from ..utils.configure_app import configure_app, configure_doc, configure_module
from .migrate_app import migrate_app
from .migrate_doc import migrate_doc
from .migrate_module import migrate_module

MODULES_FOLDER = {
    "views": "views",
    "models": "models",
    "filters": "filters",
    "serializers": "serializers",
    "tests": "tests",
}


def remove_class_block(file_path: str, class_name: str) -> None:
    """Remove the class definition block for a specified class from a file.

    Args:
        file_path (str): Path to the file from which the class block is removed.
        class_name (str): Name of the class to remove.
    """
    with open(file_path, "r") as file:
        content = file.read()

    pattern = re.compile(rf"class {class_name}\s*\(.*?\):.*?(?=\nclass |$)", re.DOTALL)
    content = pattern.sub("", content)

    with open(file_path, "w") as file:
        file.write(content)


def updatefiles(
    app: Optional[str] = None,
    module: Optional[str] = None,
    doc: Optional[str] = None,
    site: Optional[str] = None,
    all: bool = True,
) -> None:
    """Update files and perform migrations based on provided options.

    Args:
        app (Optional[str]): Name of the app to migrate.
        module (Optional[str]): Name of the module to migrate.
        doc (Optional[str]): Name of the document to migrate.
        site (Optional[str]): Name of the site to migrate.
        all (bool): If True, migrate all sites.
    """
    sites = get_all_sites()
    configure_app("core")
    configure_app("frappe")

    if all:
        for site_entry in sites:
            installed_apps = get_site_config(site_entry).get("installed_apps", [])
            for app in installed_apps:
                configure_app(app)

            for app in installed_apps:
                migrate_app(app, DJANGO_PATH)

        return

    selected_site = get_site_config(site)

    if doc and module and app:
        configure_doc(app, module, doc)
        migrate_doc(app, module, doc, DJANGO_PATH)
    elif module and app:
        configure_module(app, module)
        migrate_module(app, module, DJANGO_PATH)
    elif app:
        configure_app(app)
        migrate_app(app, DJANGO_PATH)
    elif selected_site:
        click.echo(selected_site)
        installed_apps = selected_site.get("installed_apps", [])
        for app in installed_apps:
            configure_app(app)
        for app in installed_apps:
            migrate_app(app, DJANGO_PATH)

    subprocess.run(
        [
            "autoflake",
            "--in-place",
            "--remove-unused-variables",
            "--recursive",
            "--exclude",
            "*/__init__.py",
            ".",
        ],
        cwd=DJANGO_PATH,
    )

    subprocess.run(
        [
            "autoflake",
            "--in-place",
            "--remove-all-unused-imports",
            "--recursive",
            "--exclude",
            "*/__init__.py",
            ".",
        ],
        cwd=DJANGO_PATH,
    )
    click.echo("Migration process completed successfully.")


def get_python_executable() -> str:
    """Get the path to the Python executable in the virtual environment.

    Returns:
        str: Path to the Python executable.
    """
    venv_path = os.path.join(PROJECT_ROOT, "env")
    if not os.path.exists(venv_path):
        click.echo("Virtual environment not found. Please run '3plug setup' first.")
        raise FileNotFoundError("Virtual environment not found.")

    python_executable = os.path.join(venv_path, "bin", "python")
    if sys.platform.startswith("win"):
        python_executable = os.path.join(venv_path, "Scripts", "python.exe")

    return python_executable


@click.command()
@click.option(
    "--site",
    default=None,
    help="Specify a site to migrate. If not provided, prompts for a site.",
)
def migrate_django(site: Optional[str] = None) -> None:
    """Execute Django migration commands (makemigrations and migrate) for a specified project.

    Args:
        site (Optional[str]): Name of the site to migrate.
    """
    run_migrate_django(site)


def run_migrate_django(site: Optional[str] = None) -> None:
    """Run Django makemigrations and migrate commands.

    Args:
        site (Optional[str]): Name of the site to migrate.
    """
    python_executable = get_python_executable()

    db_arg = [f"--database={site}"] if site else []

    subprocess.run(
        [python_executable, "manage.py", "makemigrations"],
        cwd=DJANGO_PATH,
    )

    subprocess.run(
        [python_executable, "manage.py", "migrate", "--noinput"] + db_arg,
        cwd=DJANGO_PATH,
    )

    create_entries_from_config(DJANGO_PATH, site)
    message = (
        f"Migration completed successfully for site '{site}'."
        if site
        else "Migration completed successfully."
    )
    click.echo(message)


def run_migration(
    app: Optional[str] = None,
    module: Optional[str] = None,
    doc: Optional[str] = None,
    site: Optional[str] = None,
    all_sites: bool = True,
    skip: bool = False,
) -> None:
    """Core migration process.

    Args:
        app (Optional[str]): Name of the app to migrate.
        module (Optional[str]): Name of the module to migrate.
        doc (Optional[str]): Name of the document to migrate.
        site (Optional[str]): Name of the site to migrate.
        all_sites (bool): If True, migrate all sites.
        skip (bool): If True, skip updating files before running migrations.
    """
    import traceback

    try:
        if not skip:
            updatefiles(app, module, doc, site, all_sites)
        if all_sites:
            if all:
                sites = get_all_sites()
                for site_entry in sites:
                    run_migrate_django(site_entry)
            else:
                run_migrate_django(site)
        run_migrate_django()
        click.echo("Migration completed successfully.")
    except Exception as e:
        click.echo(f"Migration failed: {e}")
        exc_type, exc_value, exc_tb = sys.exc_info()
        traceback.print_exception(exc_type, exc_value, exc_tb)


@click.command()
@click.option("--app", default=None, help="Specify an app to migrate.")
@click.option(
    "--module", default=None, help="Specify a module to migrate. Requires --app."
)
@click.option(
    "--doc",
    default=None,
    help="Specify a document to migrate. Requires --app and --module.",
)
@click.option(
    "--site",
    default=None,
    help="Specify a site to migrate. If not provided, prompts for a site.",
)
@click.option("-a", "--all", is_flag=True, default=True, help="Migrate all sites.")
@click.option(
    "-s", "--skip", is_flag=True, help="Skip updating files before running migrations."
)
def migrate(
    app: Optional[str] = None,
    module: Optional[str] = None,
    doc: Optional[str] = None,
    site: Optional[str] = None,
    all: bool = True,
    skip: bool = False,
) -> None:
    """Run Django makemigrations and migrate commands.

    Args:
        app (Optional[str]): Name of the app to migrate.
        module (Optional[str]): Name of the module to migrate.
        doc (Optional[str]): Name of the document to migrate.
        site (Optional[str]): Name of the site to migrate.
        all (bool): If True, migrate all sites.
        skip (bool): If True, skip updating files before running migrations.
    """
    run_migration(app, module, doc, site, all, skip)


@click.command()
@click.option(
    "--site",
    default=None,
    help="Specify a site to migrate. If not provided, prompts for a site.",
)
def registermodels(site: Optional[str]) -> None:
    """Run Django makemigrations and migrate commands.

    Args:
        site (Optional[str]): Name of the site to migrate.
    """
    create_entries_from_config(find_django_path(site), site)
