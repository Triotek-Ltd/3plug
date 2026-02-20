import datetime
import getpass
import os
import sys
import traceback
from typing import Dict, Optional

import requests

SPDX_LICENSE_URL = "https://raw.githubusercontent.com/spdx/license-list-data/main/text/"


def normalize_license_name(license_type: str) -> str:
    """Convert license names to SPDX-compliant format."""

    license_map = {
        # MIT License
        "mit": "MIT",
        "MIT": "MIT",
        # GNU General Public Licenses (GPL)
        "gpl": "GPL-3.0",
        "gpl3": "GPL-3.0",
        "gpl-3.0": "GPL-3.0",
        "GPL-3.0": "GPL-3.0",
        "gnu general public license v3": "GPL-3.0",
        "gpl2": "GPL-2.0",
        "gpl-2.0": "GPL-2.0",
        "GPL-2.0": "GPL-2.0",
        "gplv2": "GPL-2.0",
        "gnu gpl 2": "GPL-2.0",
        "gnu general public license v2": "GPL-2.0",
        # Lesser General Public License (LGPL)
        "lgpl": "LGPL-3.0",
        "lgpl3": "LGPL-3.0",
        "lgpl-3.0": "LGPL-3.0",
        "LGPL-3.0": "LGPL-3.0",
        "lgplv3": "LGPL-3.0",
        "lgpl 2.1": "LGPL-2.1",
        "lgpl2.1": "LGPL-2.1",
        "lgpl-2.1": "LGPL-2.1",
        "lgpl v2.1": "LGPL-2.1",
        "LGPL-2.1": "LGPL-2.1",
        # Affero General Public License (AGPL)
        "agpl": "AGPL-3.0",
        "agpl3": "AGPL-3.0",
        "agpl-3.0": "AGPL-3.0",
        "agpl v3": "AGPL-3.0",
        "AGPL-3.0": "AGPL-3.0",
        "gnu agpl 3": "AGPL-3.0",
        "gnu affero general public license v3": "AGPL-3.0",
        # Apache License
        "apache": "Apache-2.0",
        "apache2": "Apache-2.0",
        "apache-2.0": "Apache-2.0",
        "apache v2": "Apache-2.0",
        "Apache-2.0": "Apache-2.0",
        "apache software license": "Apache-2.0",
        "apache software license 2.0": "Apache-2.0",
        # BSD Licenses
        "bsd": "BSD-3-Clause",
        "bsd3": "BSD-3-Clause",
        "bsd-3.0": "BSD-3-Clause",
        "bsd 3-clause": "BSD-3-Clause",
        "BSD-3-Clause": "BSD-3-Clause",
        "bsd-3-clause license": "BSD-3-Clause",
        "bsd2": "BSD-2-Clause",
        "bsd-2.0": "BSD-2-Clause",
        "bsd 2-clause": "BSD-2-Clause",
        "bsd 2 clause license": "BSD-2-Clause",
        "BSD-2-Clause": "BSD-2-Clause",
        # Mozilla Public License (MPL)
        "mpl": "MPL-2.0",
        "mpl2": "MPL-2.0",
        "mpl-2.0": "MPL-2.0",
        "MPL-2.0": "MPL-2.0",
        "mozilla public license 2.0": "MPL-2.0",
        # Eclipse Public License (EPL)
        "epl": "EPL-2.0",
        "epl2": "EPL-2.0",
        "epl-2.0": "EPL-2.0",
        "EPL-2.0": "EPL-2.0",
        "eclipse public license 2.0": "EPL-2.0",
        # Creative Commons Licenses (CC)
        "cc0": "CC0-1.0",
        "CC0-1.0": "CC0-1.0",
        "cc0-1.0": "CC0-1.0",
        "creative commons zero": "CC0-1.0",
        "cc by": "CC-BY-4.0",
        "cc-by": "CC-BY-4.0",
        "CC-BY-4.0": "CC-BY-4.0",
        "cc-by-4.0": "CC-BY-4.0",
        "creative commons attribution": "CC-BY-4.0",
        "creative commons attribution 4.0": "CC-BY-4.0",
        "cc by-sa": "CC-BY-SA-4.0",
        "cc-by-sa": "CC-BY-SA-4.0",
        "CC-BY-SA-4.0": "CC-BY-SA-4.0",
        "cc-by-sa-4.0": "CC-BY-SA-4.0",
        "creative commons attribution share-alike": "CC-BY-SA-4.0",
        "creative commons attribution share-alike 4.0": "CC-BY-SA-4.0",
        # Unlicense
        "unlicense": "Unlicense",
        "public domain": "Unlicense",
        "Unlicense": "Unlicense",
        # Zlib/Libpng
        "zlib": "Zlib",
        "Zlib": "Zlib",
        "zlib/libpng": "Zlib",
        # Boost Software License
        "bsl": "BSL-1.0",
        "BSL-1.0": "BSL-1.0",
        "boost": "BSL-1.0",
        "boost software license": "BSL-1.0",
        "boost software license 1.0": "BSL-1.0",
        # WTFPL (Do What The F*** You Want To Public License)
        "wtfpl": "WTFPL",
        "WTFPL": "WTFPL",
        "do what the f*** you want to public license": "WTFPL",
    }

    # Normalize input: lowercase and strip spaces
    license_type = license_type.strip().lower()

    # Return SPDX-compliant name or assume correct if not mapped
    return license_map.get(license_type, license_type.replace(" ", "-"))


