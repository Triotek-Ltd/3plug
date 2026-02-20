import json
import os
from typing import Any, Dict, List, Optional

import click

from ..sites.migrate.migrate import run_migration
from ..utils.config import PROJECT_ROOT, get_all_sites, get_site_config, update_site_config


@click.command()
@click.option(
    "--site", type=str, help="The name of the site where the app will be uninstalled."
)
@click.argument("app")
def uninstallapp(site: Optional[str], app: str) -> None:
    """
    Uninstall an app from a selected site and update sites.json.

    :param site: The name of the site where the app will be uninstalled.
    :param app: The name of the app to uninstall.
    """
    sites: List[Dict[str, Any]] = get_all_sites()
    # Prompt for site if not provided
    if not site:
        click.echo("Select a site to uninstall the app:")
        for i, site_entry in enumerate(sites, 1):
            click.echo(f"{i}. {site_entry['site_name']}")

        site_choice: int = click.prompt("Enter the number of the site", type=int)

        if site_choice < 1 or site_choice > len(sites):
            click.echo("Invalid site selection.")
            return

        site = sites[site_choice - 1]
        
    site_folder = os.path.join(PROJECT_ROOT, "sites", site)
    if not os.path.exists(site_folder):
        click.echo(click.style(f"Site '{site}' does not exist. Aborting.", fg="red"))
        return

    selected_site = get_site_config(site)
    # Ensure the site has installed apps
    if "installed_apps" not in selected_site or not selected_site["installed_apps"]:
        click.echo(f"No apps installed in '{selected_site['site_name']}'.")
        return

    # Prompt for app if not provided
    if not app:
        click.echo(f"Select an app to uninstall from '{selected_site['site_name']}':")
        for i, app_entry in enumerate(selected_site["installed_apps"], 1):
            click.echo(f"{i}. {app_entry}")

        app_choice: int = click.prompt(
            "Enter the number of the app you want to uninstall", type=int
        )

        if app_choice < 1 or app_choice > len(selected_site["installed_apps"]):
            click.echo("Invalid app selection.")
            return

        selected_app: str = selected_site["installed_apps"][app_choice - 1]
    else:
        selected_app = app
        if selected_app not in selected_site["installed_apps"]:
            click.echo(
                f"App '{selected_app}' is not installed in '{selected_site['site_name']}'."
            )
            return

    # Simulate uninstalling the app (e.g., removing files, undoing migrations, etc.)
    click.echo(f"Uninstalling '{selected_app}' from '{selected_site['site_name']}'...")

    # Remove the app from the installed_apps list
    selected_site["installed_apps"].remove(selected_app)

    update_site_config(site, selected_site)

    click.echo(
        f"The app '{selected_app}' has been successfully uninstalled from '{selected_site['site_name']}'."
    )
    run_migration()


if __name__ == "__main__":
    uninstallapp()
