import os
import subprocess
import sys
import json
import shutil
from typing import Optional

import click

from ..utils.config import PROJECT_ROOT
from ..utils.run_process import get_python_executable, get_venv_path


def _run_command(command: list[str], cwd: Optional[str] = None) -> None:
    if sys.platform.startswith("win"):
        subprocess.check_call(["cmd.exe", "/c"] + command, cwd=cwd)
    else:
        subprocess.check_call(command, cwd=cwd)


def _run_command_capture(command: list[str], cwd: Optional[str] = None) -> subprocess.CompletedProcess:
    if sys.platform.startswith("win"):
        return subprocess.run(["cmd.exe", "/c"] + command, cwd=cwd, capture_output=True, text=True)
    return subprocess.run(command, cwd=cwd, capture_output=True, text=True)


def _ensure_virtualenv() -> str:
    venv_path = get_venv_path()
    if venv_path:
        return venv_path

    venv_path = os.path.join(PROJECT_ROOT, "env")
    click.echo("Creating virtual environment at 'env'...")
    _run_command([sys.executable, "-m", "venv", "env"], cwd=PROJECT_ROOT)
    return venv_path


def _ensure_runtime_structure() -> None:
    for dirname in ("sites", "logs", "config"):
        os.makedirs(os.path.join(PROJECT_ROOT, dirname), exist_ok=True)

    common_site_config = os.path.join(PROJECT_ROOT, "sites", "common_site_config.json")
    if not os.path.exists(common_site_config):
        with open(common_site_config, "w", encoding="utf-8") as f:
            json.dump({}, f, indent=2)


def _read_package_json() -> dict:
    package_json = os.path.join(PROJECT_ROOT, "package.json")
    if not os.path.exists(package_json):
        return {}
    with open(package_json, "r", encoding="utf-8") as f:
        return json.load(f)


def _get_node_major_version() -> Optional[int]:
    try:
        result = _run_command_capture(["node", "--version"], cwd=PROJECT_ROOT)
        if result.returncode != 0:
            return None
        version = (result.stdout or "").strip().lstrip("v")
        return int(version.split(".", 1)[0])
    except Exception:
        return None


def _command_exists(command: str) -> bool:
    return shutil.which(command) is not None


def _warn_windows_canvas_prereqs() -> None:
    if not sys.platform.startswith("win"):
        return

    package_data = _read_package_json()
    dependencies = package_data.get("dependencies", {})
    if "canvas" not in dependencies:
        return

    node_major = _get_node_major_version()
    gtk_bin = r"C:\GTK\bin"
    likely_missing_gtk = not os.path.isdir(gtk_bin)

    if node_major and node_major >= 24:
        click.echo(
            click.style(
                "Warning: Node 24+ may not have a prebuilt binary for 'canvas' and can force a local build on Windows.",
                fg="yellow",
            )
        )
        click.echo("If npm fails on 'canvas', use Node 20/22 LTS or install GTK/Cairo build dependencies.")

    if likely_missing_gtk:
        click.echo(
            click.style(
                "Windows canvas prerequisite check: 'C:\\GTK\\bin' not found. "
                "If npm fails on 'canvas', install GTK/Cairo runtime + headers first.",
                fg="yellow",
            )
        )


