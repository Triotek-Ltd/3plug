import os
import sys

import django

from .config import (  # Ensure config.py is correctly configured with these paths
    DJANGO_PATH,
    PROJECT_ROOT,
)


def initialize_django_env() -> None:
    """
    Initialize the Django environment from outside the project directory.

    :param PROJECT_ROOT: The root directory of your Django project.
    :param DJANGO_PATH: Path where Django's `manage.py` or settings module is located.
    """
    # Validate project root and Django path
    if not os.path.isdir(PROJECT_ROOT):
        raise ValueError(f"Invalid PROJECT_ROOT: {PROJECT_ROOT} does not exist.")
    if not os.path.isdir(DJANGO_PATH):
        raise ValueError(f"Invalid DJANGO_PATH: {DJANGO_PATH} does not exist.")

    # Set the Django settings module
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "manifold.settings")

    # Add project root and Django path to Python path
    sys.path.insert(0, PROJECT_ROOT)
    sys.path.insert(0, DJANGO_PATH) 

    # Optionally add the `apps` directory explicitly to sys.path
    apps_path = os.path.join(PROJECT_ROOT, "apps")
    if apps_path not in sys.path:
        sys.path.insert(0, apps_path)

    # Initialize Django if not already initialized
    # if not django.apps.apps.ready:
    django.setup()
