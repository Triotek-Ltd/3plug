import re
import threading
from concurrent.futures import ThreadPoolExecutor
from difflib import get_close_matches

import pandas as pd
from core.models import Document  # Assuming core.Document is a Django model
from django.apps import apps
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .core import run_subprocess

# Dynamically fetch all models from all apps in the project
all_models = {model.__name__: model for model in apps.get_models()}


# Helper function to normalize headers
def normalize_header(header):
    header = re.sub(r"[^\w\s]", "", header)  # Remove non-alphanumeric characters
    return header.strip().lower().replace(" ", "_")


def normalize_name(name):
    """Convert name to title case and remove spaces."""
    return re.sub(r"\s+", "", name).title()


def get_matching_app(associated_app):
    """Find the best matching app from installed apps."""
    installed_apps = [app_config.name for app_config in apps.get_app_configs()]

    # First, check for an exact match
    if associated_app in installed_apps:
        return associated_app

    # If not found, check for alternative naming conventions like "pos" → "pos_app"
    alternative_name = f"{associated_app}_app"
    if alternative_name in installed_apps:
        return alternative_name


def get_model_by_name(model_name):
    normalized_name = normalize_name(model_name)

    # Fetch all document names from core.Document
    document_names = Document.objects.values_list("name", flat=True)

    # Find the closest match ignoring case and spaces
    closest_match = get_close_matches(
        normalized_name, [normalize_name(name) for name in document_names], n=1
    )

    if not closest_match:
        return None  # No match found

    # Retrieve the actual document entry from core.Document
    document_entry = Document.objects.filter(name__iexact=closest_match[0]).first()
    if not document_entry:
        return None

    associated_app = get_matching_app(document_entry.app)

    # Fetch models from the identified app
    app_models = {
        model.__name__: model
        for model in apps.get_app_config(associated_app).get_models()
    }

    # Find the closest match in models
    matched_model = get_close_matches(normalized_name, app_models.keys(), n=1)

    return app_models.get(matched_model[0]) if matched_model else None


def to_titlecase_no_space(input_str):
    """Convert a string with underscores or whitespace to TitleCase with no spaces.

    Args:
        input_str (str): The string to convert (e.g., "my example_string").

    Returns:
        str: The converted string in TitleCase with no spaces (e.g., "MyExampleString").
    """
    # Replace spaces with underscores, then apply TitleCase conversion
    return re.sub(r"(?:^|_| )(.)", lambda m: m.group(1).upper(), input_str.strip())


# Serializer for file or data upload (for data import)
class DataUploadSerializer(serializers.Serializer):
    file = serializers.FileField(required=False)
    data = serializers.ListField(child=serializers.DictField(), required=False)
    model_name = serializers.CharField()

    # Ensure at least one of `file` or `data` is provided
    def validate(self, data):
        file = data.get("file")
        json_data = data.get("data")

        if not file and not json_data:
            raise serializers.ValidationError(
                "Either 'file' or 'data' must be provided."
            )

        if file and json_data:
            raise serializers.ValidationError(
                "Only one of 'file' or 'data' should be provided."
            )

        return data


# Serializer for bulk deletion (accepts any type of ID)
class BulkDeleteSerializer(serializers.Serializer):
    model_name = serializers.CharField()
    ids = serializers.ListField(
        child=serializers.CharField(),  # Changed to CharField to accept any type of ID
        allow_empty=False,
    )


# View for importing data from CSV, Excel, TXT, or JSON
class DataImportAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = DataUploadSerializer(data=request.data)
        if serializer.is_valid():
            file = serializer.validated_data.get("file")
            json_data = serializer.validated_data.get("data")
            model_name = to_titlecase_no_space(serializer.validated_data["model_name"])

            # Get the model by model name
            model = get_model_by_name(model_name)
            if not model:
                return Response(
                    {"error": "Invalid model name"}, status=status.HTTP_400_BAD_REQUEST
                )

            data_list = []

            # If file is provided, read it
            if file:
                file_extension = file.name.split(".")[-1].lower()
                if file_extension == "csv":
                    df = pd.read_csv(file)
                elif file_extension in ["xls", "xlsx"]:
                    df = pd.read_excel(file)
                elif file_extension == "txt":
                    df = pd.read_csv(
                        file, delimiter="\t"
                    )  # Assuming tab-separated for TXT
                else:
                    return Response(
                        {"error": "Unsupported file format"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # Normalize the headers
                df.columns = [normalize_header(col) for col in df.columns]

                # Convert DataFrame rows to dict
                data_list = df.to_dict(orient="records")

            # If JSON data is provided, use it directly
            elif json_data:
                data_list = json_data

            # Get the model fields
            model_fields = [f.name for f in model._meta.fields]

            # Filter columns that match model fields
            valid_columns = [col for col in data_list[0].keys() if col in model_fields]
            if not valid_columns:
                return Response(
                    {
                        "error": "No valid fields found in the data matching model fields"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            errors = []
            records = 0  # Count of successfully imported records

            # Iterate over rows and create objects
            for data in data_list:
                try:
                    data = {col: data[col] for col in valid_columns}

                    # Check if 'id' exists in the data, use update_or_create for each record
                    if "id" in data:
                        # Update the record if it exists, otherwise create a new one
                        model.objects.update_or_create(id=data["id"], defaults=data)
                    else:
                        # Create a new record without specifying 'id'
                        obj = model(**data)
                        obj.save()  # Save the record individually

                    records += 1  # Increment successfully imported record count
                except Exception as e:
                    errors.append(
                        {"data": data, "error": str(e)}  # Store the error message
                    )

            return Response(
                {
                    "success": f"{records} records imported successfully",
                    "errors": errors if errors else None,  # Return errors if any
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BulkDeleteAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = BulkDeleteSerializer(data=request.data)
        if serializer.is_valid():
            model_name = to_titlecase_no_space(serializer.validated_data["model_name"])
            ids = serializer.validated_data["ids"]

            # Get the model by model name
            model = get_model_by_name(model_name)
            print(model_name)
            if not model:
                return Response(
                    {"error": "Invalid model name"}, status=status.HTTP_400_BAD_REQUEST
                )

            # Function to delete a single record
            def delete_record(record_id):
                try:
                    record = model.objects.get(id=record_id)
                    if model_name == "Document":

                        def run_subprocess_thread():
                            run_subprocess(
                                [
                                    "3plug",
                                    "dropdoc",
                                    "--app",
                                    record.app.name,
                                    "--module",
                                    record.module.name,
                                    record.name,
                                ],
                                "Document deleted successfully",
                                "Failed to delete document",
                            )

                        subprocess_thread = threading.Thread(
                            target=run_subprocess_thread
                        )
                        subprocess_thread.start()
                        subprocess_thread.join()  # Ensure subprocess completes

                    record.delete()
                    return True
                except Exception as e:
                    return str(e)

            # Perform the bulk delete using threading
            results = []
            with ThreadPoolExecutor() as executor:
                futures = [
                    executor.submit(delete_record, record_id) for record_id in ids
                ]
                for future in futures:
                    results.append(future.result())

            # Check for errors in the results
            errors = [result for result in results if result is not True]
            if errors:
                print(errors)
                return Response(
                    {"message": "Some records could not be deleted", "errors": errors},
                    status=status.HTTP_207_MULTI_STATUS,
                )

            return Response(
                {"message": "Records deleted successfully"}, status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
