import json
import os
import socket
import subprocess
import sys
import threading
import traceback

import click

from ..utils.config import PROJECT_ROOT, get_all_sites, write_running_ports
from ..utils.initialize_django import initialize_django_env
from ..utils.run_process import get_python_executable, run_subprocess


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


@click.command()
@click.argument("mode", default="prod")
def start(mode):
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
        if mode != "prod":
            clear_next_dev_lock(nextjs_path)

        # Determine Next.js command based on mode
        nextjs_command = (
            ["npm", "run", "start"]
            if mode == "prod"
            else ["npm", "run", "dev", "--", "--port", str(nextjs_port)]
        )

        # Start Next.js process
        nextjs_process = run_subprocess(nextjs_command, cwd=nextjs_path)

        # time.sleep(3)
        initialize_django_env()

        django_process = run_subprocess(
            [python_executable, "manage.py", "runserver", f"0.0.0.0:{django_port}"],
            cwd=django_path,
        )

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

        sites = get_all_sites()

        # Generate and display links for all sites
        for site in sites:
            if site:
                click.echo(
                    click.style(
                        f"Open {site} at: http://{site}.localhost:{nextjs_port}\n",
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
