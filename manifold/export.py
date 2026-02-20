import csv
import sqlite3

# Connect to SQLite database
conn = sqlite3.connect("masafa.sqlite3")
cursor = conn.cursor()

# Read CSV file
with open("user.csv", "r") as file:
    csv_reader = csv.reader(file)

    # Extract column names from the first row (header)
    columns = next(csv_reader)

    # Create a dynamic SQL query
    placeholders = ", ".join(["?" for _ in columns])  # Generate ?,?,?
    query = f"INSERT INTO core_user ({', '.join(columns)}) VALUES ({placeholders})"

    # Insert each row into the database
    for row in csv_reader:
        cursor.execute(query, row)

# Commit and close connection
conn.commit()
conn.close()

print("Users imported successfully!")
