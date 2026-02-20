import json
import os
from typing import Any, Optional

import click


def ensure_file_exists(file_path: str, initial_data: Optional[Any] = None) -> None:
    """
    Ensure the given file exists, creating the necessary directory and initializing the file with `initial_data` if not.

    :param file_path: The path of the file to ensure exists.
    :param initial_data: The data to initialize the file with (default is an empty list).
    """
    # Ensure the directory exists
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    # If the file doesn't exist, create it and initialize with `initial_data`
    if not os.path.exists(file_path):
        with open(file_path, "w") as f:
            json.dump(initial_data or [], f)  # Initialize with an empty list by default
