import os
from typing import Dict

from ...utils.text import to_titlecase_no_space


def create_files(base_path: str, doc_name: str, doc_id: str, module: str) -> str:
    """
    Create a doctype folder with Frappe-like files in the given base path.

    Args:
        base_path (str): Path where the doctype folder should be created.
        doc_name (str): Name of the doctype folder.
        doc_id (str): Identifier for the doctype.
        module (str): Module name.

    Returns:
        str: Path to the created doctype folder.
    """
    # Define the default files and their content
    default_files: Dict[str, str] = {
        f"{doc_id}.py": f"""
        """,
        f"{doc_id}.js": f"""

        """,
        f"{doc_id}.json": f"""
{{
    "doctype": "DocType",
    "default_view": "List",
    "sort_field": "creation",
    "sort_order": "DESC",
    "name": "{doc_name}",
    "module": "{module}",
    "fields": [],
    "permissions": [
        {{
            "role": "System Manager",
            "read": 1,
            "write": 1,
            "create": 1,
            "delete": 1
        }}
    ]
}}
        """,
        f"test_{doc_id}.py": f"""

        """,
    }

    # Create the doctype folder
    doc_folder_path: str = os.path.join(base_path, "doctype", doc_id)
    os.makedirs(doc_folder_path, exist_ok=True)

    # Create the files in the doctype folder
    for filename, content in default_files.items():
        file_path: str = os.path.join(doc_folder_path, filename)
        with open(file_path, "w") as file:
            file.write(content.strip())  # Remove unnecessary whitespace

    return doc_folder_path  # Return the path for confirmation or further actions
