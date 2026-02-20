import json
from typing import Any, Optional

import click


def load_json_file(file_path: str) -> Optional[Any]:
    """
    Load JSON data from a file.

    Args:
        file_path (str): The path to the JSON file.

    Returns:
        Optional[Any]: The JSON data if successfully loaded, otherwise None.
    """
    try:
        with open(file_path, "r") as file:
            return json.load(file)
    except (json.JSONDecodeError, AttributeError, FileNotFoundError) as e:
        click.echo(f"Error reading {file_path}: {e}")
        return None
