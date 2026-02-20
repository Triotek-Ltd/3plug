import re
from typing import Dict, List, TextIO, Union

import click


def write_id_field(
    module_file: TextIO,
    file_path: str,
    settings: Union[Dict, List[Dict]],
    model_name: str,
) -> None:
    """
    Write the id field based on settings.

    Args:
        module_file (TextIO): The file object of the module.
        file_path (str): The path to the file.
        settings (Union[Dict, List[Dict]]): The settings for id naming.
        model_name (str): The name of the model.
    """
    if isinstance(settings, list):
        settings = settings[0] if settings else {}
    id_naming_method = settings.get("idNamingMethod", "incrementalNaming")
    id_naming_rule = settings.get("idNamingRule", "")
    field_for_id_naming = settings.get("fieldForIdNaming", "")
    function_for_id_naming = settings.get("functionForIdNaming", "")
    length_for_incremental_naming = settings.get("lengthForIncrementalNaming", 6)

    try:
        if id_naming_method == "fieldNaming" and field_for_id_naming:
            new_save = (
                f"    id = models.CharField(primary_key=True, max_length=255, editable=False)\n\n"
                f"    def save(self, *args, **kwargs):\n"
                f"        if self.{field_for_id_naming}:\n"
                f"            self.id = str(self.{field_for_id_naming})\n"
                f"        super().save(*args, **kwargs)\n\n"
            )
        elif id_naming_method == "functionNaming" and function_for_id_naming:
            new_save = f"    id = models.CharField(primary_key=True, max_length=255, default={function_for_id_naming})\n"
        elif id_naming_method == "incrementalNaming":
            int(length_for_incremental_naming)
            new_save = (
                f"    def save(self, *args, **kwargs):\n"
                f"        super().save(*args, **kwargs)\n\n"
            )
        elif id_naming_method == "randomNaming":
            new_save = f"    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)\n"
        elif id_naming_method == "customNaming" and id_naming_rule:
            new_save = (
                f"    id = models.CharField(primary_key=True, max_length=255, default='{id_naming_rule}')\n\n"
                f"    def generate_custom_id(self):\n"
                f"        from core.models.template import generate_custom_id\n"
                f"        return generate_custom_id('{id_naming_rule}', self)\n\n"
                f"    def save(self, *args, **kwargs):\n"
                f"        if self.id == '{id_naming_rule}':\n"
                f"            self.id = self.generate_custom_id()\n"
                f"        super().save(*args, **kwargs)\n\n"
            )
        else:
            new_save = f"    id = models.AutoField(primary_key=True)\n"
            click.echo(
                f"Warning: Unrecognized idNamingMethod '{id_naming_method}'. Defaulting to incrementalNaming."
            )

        merge_with_existing_save(module_file, new_save, model_name)

    except Exception as e:
        click.echo(f"Error writing id field: {e}")


def merge_with_existing_save(
    module_file: TextIO, new_save: str, model_name: str
) -> None:
    """
    Merge the new save logic with the existing save method in the model.

    Args:
        module_file (TextIO): The file object of the module.
        new_save (str): The new save method to be merged.
        model_name (str): The name of the model.
    """
    try:
        module_file.seek(0)
        existing_lines = module_file.readlines()
        class_started = False
        existing_save = ""
        merged_save = new_save
        indent = ""

        for i, line in enumerate(existing_lines):
            if line.startswith(f"class {model_name}"):
                class_started = True
                indent = re.match(r"^(\s*)", line).group(1)

            if class_started and line.strip().startswith("def save"):

                save_method_lines = []
                for j in range(i, len(existing_lines)):
                    save_method_lines.append(existing_lines[j])
                    if existing_lines[j].strip() == "super().save(*args, **kwargs)":
                        break
                existing_save = "".join(save_method_lines)

                existing_lines = existing_lines[:i] + existing_lines[j + 1 :]
                break

        if existing_save:
            merged_save = merge_save_methods(existing_save, new_save)

        merged_save_lines = [
            f"{indent}{line}" if line.strip() else line
            for line in merged_save.split("\n")
        ]
        if not merged_save_lines[0].startswith("    "):
            merged_save_lines[0] = "    " + merged_save_lines[0]
        indented_content = [f"" + merged_save_lines[0] + "\n"] + [
            line + "\n" for line in merged_save_lines[1:]
        ]

        new_file_content = (
            existing_lines[: i + 1] + indented_content + existing_lines[i + 2 :]
        )

        module_file.seek(0)
        module_file.truncate()
        module_file.writelines(new_file_content)

    except Exception as e:
        click.echo(f"Error merging save methods: {e}")
        return new_save


def merge_save_methods(existing_save: str, new_save: str) -> str:
    """
    Merge existing save method with the new save logic.

    Args:
        existing_save (str): The existing save method.
        new_save (str): The new save method to be merged.

    Returns:
        str: The combined save method.
    """
    existing_save_lines = existing_save.strip().split("\n")[1:]

    new_save_lines = new_save.strip().split("\n")[:-1]

    combined_save = "\n".join(new_save_lines + existing_save_lines)

    return combined_save.strip()
