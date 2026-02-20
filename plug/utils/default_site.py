import json
import os
from typing import Any, Dict, Optional

import click


def get_default_site_info(PROJECT_ROOT: str) -> Optional[Dict[str, Any]]:
    """
    Utility function to get the Django path and site name of the default site.

    :param PROJECT_ROOT: The root directory of the project
    :return: A dictionary with site information if a default site is found, otherwise None
    """
    sites_json_path = os.path.join(PROJECT_ROOT, "sites", "common_site_config.json")

    if not os.path.exists(sites_json_path):
        click.echo("No sites found in sites.json.")
        return None

    # Load sites from sites.json
    with open(sites_json_path, "r") as json_file:
        config = json.load(json_file)

    # Find the default site
    selected_site = config.get("default_site") or config.get("default")

    if selected_site:
        return selected_site
    else:
        return None
