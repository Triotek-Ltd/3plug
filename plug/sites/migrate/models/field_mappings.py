from typing import Any, Dict, List


def get_field_type(field_type: str) -> str:
    """
    Returns the corresponding Django model field type for a given Frappe field type.

    Args:
        field_type (str): The Frappe field type.

    Returns:
        str: The corresponding Django model field type.
    """
    field_type_mapping = {
        "Select": "CharField",
        "Link": "ForeignKey",
        "Table": "ManyToManyField",
        "MultiSelect": "ManyToManyField",
        "Table MultiSelect": "ManyToManyField",
        "Check": "BooleanField",
        "Boolean": "BooleanField",
        "Date": "DateField",
        "Datetime": "DateField",
        "Int": "IntegerField",
        "Float": "FloatField",
        "Currency": "DecimalField",
        "Percent": "DecimalField",
        "Text": "TextField",
        "Data": "CharField",
        "BarcodeField": "CharField",
        "Duration": "DurationField",
        "Small Text": "TextField",
        "Text Area": "TextField",
        "Long Text": "TextField",
        "HTML": "TextField",
        "HTML Editor": "TextField",
        "Markdown Editor": "TextField",
        "Password": "CharField",
        "Phone": "CharField",
        "Rating": "DecimalField",
        "Signature": "CharField",
        "Attach": "FileField",
        "Attach Image": "FileField",
        "Image": "FileField",
        "Barcode": "FileField",
        "JSON": "JSONField",
        "Time": "TimeField",
    }

    # Return the mapped Django field type, defaulting to CharField if not found
    return field_type_mapping.get(field_type, "CharField")


def process_fields(fields: List[Dict[str, Any]]) -> List[Dict[str, str]]:
    """
    Process fields, skipping any with the type 'Column Break', 'Section Break', or 'Tab Break'.

    Args:
        fields (List[Dict[str, Any]]): A list of field dictionaries to process.

    Returns:
        List[Dict[str, str]]: A list of processed field dictionaries with mapped Django field types.
    """
    processed_fields = []
    for field in fields:
        raw_field_type = field.get("fieldtype")

        # Skip fields with the type 'Column Break', 'Section Break', or 'Tab Break'
        if raw_field_type in ["Column Break", "Section Break", "Tab Break"]:
            continue  # Skip this field and move to the next one

        # Get the corresponding Django field type
        field_type = get_field_type(raw_field_type)

        # Add the processed field (you can also map other data if needed)
        processed_fields.append(
            {"fieldname": field.get("fieldname"), "fieldtype": field_type}
        )

    return processed_fields
