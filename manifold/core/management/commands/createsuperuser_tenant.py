import getpass

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create a superuser for a specific tenant database"

    def add_arguments(self, parser):
        parser.add_argument("tenant", type=str, help="The tenant database name")
        parser.add_argument("--username", type=str, help="Superuser username")
        parser.add_argument("--email", type=str, help="Superuser email")
        parser.add_argument("--password", type=str, help="Superuser password")

    def handle(self, *args, **options):
        tenant_db = options["tenant"]

        if tenant_db not in settings.DATABASES:
            self.stderr.write(
                self.style.ERROR(
                    f"Error: Tenant '{tenant_db}' not found in DATABASES settings."
                )
            )
            return

        self.stdout.write(
            self.style.SUCCESS(f"Creating superuser for tenant database: {tenant_db}")
        )

        User = get_user_model()

        superuser_data = {
            "username": options["username"] or input("Username: "),
            "email": options["email"] or input("Email: "),
            "password": options["password"] or self.get_password_input(),
        }

        if (
            User.objects.db_manager(tenant_db)
            .filter(username=superuser_data["username"])
            .exists()
        ):
            self.stderr.write(
                self.style.WARNING(
                    f"Superuser '{superuser_data['username']}' already exists for tenant '{tenant_db}'."
                )
            )
            return

        User.objects.db_manager(tenant_db).create_superuser(
            username=superuser_data["username"],
            email=superuser_data["email"],
            password=superuser_data["password"],
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Superuser '{superuser_data['username']}' created successfully for tenant '{tenant_db}'"
            )
        )

    def get_password_input(self):
        """Helper method to securely input and confirm the password."""
        while True:
            password = getpass.getpass("Password: ")
            confirm_password = getpass.getpass("Confirm password: ")

            if password != confirm_password:
                self.stderr.write(
                    self.style.ERROR("Passwords do not match. Please try again.")
                )
                continue

            return password
