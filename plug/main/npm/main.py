import json
import os
import subprocess
from typing import List, Optional

import click

from ...utils.config import APPS_PATH, PROJECT_ROOT, get_all_sites, get_site_config


def update_package_json(app_name: str, libraries: List[str]) -> None:
    """
    Update the package.json file of the specified app with the given libraries.

    Args:
        app_name (str): The name of the app.
        libraries (List[str]): A list of libraries to add to the dependencies.
    """
    package_json_path = os.path.join(APPS_PATH, app_name, "package.json")

    if not os.path.exists(package_json_path):
        click.echo(f"No package.json found for app '{app_name}'.")
        return

    with open(package_json_path, "r") as f:
        package_json = json.load(f)

    if "dependencies" not in package_json:
        package_json["dependencies"] = {}

    for library in libraries:
        package_json["dependencies"][library] = "*"  # Use "*" or specify a version

    with open(package_json_path, "w") as f:
        json.dump(package_json, f, indent=4)

    click.echo(f"Updated {package_json_path} with new dependencies.")


def install_npm_packages(
    libraries: List[str], app_name: Optional[str], site: str
) -> None:
    """
    Install the specified NPM packages in the core Next.js project.

    Args:
        libraries (List[str]): A list of libraries to install.
        app_name (Optional[str]): The name of the app (if any).
        site (str): The name of the site.
    """
    nextjs_path = os.path.join(PROJECT_ROOT)

    if not os.path.exists(nextjs_path):
        click.echo(f"Next.js path for site '{site}' not found.")
        return

    # Determine the command for the current operating system
    npm_command = ["npm", "install"] + list(libraries)

    # Execute the npm command in the Next.js directory
    try:
        if os.name == "nt":  # Windows
            subprocess.check_call(npm_command, cwd=nextjs_path, shell=True)
        else:  # Unix-based systems
            subprocess.check_call(npm_command, cwd=nextjs_path)

        click.echo("Libraries installed successfully in core Next.js project.")
    except subprocess.CalledProcessError as e:
        click.echo(f"Error installing libraries in core Next.js project: {e}")


@click.group()
def npm() -> None:
    """
    Manage NPM packages for the project.
    """


@click.command()
@click.argument("libraries", nargs=-1)
@click.option("--app", type=str, help="Specify a custom app to update its package.json")
@click.option(
    "--site",
    type=str,
    help="Specify a site to install the libraries. If not provided, a selection prompt will appear.",
)
def install(libraries: List[str], app: Optional[str], site: Optional[str]) -> None:
    """
    Install the specified NPM packages in the project.

    Usage: 3plug npm install <library_name> [<library_name>...] [--app <app_name>] [--site <site_name>]

    Args:
        libraries (List[str]): A list of libraries to install.
        app (Optional[str]): The name of the app (if any).
        site (Optional[str]): The name of the site (if any).
    """
    run_npm_install(libraries, app, site)


def run_npm_install(
    libraries: List[str], app: Optional[str], site: Optional[str]
) -> None:
    """
    Run the NPM install process for the specified libraries, app, and site.

    Args:
        libraries (List[str]): A list of libraries to install.
        app (Optional[str]): The name of the app (if any).
        site (Optional[str]): The name of the site (if any). 
    """
    sites = get_all_sites()
    if not sites:
        click.echo("No sites found in sites.")
        return

    if site:
        sites = [site]

    # Check for apps in selected sites
    app_names = set()
    for selected_site in sites:
        site_info = get_site_config(selected_site)
        if site_info and "installed_apps" in site_info:
            app_names.update(site_info["installed_apps"])

    if app and app not in app_names:
        click.echo(f"App '{app}' not found in the selected sites.")
        return

    if app:
        update_package_json(app, libraries)
  
    for selected_site in sites:
        install_npm_packages(libraries, app, selected_site)


@click.command()
@click.argument("libraries", nargs=-1)
@click.option("--app", type=str, help="Specify a custom app to update its package.json")
@click.option(
    "--site",
    type=str,
    help="Specify a site to install the libraries. If not provided, a selection prompt will appear.",
)
def i(libraries: List[str], app: Optional[str], site: Optional[str]) -> None:
    """
    Install the specified NPM packages in the project using the alias 'i'.

    Usage: 3plug npm i <library_name> [<library_name>...] [--app <app_name>] [--site <site_name>]

    Args:
        libraries (List[str]): A list of libraries to install.
        app (Optional[str]): The name of the app (if any).
        site (Optional[str]): The name of the site (if any).
    """
    run_npm_install(libraries, app, site)


npm.add_command(install)
npm.add_command(i)
