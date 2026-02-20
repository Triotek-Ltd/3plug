import os
import re
from collections import defaultdict
from typing import Dict, List, Set

import click


def clear_migration_file(migration_file_path: str) -> None:
    """Clear any existing content in the migration file before writing.

    Args:
        migration_file_path (str): The path to the migration file.
    """
    with open(migration_file_path, "w") as migration_file:
        migration_file.truncate(0)


def clean_field_params(field_params: str) -> str:
    """Remove 'choices' from field parameters along with everything after it up to the next comma.

    Args:
        field_params (str): The field parameters as a string.

    Returns:
        str: The cleaned field parameters.
    """
    cleaned_params = re.sub(r"choices\s*=\s*[^,]*,?\s*", "", field_params)
    return cleaned_params.strip().rstrip(",")


def handle_charfield(field_name: str, field_params: str) -> str:
    """Handle CharField type fields.

    Args:
        field_name (str): The name of the field.
        field_params (str): The parameters of the field.

    Returns:
        str: The formatted CharField string.
    """
    cleaned_params = clean_field_params(field_params)
    return f"('{field_name}', models.CharField({cleaned_params}))"


def handle_foreignkey(field_name: str, field_params: str, app_name: str) -> str:
    """Handle ForeignKey type fields.

    Args:
        field_name (str): The name of the field.
        field_params (str): The parameters of the field.
        app_name (str): The name of the Django app.

    Returns:
        str: The formatted ForeignKey string.
    """
    cleaned_params = clean_field_params(field_params)

    first_comma_index = cleaned_params.find(",")
    if first_comma_index != -1:
        before_comma = cleaned_params[:first_comma_index].lower()
        after_comma = cleaned_params[first_comma_index:]
        cleaned_params = f"{before_comma}{after_comma}"
    else:
        cleaned_params = cleaned_params.lower()

    if "on_delete" not in cleaned_params:
        cleaned_params += ", on_delete=models.CASCADE"

    return f"('{field_name}', models.ForeignKey({cleaned_params}))".replace(
        "ForeignKey(", "ForeignKey(to="
    )


def handle_manytomanyfield(field_name: str, field_params: str, app_name: str) -> str:
    """Handle ManyToManyField type fields.

    Args:
        field_name (str): The name of the field.
        field_params (str): The parameters of the field.
        app_name (str): The name of the Django app.

    Returns:
        str: The formatted ManyToManyField string.
    """
    related_model = re.search(r"'(\w+)'", field_params)
    if related_model:
        related_model_name = related_model.group(1)
        cleaned_params = f"to='{app_name}.{related_model_name}'"
    else:
        cleaned_params = ""
    return f"('{field_name}', models.ManyToManyField({cleaned_params}))"


def create_manual_migrations(app_name: str, django_path: str) -> None:
    """Create an initial migration file by scanning models in the app's models folder.

    Args:
        app_name (str): The name of the Django app.
        django_path (str): The path to the Django project.
    """
    migrations_folder = os.path.join(django_path, app_name, "migrations")
    models_folder = os.path.join(django_path, app_name, "models")
    migration_file_path = os.path.join(migrations_folder, "0001_initial.py")

    os.makedirs(migrations_folder, exist_ok=True)
    clear_migration_file(migration_file_path)

    dependencies: Dict[str, Set[str]] = defaultdict(set)
    models_data: Dict[str, List[str]] = {}

    model_files = [
        os.path.join(root, file)
        for root, _, files in os.walk(models_folder)
        for file in files
        if file.endswith(".py") and not file.startswith("__init__")
    ]

    for model_file in model_files:
        with open(model_file, "r") as file:
            model_content = file.read()

            model_names = re.findall(r"class (\w+)\(BaseModel\):", model_content)
            for model_name in model_names:
                existing_fields = ["id"]
                fields = []
                fields.append(
                    "('id', models.CharField(editable=False, max_length=255, primary_key=True, serialize=False, unique=True))"
                )

                field_matches = re.findall(
                    r"(\w+)\s*=\s*models\.(\w+)\((.*?)\)", model_content
                )
                for field_name, field_type, field_params in field_matches:
                    if field_name == "id":
                        continue
                    existing_fields.append(field_name)
                    if field_type == "CharField":
                        field_code = handle_charfield(field_name, field_params)
                    elif field_type == "ForeignKey":
                        field_code = handle_foreignkey(
                            field_name, field_params, app_name
                        )
                        related_model = re.search(r"to='(.+?)\.(.+?)'", field_code)
                        if related_model:
                            dependencies[model_name].add(related_model.group(2))
                    elif field_type == "ManyToManyField":
                        field_code = handle_manytomanyfield(
                            field_name, field_params, app_name
                        )
                        related_model = re.search(r"to='(.+?)\.(.+?)'", field_code)
                        if related_model:
                            dependencies[model_name].add(related_model.group(2))
                    else:
                        cleaned_params = clean_field_params(field_params)
                        field_code = (
                            f"('{field_name}', models.{field_type}({cleaned_params}))"
                        )

                    fields.append(field_code)

                if "created_at" not in existing_fields:
                    fields.append(
                        "('created_at', models.DateTimeField(auto_now_add=True))"
                    )
                if "modified_at" not in existing_fields:
                    fields.append(
                        "('modified_at', models.DateTimeField(auto_now=True))"
                    )

                models_data[model_name] = fields

    sorted_models = topological_sort(models_data.keys(), dependencies)

    with open(migration_file_path, "w") as migration_file:
        migration_file.write("from django.db import migrations, models\n\n\n")
        migration_file.write("class Migration(migrations.Migration):\n")
        migration_file.write("    initial = True\n\n")
        migration_file.write("    dependencies = []\n\n")
        migration_file.write("    operations = [\n")

        for model_name in sorted_models:
            fields = models_data[model_name]
            migration_file.write(f"        migrations.CreateModel(\n")
            migration_file.write(f"            name='{model_name}',\n")
            migration_file.write("            fields=[\n")
            for field_code in fields:
                migration_file.write(f"                {field_code},\n")
            migration_file.write("            ],\n")
            migration_file.write("        ),\n")

        migration_file.write("    ]\n")

    click.echo(f"Manual migration file created at '{migration_file_path}'.")


def topological_sort(models: List[str], dependencies: Dict[str, Set[str]]) -> List[str]:
    """Order models based on dependencies to avoid foreign key conflicts.

    Args:
        models (List[str]): List of model names.
        dependencies (Dict[str, Set[str]]): Dictionary of model dependencies.

    Returns:
        List[str]: Sorted list of model names.
    """
    sorted_models = []
    visited = set()
    temp_stack = set()

    def visit(model: str) -> None:
        if model in visited:
            return
        if model in temp_stack:
            raise ValueError("Circular dependency detected!")
        temp_stack.add(model)
        for dependency in dependencies[model]:
            visit(dependency)
        temp_stack.remove(model)
        visited.add(model)
        sorted_models.append(model)

    for model in models:
        visit(model)

    return sorted_models
