import os
from typing import List, Tuple

from ...utils.config import find_module_base_path
from ...utils.text import to_snake_case


def get_modules_from_file(custom_app_path: str, app_name: str) -> List[str]:
    """Retrieve modules from modules.txt, skipping lines that start with '#'.

    Args:
        custom_app_path (str): The path to the app directory.
        app_name (str): The name of the app.

    Returns:
        List[str]: List of module names found in modules.txt.

    Raises:
        FileNotFoundError: If modules.txt is not found in the specified path.
    """
    # Locate modules.txt and the base path for modules
    modules_file_path, _ = find_module_base_path(
        app_path=custom_app_path, app_name=app_name
    )

    if not modules_file_path or not os.path.exists(modules_file_path):
        raise FileNotFoundError(f"modules.txt not found in {custom_app_path}")

    # Read and return non-commented module lines from modules.txt
    with open(modules_file_path, "r") as module_file:
        modules = [
            line.strip()
            for line in module_file
            if line.strip() and not line.startswith("#")
        ]

    return modules


def delete_associated_py_files(folder_path: str, structure: List[str]) -> None:
    """Delete specific .py files (e.g., views.py, models.py) in the specified folder and its subfolders.

    Args:
        folder_path (str): The path to the folder where .py files should be deleted.
        structure (List[str]): List of module names to be deleted.
    """
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith(".py") and file.replace(".py", "") in structure:
                os.remove(os.path.join(root, file))


def create_module_structure(app_path: str, custom_app_path: str, app_name: str) -> None:
    """Create the module structure for the given app.

    Args:
        app_path (str): The path to the app directory.
        custom_app_path (str): The path to the custom app directory.
        app_name (str): The name of the app.
    """
    structure = ["views", "models", "tests", "serializers", "filters"]
    modules = get_modules_from_file(custom_app_path, app_name)

    # Create all necessary folders and delete existing .py files
    for folder in structure:
        folder_path = os.path.join(app_path, folder)
        os.makedirs(folder_path, exist_ok=True)
        delete_associated_py_files(app_path, structure)

    for module in modules:
        module_snake_case = to_snake_case(module)
        module_path = os.path.join(custom_app_path, module_snake_case, "doc")

        if not os.path.exists(module_path):
            continue

        for folder in structure:
            folder_path = os.path.join(app_path, folder)
            module_folder_path = os.path.join(folder_path, module_snake_case)
            os.makedirs(module_folder_path, exist_ok=True)

            init_imports = []
            for subfolder in os.listdir(module_path):
                subfolder_snake_case = to_snake_case(subfolder)
                subfolder_path = os.path.join(module_path, subfolder_snake_case)

                if os.path.isdir(subfolder_path):
                    doc_file_path = os.path.join(
                        module_folder_path, f"{subfolder_snake_case}.py"
                    )
                    with open(doc_file_path, "w") as f:
                        f.write(
                            f"# {subfolder_snake_case}.py for {folder} in {module_snake_case} module\n"
                        )

                    import_statement = (
                        f"from .{module_snake_case}.{subfolder_snake_case} import *\n"
                    )
                    init_imports.append(import_statement)

                elif subfolder == "__init__.py":
                    init_file_path = os.path.join(module_folder_path, "__init__.py")
                    with open(init_file_path, "w") as f:
                        f.write(
                            f"# __init__.py for {folder} in {module_snake_case} module\n"
                        )

            # Write import statements to __init__.py
            with open(os.path.join(folder_path, "__init__.py"), "w") as init_file:
                init_file.write(f"# {folder}\n")
                init_file.write(f"from . import *\n")
