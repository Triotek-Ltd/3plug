# import os
# import pymysql
# import sqlite3
# import click
# import importlib.util
# import getpass
# import json
# import subprocess

# from datetime import datetime
# from django.utils.dateparse import parse_datetime
# import pytz


# from ...config import SETTINGS_PATH, DB_PATH, JSON_FILE_PATH,BASE_PATH
# def load_settings():
#     """Load settings from the Python module."""
#     spec = importlib.util.spec_from_file_location("settings", SETTINGS_PATH)
#     settings_module = importlib.util.module_from_spec(spec)
#     spec.loader.exec_module(settings_module)
#     return settings_module.DATABASES

# def convert_sqlite_type(sqlite_type, column_length):
#     """Convert SQLite type to MySQL/MariaDB type with appropriate length."""
#     if sqlite_type.startswith("INTEGER"):
#         return "BIGINT"
#     elif sqlite_type.startswith("TEXT"):
#         return f"VARCHAR({column_length})" if column_length else "TEXT"
#     elif sqlite_type.startswith("REAL"):
#         return "DOUBLE"
#     elif sqlite_type.startswith("BLOB"):
#         return "BLOB"
#     else:
#         return sqlite_type


# def add_foreign_keys(cursor, table_name, foreign_keys):
#     """Add foreign keys after table creation."""
#     for fk_query in foreign_keys:
#         add_fk_query = f"ALTER TABLE `{table_name}` ADD {fk_query}"
#         try:
#             cursor.execute(add_fk_query)
#         except pymysql.MySQLError as e:
#             print(f"Failed to add foreign key to `{table_name}`: {e}")


# def iso_format_datetime(dt):
#     # If dt is a string, try to parse it into a datetime object
#     if isinstance(dt, str):
#         try:
#             if len(dt) > 10:  # A full datetime string is longer than 10 characters
#                 dt = datetime.fromisoformat(dt)
#             else:
#                 # If it's just a date, skip conversion and return as-is
#                 return dt
#         except ValueError:
#             # If parsing fails, return the string as-is
#             return dt

#     # Now that dt is a datetime object, check if it's naive or timezone-aware
#     if isinstance(dt, datetime):
#         if dt.tzinfo is None:
#             # Make naive datetime timezone-aware, assuming UTC
#             dt = pytz.utc.localize(dt)
#         return dt.isoformat()

#     # Return the value unchanged if it's not a datetime object
#     return dt


# def migrate_sqlite_to_db(sqlite_db_path, db_conn, db_name):
#     """Migrate data from SQLite to MariaDB/MySQL."""
#     cursor = db_conn.cursor()
#     cursor.execute(f"USE `{db_name}`")
#     cursor.execute("SHOW TABLES")
#     mysqltables = cursor.fetchall()

#     sqlite_conn = sqlite3.connect(sqlite_db_path)
#     sqlite_cursor = sqlite_conn.cursor()

#     sqlite_cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
#     tables = sqlite_cursor.fetchall()
#     data = []

#     for table in mysqltables:
#         table_name = table[0]

#         if table_name == "sqlite_sequence" or table_name.startswith(('django', 'auth', 'admin')):
#             continue

#         sqlite_cursor.execute(f"PRAGMA table_info({table_name});")
#         columns = [col[1] for col in sqlite_cursor.fetchall()]

#         sqlite_cursor.execute(f"SELECT * FROM {table_name}")
#         rows = sqlite_cursor.fetchall()

#         for row in rows:
#             row_data = dict(zip(columns, row))
#             # Convert datetime fields to ISO 8601 format
#             for key, value in row_data.items():
#                 try:
#                     datetime.fromisoformat(value)
#                     row_data[key] = iso_format_datetime(value)
#                     # pass
#                 except:
#                     pass
#             data.append({
#                 "model": f"{table_name.lower().replace('_', '.', 1)}",

#                 "pk": row_data.get("id"),  # assuming `id` is the primary key
#                 "fields": row_data
#             })

#     with open(JSON_FILE_PATH, 'w') as json_file:
#         json.dump(data, json_file, indent=4)


# def restore_data_to_db():
#     """Restore data from JSON file to the Django-managed database."""
#     print("Restoring data to Django-managed database...")

#     # Define the working directory for subprocesses
#     cwd = BASE_PATH

#     # Flush the current database
#     try:
#         subprocess.run(["python3", "manage.py", "flush", "--no-input"], cwd=cwd, check=True)
#     except subprocess.CalledProcessError as e:
#         print(f"Error occurred while flushing the database: {e}")
#         raise

#     # Load data from JSON file into the Django-managed database
#     try:
#         subprocess.run(["python3", "manage.py", "loaddata", JSON_FILE_PATH], cwd=cwd, check=True)
#     except subprocess.CalledProcessError as e:
#         print(f"Error occurred while loading data into the database: {e}")
#         raise

#     print("Restoration completed.")
# @click.command()
# def restoredb():
#     """Main function to handle the entire migration process."""
#     settings = load_settings()  # Load settings from the Python module
#     db_settings = settings['default']  # Retrieve DB settings from settings

#     # Prompt the user to confirm the password
#     password = getpass.getpass("Enter database password: ")

#     # SQLite database path inside apps/core/django
#     sqlite_db_path = os.path.join('apps/core/django', 'db.sqlite3')

#     # Connect to MySQL/MariaDB
#     db_conn = pymysql.connect(
#         user=db_settings['USER'],
#         password=password,
#         host=db_settings['HOST'],
#         port=int(db_settings['PORT'])  # Convert PORT to integer
#     )

#     # Migrate SQLite to MySQL/MariaDB
#     migrate_sqlite_to_db(DB_PATH, db_conn, db_settings['NAME'])

#     db_conn.close()

#     restore_data_to_db()


# if __name__ == "__main__":
#     restoredb()
