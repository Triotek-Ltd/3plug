import re
import unicodedata
from typing import Callable


def to_snake_case(name: str) -> str:
    """Convert a string to snake_case by replacing spaces with underscores and lowering the case.

    Args:
        name (str): The name to convert.

    Returns:
        str: The converted name in snake_case.
    """
    if name is None:
        return ""

    value = str(name).strip()
    if not value:
        return ""

    # Normalize Unicode punctuation/letters so names are filesystem-safe and stable.
    value = unicodedata.normalize("NFKD", value)
    value = value.encode("ascii", "ignore").decode("ascii")

    # Treat separators and punctuation uniformly to avoid nested paths like "a_/_b".
    value = value.replace("/", " ").replace("\\", " ")
    value = re.sub(r"[^\w]+", "_", value)
    value = re.sub(r"_+", "_", value).strip("_")

    return value.lower()


def underscore_to_titlecase(underscore_str: str) -> str:
    """Convert underscore string to title case."""
    return re.sub(r"_(.)", lambda m: m.group(1).upper(), underscore_str.title())


def underscore_to_titlecase_main(underscore_str: str) -> str:
    """Convert an underscore-separated string to title case with spaces."""
    # Replace underscores with spaces, then convert to title case
    return re.sub(r"_+", " ", underscore_str).title()


def to_titlecase_no_space(input_str: str) -> str:
    """Convert a string with underscores or whitespace to TitleCase with no spaces.

    Args:
        input_str (str): The string to convert (e.g., "my example_string").

    Returns:
        str: The converted string in TitleCase with no spaces (e.g., "MyExampleString").
    """
    # Replace spaces with underscores, then apply TitleCase conversion
    return re.sub(r"(?:^|_| )(.)", lambda m: m.group(1).upper(), input_str.strip())
