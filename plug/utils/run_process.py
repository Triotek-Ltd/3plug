import os
import subprocess
import sys
from typing import Optional

import click

from .config import PROJECT_ROOT


def get_venv_path() -> Optional[str]:
    """Return the preferred virtual environment path for this project."""
    candidates = [
        os.path.join(PROJECT_ROOT, "env"),
        os.path.join(PROJECT_ROOT, ".venv"),
    ]
    for candidate in candidates:
        if os.path.exists(candidate):
            return candidate
    return None


def get_python_executable() -> Optional[str]:
    venv_path = get_venv_path()
    if not venv_path:
        click.echo("Virtual environment not found. Please run '3plug setup' first.")
        return None

    python_executable = os.path.join(venv_path, "bin", "python3")
    if sys.platform.startswith("win"):
        python_executable = os.path.join(venv_path, "Scripts", "python.exe")
    return python_executable


def run_subprocess(command: list[str], cwd: Optional[str] = None) -> subprocess.Popen:
    """Run a subprocess command, using cmd.exe on Windows."""
    if sys.platform.startswith("win"):
        return subprocess.Popen(
            ["cmd.exe", "/c"] + command,
            cwd=cwd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
    return subprocess.Popen(
        command, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
    )
