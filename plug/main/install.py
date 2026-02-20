import json
import os
import subprocess
from typing import Optional

import click

from ..utils.config import APPS_PATH, PROJECT_ROOT
from .init import perform_init


def activate_virtualenv() -> Optional[str]:
    """
    Activate the virtual environment.

    Returns:
        Optional[str]: The path to the activation script, or None if the virtual environment is not found.
    """
    venv_path = os.path.join(PROJECT_ROOT, "env")
    if not os.path.exists(venv_path):
        click.echo("Virtual environment not found. Please run '3plug setup' first.")
        return None

    if os.name == "nt":  # Windows
        activate_script = os.path.join(venv_path, "Scripts", "activate.bat")
    else:  # Unix-based
        activate_script = os.path.join(venv_path, "bin", "activate")

    return activate_script


def app_install_python_packages(app: str) -> None:
    """
    Install Python packages for a specific app.

    Args:
        app (str): The name of the app.
    """
    requirements_file = os.path.join(APPS_PATH, app, "requirements.txt")
    if os.path.exists(requirements_file):
        click.echo(f"Installing packages from {requirements_file}...")
        subprocess.check_call(["pip", "install", "-r", requirements_file])


def install_python_packages() -> None:
    """
    Install Python packages for the site.
    """
    site_requirements = os.path.join(PROJECT_ROOT, "manifold", "requirements.txt")
    if os.path.exists(site_requirements):
        click.echo(f"Installing packages from {site_requirements}...")
        subprocess.check_call(["pip", "install", "-r", site_requirements])


def app_install_npm_packages(app: str) -> None:
    """
    Install npm packages for a specific app.

    Args:
        app (str): The name of the app.
    """
    package_json_path = os.path.join(APPS_PATH, app, "package.json")
    if os.path.exists(package_json_path):
        click.echo(f"Installing packages from {package_json_path}...")

        nextjs_path = os.path.join(PROJECT_ROOT)

        # Read package.json to get dependencies and devDependencies
        with open(package_json_path, "r") as f:
            package_data = json.load(f)

        dependencies = package_data.get("dependencies", {})
        dev_dependencies = package_data.get("devDependencies", {})

        # Combine all dependencies
        all_dependencies = {**dependencies, **dev_dependencies}

        # Determine the command for the current operating system
        npm_command = ["npm", "install"] + list(all_dependencies.keys())

        # Execute the npm command in the Next.js directory
        try:
            if os.name == "nt":  # Windows
                subprocess.check_call(npm_command, cwd=nextjs_path, shell=True)
            else:  # Unix-based systems
                subprocess.check_call(npm_command, cwd=nextjs_path)
            click.echo("Libraries installed successfully in core Next.js project.")
        except subprocess.CalledProcessError as e:
            click.echo(f"Error installing libraries in core Next.js project: {e}")
    else:
        click.echo(f"package.json not found for app '{app}'.")


def install_npm_packages() -> None:
    """
    Install npm packages for the site.
    """
    nextjs_path = os.path.join(PROJECT_ROOT)

    # Determine the command for the current operating system
    npm_command = ["npm", "install"]

    # Execute the npm command in the Next.js directory
    try:
        if os.name == "nt":  # Windows
            subprocess.check_call(npm_command, cwd=nextjs_path, shell=True)
        else:
            subprocess.check_call(npm_command, cwd=nextjs_path)
        click.echo("Libraries installed successfully in core Next.js project.")
    except subprocess.CalledProcessError as e:
        click.echo(f"Error installing libraries in core Next.js project: {e}")


def install_dependencies() -> None:
    """
    Install all dependencies for the site.
    """
    install_python_packages()
    install_npm_packages()


@click.command()
def install() -> None:
    """
    Install all dependencies for the specified site.
    Usage: 3plug install --site <site_name>
    """
    run_install()


@click.command()
def i() -> None:
    """
    Install all dependencies for the specified site.
    Usage: 3plug i --site <site_name>
    """
    run_install()


def run_install() -> None:
    """
    Run the installation process for all dependencies.
    """
    # Activate the virtual environment
    activate_script = activate_virtualenv()
    site_files = os.path.join(PROJECT_ROOT, "manifold")
    if not os.path.exists(site_files):
        perform_init(".")

    if activate_script:
        if os.name == "nt":
            os.system(activate_script)
        else:
            subprocess.call(["source", activate_script], shell=True)

    install_dependencies()
    click.echo("Dependencies installed successfully.")
