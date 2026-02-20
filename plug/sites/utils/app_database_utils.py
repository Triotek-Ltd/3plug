import json
import os
import sys
from typing import Any, List, Tuple

import django
from django.db.models import Model

from ...utils.config import DOCS_JSON_PATH, get_site_config
from ...utils.file_operations import ensure_file_exists


def initialize_django_env(django_path: str) -> None:
    """
    Initialize the Django environment based on the provided django_path.

    Args:
        django_path (str): The path to the Django project.
    """
    os.environ.setdefault(
        "DJANGO_SETTINGS_MODULE", "manifold.settings"
    )  # Update to your settings module
    sys.path.insert(0, django_path)  # Add Django project path to Python path
    django.setup()


def create_entries_from_config(django_path: str, site: str) -> None:
    """
    Process the JSON configuration file and create/update database entries.

    Args:
        django_path (str): The path to the Django project.
        site (str): The site name to filter the configuration.
    """
    # Initialize Django environment
    initialize_django_env(django_path)
    # Import models after Django setup
    from core.models import App  # Update with actual path to models
    from core.models import Document, Module, PrintFormat

    # Load JSON configuration file
    ensure_file_exists(DOCS_JSON_PATH, initial_data=[])
    site_data = get_site_config(site)
    installed_apps = site_data.get("installed_apps", []) if site_data else []
    installed_apps.append("core")
    with open(DOCS_JSON_PATH, "r") as file:
        config = json.load(file)

    # Cache existing entries to reduce redundant queries
    existing_apps = {app.id: app for app in App.objects.using(site).all()}
    existing_modules = {
        module.id: module for module in Module.objects.using(site).all()
    }
    existing_docs = {doc.id: doc for doc in Document.objects.using(site).all()}
    existing_print_formats = {pf.id: pf for pf in PrintFormat.objects.using(site).all()}

    # Prepare lists for bulk operations
    apps_to_create: List[App] = []
    modules_to_create: List[Module] = []
    docs_to_create: List[Document] = []
    print_formats_to_create: List[PrintFormat] = []

    # Track IDs that have already been added to avoid duplicates
    added_doc_ids = set(existing_docs.keys())

    # Process each app and its modules/documents
    for app_data in config:
        app_id = app_data.get("id")
        app_name = app_data.get("name")

        # Skip entries without id or name
        if not app_id or not app_name:
            continue

        # Only process apps that are in the installed_apps list
        if app_name not in installed_apps:
            continue

        # Update or create the App entry
        if app_id in existing_apps:
            app = existing_apps[app_id]
            if app.name != app_name:
                app.name = app_name
                app.save()
        else:
            apps_to_create.append(App(id=app_id, name=app_name))

        # Process modules and documents similarly
        for module_data in app_data.get("modules", []):
            module_id = module_data.get("id")
            module_name = module_data.get("name")

            # Skip entries without id or name
            if not module_id or not module_name:
                continue

            if module_id in existing_modules:
                module = existing_modules[module_id]
                if module.name != module_name:
                    module.name = module_name
                    module.save()
            else:
                modules_to_create.append(
                    Module(id=module_id, name=module_name, app_id=app_id)
                )

            for doc_data in module_data.get("docs", []):
                doc_id = doc_data.get("id")
                doc_name = doc_data.get("name")

                # Skip entries without id or name
                if not doc_id or not doc_name:
                    continue

                # Skip if the doc_id already exists in existing_docs or has been added to docs_to_create
                if doc_id in added_doc_ids:
                    continue

                # Add the doc_id to the set of added IDs
                added_doc_ids.add(doc_id)

                # Create the Document object
                docs_to_create.append(
                    Document(
                        id=doc_id, name=doc_name, module_id=module_id, app_id=app_id
                    )
                )

            for pf_data in module_data.get("print_formats", []):
                pf_id = pf_data.get("id")
                pf_name = pf_data.get("name")

                # Skip entries without id or name
                if not pf_id or not pf_name:
                    continue

                if pf_id in existing_print_formats:
                    pf = existing_print_formats[pf_id]
                    if pf.name != pf_name:
                        pf.name = pf_name
                        pf.save()
                else:
                    print_formats_to_create.append(
                        PrintFormat(
                            id=pf_id, name=pf_name, module_id=module_id, app_id=app_id
                        )
                    )

    # Bulk create new entries
    if apps_to_create:
        App.objects.using(site).bulk_create(apps_to_create)
    if modules_to_create:
        Module.objects.using(site).bulk_create(modules_to_create)
    if docs_to_create:
        Document.objects.using(site).bulk_create(docs_to_create)
    if print_formats_to_create:
        PrintFormat.objects.using(site).bulk_create(print_formats_to_create)