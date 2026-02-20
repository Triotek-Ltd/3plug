import os
import subprocess
import sys
from typing import List, Optional


def run_subprocess(command: List[str], cwd: Optional[str] = None) -> None:
    """Run a subprocess command within the virtual environment."""
    project_root = cwd or os.getcwd()
    venv_activate = activate_virtualenv(project_root)

    if sys.platform.startswith("win"):
        full_command = f"{venv_activate} && " + " ".join(command)
        subprocess.check_call(["cmd.exe", "/c"] + full_command.split(), cwd=cwd)
    else:
        full_command = f"source {venv_activate} && " + " ".join(command)
        subprocess.check_call(full_command, cwd=cwd, shell=True)


def get_python_executable(project_root: str) -> str:
    """Return the path to the Python executable in the virtual environment."""
    venv_path = os.path.join(project_root, "env")
    if sys.platform.startswith("win"):
        return os.path.join(venv_path, "Scripts", "python.exe")
    return os.path.join(venv_path, "bin", "python")


def activate_virtualenv(project_root: str) -> str:
    """Return the path to the activate script of the virtual environment."""
    if sys.platform.startswith("win"):
        return os.path.join(project_root, "env", "Scripts", "activate")
    return os.path.join(project_root, "env", "bin", "activate")