def _install_native_prereqs(install_native_prereqs: bool = False) -> None:
    package_data = _read_package_json()
    dependencies = package_data.get("dependencies", {})
    if "canvas" not in dependencies:
        return

    if not install_native_prereqs:
        _warn_windows_canvas_prereqs()
        return

    click.echo("Checking/installing native prerequisites for Node packages...")

    if sys.platform.startswith("win"):
        # Best-effort Windows support. The project currently fails on canvas when GTK/Cairo is missing.
        if _command_exists("choco"):
            click.echo("Installing Windows GTK runtime via Chocolatey (required by canvas)...")
            _run_command(["choco", "install", "gtk-runtime", "-y"], cwd=PROJECT_ROOT)
        else:
            raise click.ClickException(
                "Windows native prereq auto-install requires Chocolatey (choco) for now. "
                "Install Chocolatey or manually install GTK/Cairo (C:\\GTK) and rerun."
            )
        return

    if sys.platform == "darwin":
        if not _command_exists("brew"):
            raise click.ClickException(
                "macOS native prereq auto-install requires Homebrew. Install brew or install canvas prerequisites manually."
            )
        _run_command(
            ["brew", "install", "pkg-config", "cairo", "pango", "libpng", "jpeg", "giflib", "librsvg"],
            cwd=PROJECT_ROOT,
        )
        return

    # Linux variants (best-effort by package manager detection)
    if _command_exists("apt-get"):
        _run_command(["sudo", "apt-get", "update"], cwd=PROJECT_ROOT)
        _run_command(
            [
                "sudo",
                "apt-get",
                "install",
                "-y",
                "pkg-config",
                "libcairo2-dev",
                "libpango1.0-dev",
                "libjpeg-dev",
                "libgif-dev",
                "librsvg2-dev",
            ],
            cwd=PROJECT_ROOT,
        )
        return

    if _command_exists("dnf"):
        _run_command(
            [
                "sudo",
                "dnf",
                "install",
                "-y",
                "pkgconf-pkg-config",
                "cairo-devel",
                "pango-devel",
                "libjpeg-turbo-devel",
                "giflib-devel",
                "librsvg2-devel",
            ],
            cwd=PROJECT_ROOT,
        )
        return

    if _command_exists("pacman"):
        _run_command(
            [
                "sudo",
                "pacman",
                "-S",
                "--noconfirm",
                "pkgconf",
                "cairo",
                "pango",
                "libjpeg-turbo",
                "giflib",
                "librsvg",
            ],
            cwd=PROJECT_ROOT,
        )
        return

    raise click.ClickException(
        "Unsupported OS/package manager for native prereq auto-install. "
        "Install canvas system dependencies manually, then rerun setup."
    )


def _node_modules_ready() -> bool:
    node_modules = os.path.join(PROJECT_ROOT, "node_modules")
    package_lock = os.path.join(PROJECT_ROOT, "package-lock.json")
    if not (os.path.isdir(node_modules) and os.path.exists(package_lock)):
        return False

    result = _run_command_capture(["npm", "ls", "--depth=0"], cwd=PROJECT_ROOT)
    return result.returncode == 0


def _install_node_dependencies(install_native_prereqs: bool = False) -> None:
    if _node_modules_ready():
        click.echo("Node dependencies already installed and valid. Skipping npm install.")
        return

    _install_native_prereqs(install_native_prereqs=install_native_prereqs)
    click.echo("Installing Node dependencies...")
    _run_command(["npm", "install"], cwd=PROJECT_ROOT)


@click.command()
@click.option(
    "--with-superuser/--no-superuser",
    default=True,
    show_default=True,
    help="Run Django createsuperuser at the end of setup.",
)
@click.option(
    "--install-native-prereqs",
    is_flag=True,
    help="Attempt to auto-install OS-level native prerequisites needed by some npm packages (e.g., canvas).",
)
def setup(with_superuser: bool, install_native_prereqs: bool) -> None:
    """One-shot first-time project setup."""
    run_setup(
        with_superuser=with_superuser,
        install_native_prereqs=install_native_prereqs,
    )


def run_setup(with_superuser: bool = True, install_native_prereqs: bool = False) -> None:
    """Shared implementation for first-time project setup."""
    click.echo("Starting 3plug setup...")

    if not os.path.exists(os.path.join(PROJECT_ROOT, "manifold", "manage.py")):
        click.echo(
            click.style(
                "Django project not found at 'manifold/manage.py'. Setup aborted.",
                fg="red",
            )
        )
        return

    _ensure_virtualenv()
    _ensure_runtime_structure()
    python_executable = get_python_executable()
    if not python_executable:
        return

    click.echo("Upgrading pip...")
    _run_command([python_executable, "-m", "pip", "install", "--upgrade", "pip"])

    click.echo("Installing required Python package: env...")
    _run_command([python_executable, "-m", "pip", "install", "env"])

    click.echo("Installing Python dependencies (editable)...")
    _run_command([python_executable, "-m", "pip", "install", "-e", "."], cwd=PROJECT_ROOT)

    _install_node_dependencies(install_native_prereqs=install_native_prereqs)

    click.echo("Running Django migrations...")
    _run_command([python_executable, "manage.py", "migrate", "--noinput"], cwd=os.path.join(PROJECT_ROOT, "manifold"))

    if with_superuser:
        click.echo("Creating Django superuser...")
        _run_command([python_executable, "manage.py", "createsuperuser"], cwd=os.path.join(PROJECT_ROOT, "manifold"))

    click.echo(click.style("Setup completed successfully.", fg="green"))