def fetch_license_text(license_type: str) -> str:
    """Fetch the full license text from the official URL for each license type."""
    license_urls = {
        "MIT": "https://opensource.org/licenses/MIT",
        "GPL-3.0": "https://www.gnu.org/licenses/gpl-3.0.txt",
        "GPL-2.0": "https://www.gnu.org/licenses/gpl-2.0.txt",
        "LGPL-3.0": "https://www.gnu.org/licenses/lgpl-3.0.txt",
        "LGPL-2.1": "https://www.gnu.org/licenses/lgpl-2.1.txt",
        "AGPL-3.0": "https://www.gnu.org/licenses/agpl-3.0.txt",
        "Apache-2.0": "https://www.apache.org/licenses/LICENSE-2.0",
        "BSD-3-Clause": "https://opensource.org/licenses/BSD-3-Clause",
        "BSD-2-Clause": "https://opensource.org/licenses/BSD-2-Clause",
        "MPL-2.0": "https://www.mozilla.org/en-US/MPL/2.0/",
        "EPL-2.0": "https://www.eclipse.org/legal/epl-2.0/",
        "CC0-1.0": "https://creativecommons.org/publicdomain/zero/1.0/",
        "CC-BY-4.0": "https://creativecommons.org/licenses/by/4.0/",
        "CC-BY-SA-4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
        "Unlicense": "https://unlicense.org/",
        "Zlib": "https://opensource.org/licenses/Zlib",
        "BSL-1.0": "https://opensource.org/licenses/BSL-1.0",
        "WTFPL": "http://www.wtfpl.net/",
    }

    normalized_license = normalize_license_name(license_type)
    license_url = license_urls.get(normalized_license)

    if not license_url:
        return f"{normalized_license} License\n\n[License text unavailable. Please check official site]."

    try:
        response = requests.get(license_url, timeout=10)
        if response.status_code == 200:
            return response.text
        else:
            return f"{normalized_license} License\n\n[License text unavailable. Please check official site]."
    except requests.RequestException:
        return f"{normalized_license} License\n\n[License text unavailable. Please check official site]."


def autofill_license(license_text: str) -> str:
    """Replace placeholders in license text."""
    current_year = str(datetime.datetime.now().year)
    copyright_holder = getpass.getuser()  # Use the current system user

    license_text = license_text.replace("<year>", current_year)
    license_text = license_text.replace("<copyright holders>", copyright_holder)

    return license_text


def create_license(base_path: str, license_type: str) -> None:
    """Create a LICENSE.txt file with the specified license type."""
    license_path = os.path.join(base_path, "LICENSE.txt")

    # Fetch and autofill license text
    license_content = fetch_license_text(license_type)
    license_content = autofill_license(license_content)

    # Ensure the directory exists
    os.makedirs(os.path.dirname(license_path), exist_ok=True)

    # Write to LICENSE.txt
    try:
        with open(license_path, "w") as license_file:
            license_file.write(license_content)
    except Exception:
        exc_type, exc_value, exc_tb = sys.exc_info()
        traceback.print_exception(exc_type, exc_value, exc_tb)


def create_files_from_templates(
    base_path: str,
    app_name: str,
    templates_folder: str,
    license_type: str,
    dynamic_content: Optional[Dict[str, str]] = None,
) -> None:
    """Create necessary files for the app by loading content from templates."""

    file_mappings = {
        "MANIFEST.in": os.path.join(base_path, "MANIFEST.in"),
        ".gitignore": os.path.join(base_path, ".gitignore"),
        "setup.py": os.path.join(base_path, app_name, "setup.py"),
        "hooks.py": os.path.join(base_path, app_name, "hooks.py"),
        "modules.txt": os.path.join(base_path, app_name, "modules.txt"),
        "patches.txt": os.path.join(base_path, app_name, "patches.txt"),
        "__init__.py": os.path.join(base_path, app_name, "__init__.py"),
        "tox.ini": os.path.join(base_path, "tox.ini"),
        ".flake8": os.path.join(base_path, ".flake8"),
        ".editorconfig": os.path.join(base_path, ".editorconfig"),
        "requirements-dev.txt": os.path.join(base_path, "requirements-dev.txt"),
        "pyproject.toml": os.path.join(base_path, "pyproject.toml"),
    }

    default_content = {
        ".gitignore": "__pycache__/\n*.pyc\n*.pyo\n.env\nvenv/\n.DS_Store",
    }

    create_license(base_path, license_type)

    for template_name, destination_path in file_mappings.items():
        template_path = os.path.join(templates_folder, template_name)

        os.makedirs(os.path.dirname(destination_path), exist_ok=True)
        content = default_content.get(template_name, "")

        try:
            with open(template_path, "r") as template_file:
                content = template_file.read()
        except FileNotFoundError:
            pass

        except Exception:
            exc_type, exc_value, exc_tb = sys.exc_info()
            traceback.print_exception(exc_type, exc_value, exc_tb)
            continue

        if dynamic_content and template_name in dynamic_content:
            if template_name == "hooks.py":
                lines = content.splitlines()
                if len(lines) >= 2:
                    lines.insert(2, dynamic_content[template_name])
                    content = "\n".join(lines)
                else:
                    content = dynamic_content[template_name] + "\n" + content
            else:
                content = dynamic_content[template_name] + "\n" + content

        content = content.replace("{{app_name}}", app_name)

        try:
            with open(destination_path, "w") as destination_file:
                destination_file.write(content)
        except Exception:
            exc_type, exc_value, exc_tb = sys.exc_info()
            traceback.print_exception(exc_type, exc_value, exc_tb)
