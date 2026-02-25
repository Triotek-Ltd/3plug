import json
import os
import socket
import subprocess
import sys
import threading
import traceback
from typing import List, Optional, Tuple

import click

from ..utils.config import PROJECT_ROOT, get_all_sites, get_site_config, write_running_ports
from ..utils.default_site import get_default_site_info
from ..utils.initialize_django import initialize_django_env
from ..utils.run_process import get_python_executable, run_subprocess
from ..sites.use import set_default_site


def find_free_port(start_port=3000):
    port = start_port
    while True:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            if sock.connect_ex(("localhost", port)) != 0:
                return port
            port += 1


def stream_reader(stream, color, prefix="", first_line_only=False):
    """Reads from a stream and prints lines with a given color and optional prefix."""
    first_line = True
    for line in iter(stream.readline, ""):
        if line:
            line = line.strip()
            if first_line_only:
                if first_line:
                    click.echo(click.style(prefix, fg="red"), nl=False)
                    first_line = False
            if line:
                click.echo(click.style(f"{line}", fg=color))


def clear_next_dev_lock(nextjs_path):
    """Remove stale Next.js dev lock so restarts don't fail."""
    lock_path = os.path.join(nextjs_path, ".next", "dev", "lock")
    if os.path.exists(lock_path):
        try:
            os.remove(lock_path)
            click.echo(click.style("Removed stale Next.js dev lock.", fg="yellow"))
        except OSError:
            pass


def build_site_url(site: str, mode: str, nextjs_port: int) -> str:
    if mode != "prod":
        return f"http://localhost:{nextjs_port}"

    site_config = get_site_config(site) or {}
    domains = site_config.get("domains", []) if isinstance(site_config, dict) else []
    host = domains[0] if domains else f"{site}.localhost"
    protocol = "https"

    if ":" in host:
        return f"{protocol}://{host}"
    return f"{protocol}://{host}"


def _get_current_default_site() -> Optional[str]:
    return get_default_site_info(PROJECT_ROOT)


def _prompt_for_site_choice(sites: List[str]) -> Tuple[Optional[str], bool]:
    if not sites:
        raise click.ClickException("No sites available. Create a site first.")

    click.echo("Select site to start:")
    for idx, site in enumerate(sites, start=1):
        click.echo(f"{idx}. {site}")
    click.echo(f"{len(sites) + 1}. all")

    choice = click.prompt("Enter choice number", type=int)
    if choice == len(sites) + 1:
        return None, True
    if 1 <= choice <= len(sites):
        return sites[choice - 1], False
    raise click.ClickException("Invalid site selection.")


@click.command()
@click.argument("mode", default="prod")
@click.option("--site", "site_name", default=None, help="Start with a specific site as default.")
@click.option("--all-sites", is_flag=True, help="Keep current default and show all available site URLs.")
def start(mode, site_name, all_sites):
    """Start Django and Next.js servers for the specified site."""
    click.echo("Starting server")

    # Create Django and Next.js paths
    django_path = os.path.join(PROJECT_ROOT, "manifold")
    nextjs_path = os.path.join(PROJECT_ROOT)

    python_executable = get_python_executable()
    if not python_executable:
        return

    django_port = find_free_port(8000)
    nextjs_port = find_free_port(3000)

    django_process = None
    nextjs_process = None

    try:
        sites = get_all_sites()
        selected_site = None

        if site_name and site_name not in sites:
            raise click.ClickException(f"Site '{site_name}' was not found.")

        if not all_sites:
            if site_name:
                selected_site = site_name
            elif mode != "prod":
                # In dev mode prefer configured default site (expected to be dev-site after setup-dev-env).
                current_default = _get_current_default_site()
                if current_default and current_default in sites:
                    selected_site = current_default
                elif "dev-site" in sites:
                    selected_site = "dev-site"
            else:
                selected_site, all_sites = _prompt_for_site_choice(sites)

        if selected_site and not all_sites:
            click.echo(f"Using site '{selected_site}' as default for this start session.")
            set_default_site(selected_site)

        if mode != "prod":
            clear_next_dev_lock(nextjs_path)

        # Determine Next.js command based on mode
        nextjs_command = (
            ["npm", "run", "start"]
            if mode == "prod"
            else ["npm", "run", "dev", "--", "--port", str(nextjs_port)]
        )

        initialize_django_env()

        startup_errors = []
        process_holder = {"django": None, "nextjs": None}

        def launch_django():
            try:
                process_holder["django"] = run_subprocess(
                    [python_executable, "manage.py", "runserver", f"0.0.0.0:{django_port}"],
                    cwd=django_path,
                )
            except Exception as launch_error:
                startup_errors.append(("django", launch_error))

        def launch_nextjs():
            try:
                process_holder["nextjs"] = run_subprocess(nextjs_command, cwd=nextjs_path)
            except Exception as launch_error:
                startup_errors.append(("nextjs", launch_error))

        django_launch_thread = threading.Thread(target=launch_django)
        nextjs_launch_thread = threading.Thread(target=launch_nextjs)

        django_launch_thread.start()
        nextjs_launch_thread.start()
        django_launch_thread.join()
        nextjs_launch_thread.join()

        if startup_errors:
            service, launch_error = startup_errors[0]
            raise RuntimeError(f"Failed to start {service}: {launch_error}")

        django_process = process_holder["django"]
        nextjs_process = process_holder["nextjs"]

        if not django_process or not nextjs_process:
            raise RuntimeError("Failed to start Django and Next.js processes.")

        write_running_ports(django_port, nextjs_port)

        # Start threads to read stdout and stderr from both processes
        django_stdout_thread = threading.Thread(
            target=stream_reader, args=(django_process.stdout, "white")
        )
        django_stderr_thread = threading.Thread(
            target=stream_reader,
            args=(django_process.stderr, "bright_black", "Django warning: ", True),
        )
        nextjs_stdout_thread = threading.Thread(
            target=stream_reader, args=(nextjs_process.stdout, "white")
        )
        nextjs_stderr_thread = threading.Thread(
            target=stream_reader,
            args=(nextjs_process.stderr, "bright_black", "Next.js warning: ", True),
        )

        nextjs_stdout_thread.start()
        nextjs_stderr_thread.start()
        django_stdout_thread.start()
        django_stderr_thread.start()

        # Generate and display links for selected site(s)
        visible_sites = sites if all_sites or not selected_site else [selected_site]
        for site in visible_sites:
            if site:
                click.echo(
                    click.style(
                        f"Open {site} at: {build_site_url(site, mode, nextjs_port)}\n",
                        fg="green",
                    )
                )

        try:
            django_process.wait()
            nextjs_process.wait()
        except KeyboardInterrupt:
            click.echo("Stopping 3plug...")
            if django_process:
                django_process.terminate()
                try:
                    django_process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    django_process.kill()
            if nextjs_process:
                nextjs_process.terminate()
                try:
                    nextjs_process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    nextjs_process.kill()
            django_stdout_thread.join()
            django_stderr_thread.join()
            nextjs_stdout_thread.join()
            nextjs_stderr_thread.join()

    except Exception as e:
        click.echo(click.style(f"Exception: {str(e)}", fg="red"))
        exc_type, exc_value, exc_tb = sys.exc_info()
        traceback.print_exception(exc_type, exc_value, exc_tb)

    finally:
        if django_process and django_process.poll() is None:
            django_process.terminate()
            try:
                django_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                django_process.kill()
        if nextjs_process and nextjs_process.poll() is None:
            nextjs_process.terminate()
            try:
                nextjs_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                nextjs_process.kill()
        if mode != "prod":
            clear_next_dev_lock(nextjs_path)
