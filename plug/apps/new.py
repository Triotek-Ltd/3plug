import os
import shutil
import subprocess
from typing import Dict

import click

from ..sites.utils.installdjangoapp import install_django_app
from ..utils.config import PROJECT_ROOT
from .utils.file_creater import create_files_from_templates

LICENSE_CHOICES = [
    "MIT",
    "GPL-3.0",
    "GPL-2.0",
    "LGPL-3.0",
    "LGPL-2.1",
    "AGPL-3.0",
    "Apache-2.0",
    "BSD-3-Clause",
    "BSD-2-Clause",
    "MPL-2.0",
    "EPL-2.0",
    "CC0-1.0",
    "CC-BY-4.0",
    "CC-BY-SA-4.0",
    "Unlicense",
    "Zlib",
    "BSL-1.0",
    "WTFPL",
]


@click.command()
@click.argument("app_name")
@click.option(
    "--title",
    prompt="App Title",
    default="My Plug App",
    help="The title of your app",
    show_default=True,
)
@click.option(
    "--description",
    prompt="App Description",
    default="This is a new plug app.",
    help="A short description of your app",
    show_default=True,
)
@click.option(
    "--publisher",
    prompt="App Publisher",
    default="Triotek Ltd",
    help="The publisher of your app",
    show_default=True,
)
@click.option(
    "--email",
    prompt="Publisher Email",
    default="contact@example.io",
    help="The email of the publisher",
    show_default=True,
)
@click.option(
    "--license",
    prompt="App License",
    type=click.Choice(LICENSE_CHOICES, case_sensitive=False),
    default="MIT",
    help="License for the app",
    show_default=True,
)
def newapp(
    app_name: str,
    title: str,
    description: str,
    publisher: str,
    email: str,
    license: str,
) -> None:
    """
    Create a new plug-style app with the specified name.

    :param app_name: Name of the app to be created.
    :param title: Title of the app.
    :param description: Description of the app.
    :param publisher: Publisher of the app.
    :param email: Email of the publisher.
    :param license: License for the app.
    """
    # Define paths
    temp_app_path = os.path.join(PROJECT_ROOT, "apps", f"temp_{app_name}")
    final_app_path = os.path.join(PROJECT_ROOT, "apps", app_name)

    # Check if the app already exists
    if os.path.exists(final_app_path):
        click.echo(f"The app '{app_name}' already exists.")
        return

    # Create the temporary app directory
    os.makedirs(temp_app_path, exist_ok=True)

    # Define app-level folders
    app_folders = [
        "api",  # API endpoints
        "config",  # App-level configuration
        "docs",  # Documentation
        "fixtures",  # Data fixtures
        "patches",  # Patches for migrations
        "public/css",  # Public assets
        "public/js",  # JavaScript assets
        "public/images",  # Images
        "templates",  # HTML and other templates
        "tests",  # Test files
        "translations",  # Translation files
        "www",  # Web pages
    ]

    for folder in app_folders:
        folder_path = os.path.join(temp_app_path, app_name, folder)
        os.makedirs(folder_path, exist_ok=True)

    # Create the main module folder (named after the app)
    module_path = os.path.join(temp_app_path, app_name, app_name)
    os.makedirs(module_path, exist_ok=True)

    # Define module-level folders
    module_folders = [
        "doctype",  # Custom doctypes
        "report",  # Reports
        "dashboard",  # Dashboards
        "dashboard_chart",  # Dashboard charts
        "print_format",  # Print formats
        "workspace",  # Workspaces
    ]

    for folder in module_folders:
        folder_path = os.path.join(module_path, folder)
        os.makedirs(folder_path, exist_ok=True)

    # Prepare dynamic content to pass to the file creation function
    dynamic_content: Dict[str, str] = {}

    if title:
        dynamic_content[
            "hooks.py"
        ] = f"""# App Information
app_name = "{app_name}"
app_title = "{title}"
app_description = "{description}"
app_publisher = "{publisher}"
app_email = "{email}"
app_license = "{license}"
"""

    # Convert app_name to title case for modules.txt
    dynamic_content["modules.txt"] = f"{app_name.replace('_', ' ').title()}\n"

    # Use the file creator utility to generate boilerplate files from templates, passing dynamic content
    templates_folder = os.path.join(PROJECT_ROOT, "plug", "templates")
    create_files_from_templates(
        temp_app_path, app_name, templates_folder, license, dynamic_content
    )

    # Create special files first
    create_readme(
        temp_app_path,
        app_name,
        templates_folder,
        license,
        description,
        title,
        publisher,
        email,
    )

    # Add the app to the apps.txt configuration
    apps_txt_path = os.path.join(PROJECT_ROOT, "config", "apps.txt")
    with open(apps_txt_path, "a") as apps_file:
        apps_file.write(f"{app_name}\n")

    # Attempt to initialize a git repository
    try:
        subprocess.check_call(["git", "init"], cwd=temp_app_path)
        subprocess.check_call(["git", "checkout", "-b", "main"], cwd=temp_app_path)

        # Move the temporary directory to the final location
        shutil.move(temp_app_path, final_app_path)
        install_django_app(app_name, PROJECT_ROOT)

    except subprocess.CalledProcessError as e:
        click.echo(f"Failed to initialize Git repository: {e}")
        # Rollback: Remove the temporary directory if it was created
        if os.path.exists(temp_app_path):
            shutil.rmtree(temp_app_path)
        click.echo(f"Rolled back the creation of the app '{app_name}'.")

    if os.path.exists(final_app_path):
        click.echo(f"The app '{app_name}' has been created successfully.")
    else:
        click.echo(f"Failed to create the app '{app_name}'.")


