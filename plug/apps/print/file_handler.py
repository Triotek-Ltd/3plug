import os
from typing import Dict

from ...utils.text import to_titlecase_no_space


def create_files(base_path: str, doc_name: str, doc_id: str, module: str) -> str:
    """
    Create a print_format folder with Frappe-like files in the given base path.

    Args:
        base_path (str): Path where the print_format folder should be created.
        doc_name (str): Name of the print_format folder.
        doc_id (str): Identifier for the print_format.
        module (str): Module name.

    Returns:
        str: Path to the created print_format folder.
    """
    # Define the default files and their content
    default_files: Dict[str, str] = {
        f"{doc_id}.py": f"""
# {doc_name} print_format

import frappe
from frappe.model.document import Document

class {to_titlecase_no_space(doc_name)}(Document):
    pass
        """,
        f"{doc_id}.js": f"""
// {doc_name} JavaScript File

frappe.ui.form.on('{doc_name}', {{
    refresh: function (frm) {{
        // Custom script logic here
    }},
}});
        """,
        f"{doc_id}.json": f"""
{{
    "print_format": "print_format",
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
# Test for {doc_name}

import frappe
import unittest

class Test{to_titlecase_no_space(doc_name)}(unittest.TestCase):
    def test_example(self):
        # Example test case
        self.assertTrue(True)
        """,
    }

    # Create the print_format folder
    doc_folder_path: str = os.path.join(base_path, "print_format", doc_id)
    os.makedirs(doc_folder_path, exist_ok=True)

    # Create the files in the print_format folder
    for filename, content in default_files.items():
        file_path: str = os.path.join(doc_folder_path, filename)
        with open(file_path, "w") as file:
            file.write(content.strip())  # Remove unnecessary whitespace

    return doc_folder_path  # Return the path for confirmation or further actions
