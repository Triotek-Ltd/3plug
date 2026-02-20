import json
import os
import random
import string
import subprocess

# import platform (removed because it was not used)
from typing import Any, Dict, List

import click

from ..utils.config import PROJECT_ROOT


def generate_random_password(length: int = 12) -> str:
    """
    Generate a random password with letters and digits only (avoids special character issues).

    Args:
        length (int): The length of the password to generate. Default is 12.

    Returns:
        str: The generated random password.
    """
    characters = string.ascii_letters + string.digits  # No special characters
    return "".join(random.choice(characters) for _ in range(length))


@click.command()
@click.argument("site_name")
@click.option(
    "--db-type",
    type=click.Choice(["sqlite", "mysql"]),
    default=None,
    help="Database type to use (sqlite or mysql).",
)
def newsite(site_name: str, db_type: str) -> None:
    """
    Clone the mainsite repository, create a database, and add it to sites.json.

    Args:
        site_name (str): The name of the new site.
        db_type (str): The type of database to use (sqlite or mysql).
    """
    site_folder = os.path.join(PROJECT_ROOT, "sites", site_name)
    if os.path.exists(site_folder):
        click.echo(click.style(f"Site '{site_name}' already exists. Aborting.", fg="red"))
        return

    os.makedirs(site_folder)

    if db_type is None:
        db_type = click.prompt(
            "Select database type: 1 for sqlite, 2 for mysql", type=int
        )
        db_type = "sqlite" if db_type == 1 else "mysql"

    default_domains = f"localhost,127.0.0.1,{site_name}.localhost,{site_name}.127.0.0.1"
    domains_input = click.prompt(
        "Enter domain(s) for this site (comma-separated)",
        default=default_domains,
        show_default=True,
    )
    domains = [domain.strip() for domain in domains_input.split(",") if domain.strip()]
    if not domains:
        domains = [f"{site_name}.localhost", f"{site_name}.127.0.0.1"]
    if db_type == "mysql":
        # Prompt for root password
        root_password = click.prompt("Enter database root password", hide_input=True)

        # Create the database using Windows CMD
        db_name = f"{site_name}_db"

        try:
            # Create database
            subprocess.run(
                [
                    "mysql",
                    "-u",
                    "root",
                    "-p" + root_password,
                    "-e",
                    f"CREATE DATABASE {db_name};",
                ],
                check=True,
            )
            click.echo(
                click.style(f"Database '{db_name}' created successfully.", fg="green")
            )
        except subprocess.CalledProcessError as e:
            click.echo(click.style(f"Database creation failed: {e}", fg="red"))
            return

        # Create a new MySQL user and grant them admin privileges
        db_user = site_name
        db_user_password = generate_random_password()
        try:
            # Create user and grant privileges
            subprocess.run(
                [
                    "mysql",
                    "-u",
                    "root",
                    "-p" + root_password,
                    "-e",
                    f"CREATE USER IF NOT EXISTS '{db_user}'@'localhost' IDENTIFIED BY '{db_user_password}';",
                ],
                check=True,
            )
            subprocess.run(
                [
                    "mysql",
                    "-u",
                    "root",
                    "-p" + root_password,
                    "-e",
                    f"GRANT ALL PRIVILEGES ON {db_name}.* TO '{db_user}'@'localhost';",
                ],
                check=True,
            )
            subprocess.run(
                [
                    "mysql",
                    "-u",
                    "root",
                    "-p" + root_password,
                    "-e",
                    f"FLUSH PRIVILEGES;",
                ],
                check=True,
            )
            click.echo(
                click.style(
                    f"User '{db_user}' created and granted admin privileges.",
                    fg="green",
                )
            )
        except subprocess.CalledProcessError as e:
            click.echo(
                click.style(f"Failed to create user or grant privileges: {e}", fg="red")
            )
            return

        # Prepare the site information
        site_info: Dict[str, Any] = {
            "site_name": site_name,
            "database": {
                "ENGINE": "django.db.backends.mysql",
                "NAME": db_name,
                "USER": db_user,
                "PASSWORD": db_user_password,
                "HOST": "localhost",
            },
            "installed_apps": [],
            "domains": domains,
        }
    else:
        # SQLite database setup
        db_name = os.path.join(PROJECT_ROOT, "manifold", f"{site_name}.sqlite3")
        site_info: Dict[str, Any] = {
            "site_name": site_name,
            "database": {
                "ENGINE": "django.db.backends.sqlite3",
                "NAME": db_name,
            },
            "installed_apps": [],
            "domains": domains,
        }
        click.echo(
            click.style(
                f"SQLite database '{site_name}' created successfully.", fg="green"
            )
        )

    # Save the site information to config.json in the site folder
    config_path = os.path.join(site_folder, "site_config.json")
    with open(config_path, "w") as json_file:
        json.dump(site_info, json_file, indent=4)

    click.echo(click.style(f"Site '{site_name}' configuration saved to site_config.json.", fg="green"))

    # Run post-creation commands
    try:
        click.echo(
            click.style(f"Running migrations for site '{site_name}'...", fg="cyan")
        )
        subprocess.check_call(["3plug", "migrate", "--site", site_name])
        click.echo(click.style(f"Successfully migrated '{site_name}'.", fg="green"))

        click.echo(click.style(f"Creating superuser...", fg="cyan"))
        subprocess.check_call(["3plug", "django", "createsuperuser_tenant", site_name])
        click.echo(
            click.style(f"Successfully created site - '{site_name}'.", fg="green")
        )

    except subprocess.CalledProcessError as e:
        click.echo(click.style(f"Failed to run post-creation commands: {e}", fg="red"))