def create_readme(
    base_path: str,
    app_name: str,
    templates_folder: str,
    license: str,
    description: str,
    title: str,
    publisher: str,
    email: str,
) -> None:
    """
    Create the README.md file with expanded content and advanced styling.

    :param base_path: Base path where the README.md file will be created.
    :param app_name: Name of the app.
    :param templates_folder: Path to the folder containing templates.
    :param license: License for the app.
    :param description: Description of the app.
    :param title: Title of the app.
    :param publisher: Publisher of the app.
    :param email: Email of the publisher.
    """
    readme_path = os.path.join(base_path, "README.md")
    template_path = os.path.join(templates_folder, "README.md")

    # Default content with advanced styling
    default_content = f"""# {app_name}

Welcome to **{app_name}**!.

## App Information

- **App Name**: {app_name}
- **App Title**: {title}
- **App Description**: {description}
- **Publisher**: {publisher}
- **Publisher Email**: {email}
- **License**: {license}

## Installation

Follow the steps below to get started with **{app_name}**:

1. Get the app:

    ```bash
    3plug get-app https://github.com/{app_name}/{app_name}.git
    ```

2. Install in site:

    ```bash
    3plug install-app --site [sitename] {app_name}
    ```

3. Install dependencies:

    ```bash
    3plug install
    ```

4. Migrate the site:

    ```bash
    3plug migrate --site [sitename]
    ```

## License

This project is licensed under the terms of the **{license}** license.

## Contributing

We welcome contributions to **{app_name}**! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

## Contact

If you have any questions, feel free to reach out to:

- **Email**: {email}
- **Website**: [triotek.io](https://triotek.io)
"""

    # Ensure directory exists
    os.makedirs(os.path.dirname(readme_path), exist_ok=True)

    try:
        with open(template_path, "r") as template_file:
            content = template_file.read()
    except FileNotFoundError:
        content = default_content
    except Exception as e:
        content = default_content  # Use default content if error occurs

    content = content.replace("{{app_name}}", app_name)
    content = content.replace("{{title}}", title)
    content = content.replace("{{description}}", description)
    content = content.replace("{{publisher}}", publisher)
    content = content.replace("{{email}}", email)
    content = content.replace("{{license}}", license)

    # Write the generated content to the README.md file
    try:
        with open(readme_path, "w") as readme_file:
            readme_file.write(content)
    except Exception as e:
        click.echo(f"Error creating README file: {e}")
