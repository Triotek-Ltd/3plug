import os
import shutil
import sys
import traceback

import click

from ..sites.migrate.migrate import run_migration
from ..utils.config import PROJECT_ROOT


@click.command()
@click.argument("source_app", type=str)
@click.argument("source_module", type=str)
@click.argument("dest_app", type=str)
@click.argument("dest_module", type=str)
@click.argument("doc", type=str)
def movedoc(
    source_app: str, source_module: str, dest_app: str, dest_module: str, doc: str
) -> None:
    """
    Move a doc from one app/module to another.

    Args:
        source_app (str): The source application name.
        source_module (str): The source module name.
        dest_app (str): The destination application name.
        dest_module (str): The destination module name.
        doc (str): The document name to be moved.
    """

    # Define source and destination paths
    source_app_path: str = os.path.join(
        PROJECT_ROOT, "apps", source_app, source_app, source_module, "doctype", doc
    )
    dest_app_path: str = os.path.join(
        PROJECT_ROOT, "apps", dest_app, dest_app, dest_module, "doctype"
    )

    # Validate the source document exists
    if not os.path.exists(source_app_path):
        click.echo(
            f"Source document '{doc}' not found in '{source_module}' module of '{source_app}' app."
        )
        return

    # Ensure the destination path exists, create it if necessary
    os.makedirs(dest_app_path, exist_ok=True)

    # Define destination document path
    dest_doc_path: str = os.path.join(dest_app_path, doc)

    # Check if the document already exists in the destination
    if os.path.exists(dest_doc_path):
        click.echo(
            f"Document '{doc}' already exists in the destination '{dest_module}' module of '{dest_app}' app."
        )
        return

    # Move the document
    try:
        shutil.move(source_app_path, dest_doc_path)
        click.echo(
            f"Document '{doc}' moved from '{source_app}/{source_module}' to '{dest_app}/{dest_module}'."
        )
    except Exception as e:
        click.echo(f"Error occurred while moving document: {str(e)}")
        exc_type, exc_value, exc_tb = sys.exc_info()
        traceback.print_exception(exc_type, exc_value, exc_tb)
        return

    # Cleanup: Remove empty directories in the source path if necessary
    source_module_path: str = os.path.join(
        PROJECT_ROOT, "apps", source_app, source_module
    )
    try:
        if not os.listdir(
            os.path.join(source_module_path, "doc")
        ):  # If the 'doc' folder is empty
            os.rmdir(
                os.path.join(source_module_path, "doc")
            )  # Remove empty 'doc' folder
        if not os.listdir(source_module_path):  # If the module folder is empty
            os.rmdir(source_module_path)  # Remove empty module folder

    except OSError as cleanup_error:
        click.echo(f"Cleanup error: {str(cleanup_error)}")

    run_migration()


if __name__ == "__main__":
    movedoc()
