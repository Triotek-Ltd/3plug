import os
import platform
import re
import subprocess
from getpass import getpass
from typing import Tuple

import click
import pymysql

from ...utils.config import PROJECT_ROOT


def run_django_migrations() -> None:
    """Run Django makemigrations and migrate commands."""
    python_command = "python" if platform.system() == "Windows" else "python3"

    subprocess.run(
        f'echo "y" | {python_command} manage.py makemigrations',
        shell=True,
        cwd=os.path.join(PROJECT_ROOT, "apps/core/django"),
    )

    subprocess.run(
        [python_command, "manage.py", "migrate", "--noinput"],
        cwd=os.path.join(PROJECT_ROOT, "apps/core/django"),
    )

    click.echo("Migration completed.")


def createsuperuser() -> None:
    """Run Django createsuperuser command non-interactively by prompting user for details."""
    run_django_migrations()

    python_command = "python" if platform.system() == "Windows" else "python3"

    create_superuser_args = [python_command, "manage.py", "createsuperuser"]

    subprocess.run(
        create_superuser_args,
        shell=False,
        cwd=os.path.join(PROJECT_ROOT, "apps/core/django"),
        env={
            **os.environ,
        },
    )

    click.echo("Superuser created successfully.")


def install_database() -> bool:
    """Install MariaDB or MySQL depending on the OS."""
    os_name = platform.system().lower()

    print("Checking if MariaDB/MySQL is installed...")
    try:
        subprocess.run(["mysql", "--version"], check=True)
        print("MariaDB/MySQL is already installed.")
    except subprocess.CalledProcessError:
        print("MariaDB/MySQL is not installed. Installing now...")
        if "ubuntu" in os_name or "debian" in os_name:
            subprocess.run(["sudo", "apt", "update"], check=True)
            subprocess.run(
                ["sudo", "apt", "install", "mariadb-server", "-y"], check=True
            )
        else:
            subprocess.run(["sudo", "yum", "install", "mysql-server", "-y"], check=True)

        subprocess.run(
            [
                "sudo",
                "systemctl",
                "start",
                "mariadb" if "ubuntu" in os_name or "debian" in os_name else "mysqld",
            ],
            check=True,
        )
        subprocess.run(
            [
                "sudo",
                "systemctl",
                "enable",
                "mariadb" if "ubuntu" in os_name or "debian" in os_name else "mysqld",
            ],
            check=True,
        )

    return True


def create_database_user() -> Tuple[str, str, str]:
    """Create a new database user or ensure the user exists with all privileges.

    Returns:
        Tuple[str, str, str]: The new user's username, password, and database name.
    """
    root_password = getpass("Enter MySQL/MariaDB root password: ")
    new_user = input("Enter the new username: ")
    new_password = getpass(f"Enter password for {new_user}: ")
    new_db = input("Enter the new database name: ")

    conn = pymysql.connect(user="root", password=root_password, host="localhost")
    cursor = conn.cursor()

    try:
        cursor.execute(
            f"SELECT COUNT(*) FROM mysql.user WHERE user = '{new_user}' AND host = 'localhost';"
        )
        user_exists = cursor.fetchone()[0]

        if user_exists == 0:
            cursor.execute(
                f"CREATE USER '{new_user}'@'localhost' IDENTIFIED BY '{new_password}';"
            )
            print(f"User {new_user} created successfully.")
        else:
            print(f"User {new_user} already exists.")

        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {new_db};")
        cursor.execute(
            f"GRANT ALL PRIVILEGES ON {new_db}.* TO '{new_user}'@'localhost' WITH GRANT OPTION;"
        )
        conn.commit()
        print(f"Privileges granted to user {new_user} for database {new_db}.")
    except pymysql.MySQLError as e:
        print(f"Failed to create user or grant privileges: {e}")
    finally:
        conn.close()

    return new_user, new_password, new_db


def drop_existing_tables(
    db_name: str, user: str, password: str, host: str = "localhost"
) -> None:
    """Drop all tables in the given database.

    Args:
        db_name (str): The name of the database.
        user (str): The database username.
        password (str): The database password.
        host (str, optional): The database host. Defaults to "localhost".
    """
    conn = pymysql.connect(user=user, password=password, host=host, database=db_name)
    cursor = conn.cursor()

    try:
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
        cursor.execute("SHOW TABLES;")
        tables = cursor.fetchall()

        for table in tables:
            cursor.execute(f"DROP TABLE IF EXISTS `{table[0]}`;")
            print(f"Table `{table[0]}` dropped.")

        cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
        conn.commit()
        print(f"All tables in database '{db_name}' have been dropped.")
    except pymysql.MySQLError as e:
        print(f"Failed to drop tables: {e}")
    finally:
        conn.close()


def update_app_settings(
    user: str, password: str, db_name: str, host: str = "localhost"
) -> None:
    """Update settings.py to use MariaDB/MySQL.

    Args:
        user (str): The database username.
        password (str): The database password.
        db_name (str): The name of the database.
        host (str, optional): The database host. Defaults to "localhost".
    """
    settings_file = "apps/core/django/manifold/settings.py"

    with open(settings_file, "r") as file:
        settings_content = file.read()

    pattern = r"\bDATABASES\s*=\s*\{(?:[^{}]|\{[^{}]*\})*\}\s*"
    updated_settings_content = re.sub(
        pattern, "", settings_content, flags=re.DOTALL
    ).strip()

    new_db_settings = f"""
DATABASES = {{
    'default': {{
        'ENGINE': 'django.db.backends.mysql',
        'NAME': '{db_name}',
        'USER': '{user}',
        'PASSWORD': '{password}',
        'HOST': '{host}',
        'PORT': '3306',
    }}
}}
"""

    updated_settings_content += new_db_settings

    with open(settings_file, "w") as file:
        file.write(updated_settings_content)

    print(f"settings.py updated to use MariaDB/MySQL with database '{db_name}'.")


@click.command()
def migratedb(sqlite_db_path: str = None) -> None:
    """Main function to handle the entire migration process.

    Args:
        sqlite_db_path (str, optional): Path to the SQLite database file. Defaults to None.
    """
    install_database()
    user, password, db_name = create_database_user()
    drop_existing_tables(db_name, user, password)
    update_app_settings(user, password, db_name)
    createsuperuser()


if __name__ == "__main__":
    migratedb()
