import os
import subprocess
import sys
import click
import socket
import re
from typing import List, Dict, Optional
from pathlib import Path

# Constants
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
NGINX_AVAILABLE_DIR = "/etc/nginx/sites-available"
NGINX_ENABLED_DIR = "/etc/nginx/sites-enabled"
SUPERVISOR_CONF_DIR = "/etc/supervisor/conf.d"

# Track changes for rollback
changes = {
    "nginx_configs": [],
    "supervisor_configs": [],
    "ssl_certificates": [],
}

def find_free_port(start_port: int = 3000) -> int:
    """
    Find a free port starting from the given start_port.

    Args:
        start_port (int): The port number to start searching from.

    Returns:
        int: A free port number.
    """
    port = start_port
    while True:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            if sock.connect_ex(("localhost", port)) != 0:
                return port
            port += 1

def run_with_sudo(command: List[str]) -> None:
    """
    Run a command with sudo privileges.

    Args:
        command (List[str]): The command to run with sudo.
    """
    subprocess.run(command, check=True)

def check_dependencies() -> None:
    """
    Check if all required packages (nginx, supervisor, certbot, python3-certbot-nginx) are installed.
    If not, prompt the user to install them.
    """
    required_packages = [
        "nginx",                  # Nginx web server
        "supervisor",             # Supervisor process manager
        "certbot",                # Let's Encrypt client
        "python3-certbot-nginx",  # Certbot plugin for Nginx
    ]
    missing_packages = []

    for package in required_packages:
        try:
            subprocess.run(["which", package], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        except subprocess.CalledProcessError:
            missing_packages.append(package)

    if missing_packages:
        click.echo(f"The following packages are missing: {', '.join(missing_packages)}")
        if click.confirm("Do you want to install them now?"):
            run_with_sudo(["apt", "update"])
            run_with_sudo(["apt", "install", "-y"] + missing_packages)
        # else:
        #     click.echo("Exiting because required packages are missing.")
        #     sys.exit(1)

def rollback() -> None:
    """
    Rollback all changes made during the deployment process.
    """
    click.echo("Rolling back changes due to an error...")

    # Remove Nginx configurations
    for config in changes["nginx_configs"]:
        if os.path.exists(config):
            run_with_sudo(["rm", "-f", config])
            click.echo(f"Removed Nginx config: {config}")

    # Remove Supervisor configurations
    for config in changes["supervisor_configs"]:
        if os.path.exists(config):
            run_with_sudo(["rm", "-f", config])
            click.echo(f"Removed Supervisor config: {config}")

    # Remove SSL certificates
    for domain in changes["ssl_certificates"]:
        run_with_sudo(["certbot", "delete", "--cert-name", domain])
        click.echo(f"Removed SSL certificate for: {domain}")

    click.echo("Rollback complete.")

def get_ports_from_supervisor_conf(project_name: str) -> Dict[str, int]:
    """
    Retrieve Django and Next.js ports from the Supervisor configuration file.

    Args:
        project_name (str): The name of the project.

    Returns:
        Dict[str, int]: A dictionary containing the Django and Next.js ports.
    """
    conf_path = os.path.join(SUPERVISOR_CONF_DIR, f"{project_name}.conf")
    if not os.path.exists(conf_path):
        raise FileNotFoundError(f"Supervisor configuration file for {project_name} not found.")

    ports = {}
    with open(conf_path, "r") as file:
        content = file.read()

        # Extract Django port
        django_match = re.search(r"command=.+runserver 0\.0\.0\.0:(\d+)", content)
        if django_match:
            ports["django_port"] = int(django_match.group(1))

        # Extract Next.js port
        nextjs_match = re.search(r"command=.+--port (\d+)", content)
        if nextjs_match:
            ports["nextjs_port"] = int(nextjs_match.group(1))

    if not ports:
        raise ValueError(f"Could not find ports in Supervisor configuration for {project_name}.")

    return ports

def setup_nginx(sitename: str, main_domain: str, additional_domains: List[str], nextjs_port: int, django_port: int) -> None:
    """
    Set up Nginx configuration for the given site.

    Args:
        sitename (str): The name of the site.
        main_domain (str): The main domain for the site.
        additional_domains (List[str]): Additional domains for the site.
        nextjs_port (int): The port number for the Next.js application.
        django_port (int): The port number for the Django application.
    """
    # Combine main domain and additional domains
    server_names = [main_domain] + additional_domains
    server_names_str = " ".join(server_names)

    nginx_conf = f"""
    server {{
        listen 80;
        server_name {server_names_str};

        location / {{
            proxy_pass http://127.0.0.1:{nextjs_port};
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }}

        location /apis/ {{
            proxy_pass http://127.0.0.1:{django_port};
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }}

        location /static/ {{
            alias /path/to/your/static/files/;
        }}
    }}
    """

    conf_path = os.path.join(NGINX_AVAILABLE_DIR, sitename)
    symlink_path = os.path.join(NGINX_ENABLED_DIR, sitename)

    # Write the configuration to /etc/nginx/sites-available with sudo
    with open(conf_path, "w") as file:
        file.write(nginx_conf)

    # Create symlink in /etc/nginx/sites-enabled with sudo
    run_with_sudo(["ln", "-sf", conf_path, symlink_path])
    run_with_sudo(["nginx", "-t"])
    run_with_sudo(["systemctl", "reload", "nginx"])

    # Track changes for rollback
    changes["nginx_configs"].append(conf_path)
    changes["nginx_configs"].append(symlink_path)

    click.echo(f"Nginx configuration for {sitename} has been set up and reloaded.")

def setup_supervisor(project_name: str, django_port: int, nextjs_port: int) -> None:
    """
    Set up Supervisor configuration for the project.

    Args:
        project_name (str): The name of the project.
        django_port (int): The port number for the Django application.
        nextjs_port (int): The port number for the Next.js application.
    """
    # Create logs directory if it doesn't exist
    logs_dir = os.path.join(PROJECT_ROOT, "logs")
    os.makedirs(logs_dir, exist_ok=True)

    # Log files
    django_log = os.path.join(logs_dir, f"{project_name}_django.log")
    nextjs_log = os.path.join(logs_dir, f"{project_name}_nextjs.log")

    # Prompt for the username
    username = click.prompt(
        "Enter the username to run the Supervisor process", type=str
    )

    venv_path = os.path.join(PROJECT_ROOT, "env")
    python_executable = os.path.join(venv_path, "bin", "python3")
    if sys.platform.startswith("win"):
        python_executable = os.path.join(venv_path, "Scripts", "python.exe")

    supervisor_conf = f"""
    [program:{project_name}_django]
    command={python_executable} manage.py runserver 0.0.0.0:{django_port}
    directory={PROJECT_ROOT}/manifold
    autostart=true
    autorestart=true
    stderr_logfile={django_log}
    stdout_logfile={django_log}
    user={username}
    
    [program:{project_name}_nextjs]
    command=npm run start -- --port {nextjs_port}
    directory={PROJECT_ROOT}/
    autostart=true
    autorestart=true
    stderr_logfile={nextjs_log}
    stdout_logfile={nextjs_log}
    user={username}
    """

    conf_path = os.path.join(SUPERVISOR_CONF_DIR, f"{project_name}.conf")

    # Write the configuration to /etc/supervisor/conf.d with sudo
    with open(conf_path, "w") as file:
        file.write(supervisor_conf)

    # Update Supervisor configurations and start the app with sudo
    run_with_sudo(["supervisorctl", "reread"])
    run_with_sudo(["supervisorctl", "update"])
    run_with_sudo(["supervisorctl", "start", f"{project_name}_django"])
    run_with_sudo(["supervisorctl", "start", f"{project_name}_nextjs"])

    # Track changes for rollback
    changes["supervisor_configs"].append(conf_path)

    click.echo(f"Supervisor configuration for {project_name} has been set up and started.")

def setup_ssl(domain: str) -> None:
    """
    Set up SSL using Let's Encrypt for the given domain.

    Args:
        domain (str): The domain name.
    """
    click.echo("Setting up SSL with Let's Encrypt...")
    # Using sudo to install SSL certificates
    run_with_sudo(["certbot", "--nginx", "-d", domain])
    click.echo(f"SSL certificate for {domain} has been set up.")

    # Track changes for rollback
    changes["ssl_certificates"].append(domain)

@click.group()
def cli():
    """CLI for deploying and setting up sites."""
    pass

@cli.command()
@click.option("--project-name", prompt="Enter the project name", help="Name of the project.")
def deploy(project_name: str):
    """
    Deploy the project using Supervisor.
    """
    try:
        check_dependencies()
        django_port = find_free_port(8000)
        nextjs_port = find_free_port(3000)

        setup_supervisor(project_name, django_port, nextjs_port)
        click.echo(f"Project {project_name} has been deployed and is running on ports Django: {django_port}, Next.js: {nextjs_port}.")
    except Exception as e:
        click.echo(f"Error during deployment: {e}")
        rollback()

@cli.command()
@click.option("--sitename", prompt="Enter the site name", help="Name of the site.")
@click.option("--main-domain", prompt="Enter the main domain", help="Main domain for the site.")
@click.option("--additional-domains", default="", help="Additional domains (comma-separated).")
@click.option("--project-name", prompt="Enter the project name", help="Name of the project.")
def setup_site(sitename: str, main_domain: str, additional_domains: str, project_name: str):
    """
    Set up Nginx configuration for a site using ports from Supervisor.
    """
    try:
        check_dependencies()
        # Parse additional domains
        additional_domains_list = [d.strip() for d in additional_domains.split(",")] if additional_domains else []

        # Retrieve ports from Supervisor configuration
        ports = get_ports_from_supervisor_conf(project_name)
        django_port = ports["django_port"]
        nextjs_port = ports["nextjs_port"]

        setup_nginx(sitename, main_domain, additional_domains_list, nextjs_port, django_port)
        setup_ssl(main_domain)
        click.echo(f"Site {sitename} has been set up with Nginx and SSL.")
    except Exception as e:
        click.echo(f"Error during site setup: {e}")
        rollback()
