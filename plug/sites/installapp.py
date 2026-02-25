import json
import os
from typing import List, Optional, Dict, Any

import click

from ..sites.migrate.migrate import run_migration
from ..utils.config import (
    get_all_sites,
    get_app_root_path,
    get_registered_apps,
    get_site_config,
    update_site_config,
)


@click.command()
@click.option(
    "--site", type=str, help="The name of the site where the app will be installed."
)
@click.argument("app")
def installapp(site: Optional[str], app: str) -> None:
    """
    Install an app into a selected site and update sites.json.

    :param site: The name of the site where the app will be installed.
    :param app: The name of the app to install.
    """
    sites: List[Dict[str, Any]] = get_all_sites()

    # Select or prompt for the site
    if not site:
        click.echo("Select a site to install the app into:")
        for i, site_entry in enumerate(sites, 1):
            click.echo(f"{i}. {site_entry}")

        site_choice: int = click.prompt("Enter the number of the site", type=int)

        if site_choice < 1 or site_choice > len(sites):
            click.echo("Invalid site selection.")
            return

        site = sites[site_choice - 1]
 
    # Load apps from plug-level apps.txt registries.
    apps: List[str] = get_registered_apps()

    if not apps:
        click.echo("No available apps found in plug registries.")
        return

    # Prompt for app if not provided
    if not app:
        click.echo(f"Select an app to install into '{site}':")
        for i, app_entry in enumerate(apps, 1):
            click.echo(f"{i}. {app_entry}")

        app_choice: int = click.prompt(
            "Enter the number of the app you want to install", type=int
        )

        if app_choice < 1 or app_choice > len(apps):
            click.echo("Invalid app selection.")
            return

        selected_app: str = apps[app_choice - 1]
    else:
        selected_app = app
        if selected_app not in apps:
            click.echo(f"App '{selected_app}' not found in plug registries.")
            return

    # Check if the app is already installed in the site
    selected_site: Optional[Dict[str, Any]] = get_site_config(site)
    if "installed_apps" not in selected_site:
        selected_site["installed_apps"] = []

    if selected_app in selected_site["installed_apps"]:
        click.echo(
            f"The app '{selected_app}' is already installed in '{selected_site['site_name']}'."
        )
        return

    # Install the app using the external function
    click.echo(f"Installing '{selected_app}' into '{selected_site['site_name']}'...")

    app_root = get_app_root_path(selected_app)
    if app_root:
        backend_root = os.path.join(app_root, "backend")
        backend_present = os.path.isdir(backend_root)
        if backend_present:
            click.echo(f"Detected 3plug backend scaffold: {backend_root}")
        else:
            click.echo(
                "Warning: No app backend scaffold detected under app root; "
                "install will proceed with registry/site config only."
            )
        frontend_root = os.path.join(app_root, "frontend")
        frontend_present = os.path.isdir(frontend_root)
        if frontend_present:
            click.echo(f"Detected Calculus frontend scaffold: {frontend_root}")
        else:
            click.echo(
                "Warning: No app frontend scaffold detected under app root; "
                "host runtime will use shared src only."
            )

    # Update the selected site's installed_apps
    selected_site["installed_apps"].append(selected_app)

    update_site_config(site, selected_site)

    click.echo(
        f"The app '{selected_app}' has been successfully installed in '{selected_site['site_name']}'."
    )
    run_migration(site=selected_site["site_name"])
