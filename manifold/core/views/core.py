import os
import subprocess
import threading

from core.filters import (
    AppFilter,
    BranchFilter,
    ChangeLogFilter,
    DocumentFilter,
    ModuleFilter,
    PrintFormatFilter,
    RoleFilter,
)
from core.models import App, ChangeLog, Document, Module, PrintFormat
from core.models.auth import Branch, RoleType
from core.permissions import HasGroupPermission
from core.serializers import (
    AppSerializer,
    BranchSerializer,
    ChangeLogSerializer,
    DocumentSerializer,
    ModuleSerializer,
    PrintFormatSerializer,
    RoleSerializer,
)
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .template import GenericViewSet, handle_errors

# from apps.masafa.masafa.masafa.doctype.customer.customer import Customer as CustomCustomer


class RoleViewSet(GenericViewSet):
    queryset = RoleType.objects.all()
    filterset_class = RoleFilter
    permission_classes = [HasGroupPermission]
    serializer_class = RoleSerializer


class BranchViewSet(GenericViewSet):
    queryset = Branch.objects.all()
    filterset_class = BranchFilter
    permission_classes = [HasGroupPermission]
    serializer_class = BranchSerializer


def run_subprocess(command, success_message, error_message):
    try:
        # Check if running on Windows
        if os.name == "nt":
            # For Windows, use PowerShell to pipe the 'y' response
            full_command = f'echo y | {" ".join(command)}'
        else:
            # For Unix-based systems, use bash-style piping
            full_command = f'echo y | {" ".join(command)}'

        # Run the command with 'shell=True' to enable piping
        subprocess.run(full_command, check=True, shell=True)

        return Response({"message": success_message}, status=status.HTTP_200_OK)
    except subprocess.CalledProcessError:
        return Response(
            {"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class ChangeLogViewSet(GenericViewSet):
    queryset = ChangeLog.objects.all()
    serializer_class = ChangeLogSerializer
    filterset_class = ChangeLogFilter


class CreateAppAPIView(APIView):
    @handle_errors
    def post(self, request, *args, **kwargs):
        # Validate required parameters
        appname = request.data.get("appname")
        if not appname:
            return Response(
                {"error": "Missing 'appname' parameter"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Fetch the App instance from the database
        try:
            app = App.objects.get(id=appname)
        except App.DoesNotExist:
            return Response(
                {"error": f"App with name '{appname}' does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Collect the data from the App instance
        options = {
            "--title": app.name,
            "--description": app.description
            or "This is a plug app.",  # Default if null
            "--publisher": app.publisher or "Triotek Ltd",  # Default if null
            "--email": app.email or "contact@example.io",  # Default if null
            "--license": app.license or "MIT",  # Default if null
        }

        # Build the command with appname and options
        # Wrap option values in quotes if they contain spaces
        command = ["3plug", "new-app", appname] + [
            f'{key} "{value}"' if " " in value else f"{key} {value}"
            for key, value in options.items()
        ]

        # Log the command for debugging (Optional: Remove in production)
        print(f"Executing command: {' '.join(command)}")

        # Run the command using the run_subprocess utility
        return run_subprocess(
            command,
            success_message="App created successfully",
            error_message="Failed to create app",
        )


class AppViewSet(GenericViewSet):
    queryset = App.objects.all()
    serializer_class = AppSerializer
    filterset_class = AppFilter

    @handle_errors
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        app = App.objects.get(pk=serializer.data["id"])
        module_data = {
            "name": request.data.get("name"),
            "description": request.data.get("description"),
            "status": request.data.get("status"),
        }

        # Create the Module with the filtered data
        Module.objects.create(**module_data, app=app)

        response_data = serializer.data

        headers = self.get_success_headers(serializer.data)
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)

    @handle_errors
    def destroy(self, request, *args, **kwargs):
        app_name = self.get_object().id
        if not app_name:
            return Response(
                {"error": "Missing app name"}, status=status.HTTP_400_BAD_REQUEST
            )

        self.get_object().delete()
        return run_subprocess(
            ["3plug", "drop-app", "--app", app_name],
            "App deleted successfully",
            "Failed to delete app",
        )


class CreateModuleAPIView(APIView):
    @handle_errors
    def post(self, request, *args, **kwargs):
        name = request.data.get("name")
        if not name:
            return Response(
                {"error": "Missing 'name' parameter"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        module = Module.objects.get(pk=name)
        return run_subprocess(
            ["3plug", "new-module", module.app.id, module.name],
            "Module created successfully",
            "Failed to create module",
        )


class ModuleViewSet(GenericViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    filterset_class = ModuleFilter

    @handle_errors
    def create(self, request, *args, **kwargs):
        data = request.data
        app_id = data.get("app")
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        app_serializer = AppSerializer(App.objects.get(pk=app_id))
        
        response_data = serializer.data
        response_data["app"] = app_serializer.data

        headers = self.get_success_headers(serializer.data) 
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)

    @handle_errors
    def destroy(self, request, *args, **kwargs):
        module = self.get_object()
        module_name = module.id
        app_name = module.app.id

        if not module_name:
            return Response(
                {"error": "Missing module name"}, status=status.HTTP_400_BAD_REQUEST
            )

        module.delete()
        return run_subprocess(
            ["3plug", "drop-module", app_name, module_name],
            "Module deleted successfully",
            "Failed to delete module",
        )


class CreateDocumentAPIView(APIView):
    @handle_errors
    def post(self, request, *args, **kwargs):
        name = request.data.get("name")
        document = Document.objects.get(pk=name)

        return run_subprocess(
            ["3plug", "new-doc", "--app", document.app.id, "--module", document.module.id, name],
            "Document created successfully",
            "Failed to create document",
        )


class DocumentViewSet(GenericViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    filterset_class = DocumentFilter

    @handle_errors
    def create(self, request, *args, **kwargs):
        data = request.data
        module_id = data.pop("module")
        module = Module.objects.get(pk=module_id)
        data["app"] = App.objects.get(pk=module.app.id)
        data["module"] = module
        doc = Document.objects.create(**data)

        response_data = self.get_serializer(doc).data

        return Response(
            response_data,
            status=status.HTTP_201_CREATED,
            headers=self.get_success_headers(response_data),
        )

    @handle_errors
    def destroy(self, request, *args, **kwargs):
        document = self.get_object()
        document_name = document.id
        app = document.app.id
        module = document.module.id

        if not document_name:
            return Response(
                {"error": "Missing document name"}, status=status.HTTP_400_BAD_REQUEST
            )

        document.delete()
        return run_subprocess(
            ["3plug", "drop-doc", "--app", app, "--module", module, document_name],
            "Document deleted successfully",
            "Failed to delete document",
        )

    @handle_errors
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()  # The existing document instance
        old_app = instance.app.id  # Store the old module ID
        old_module = instance.module.id  # Store the old module ID

        # Update the serializer with the incoming request data
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Get updated values after the save
        updated_instance = self.get_object()
        new_module = updated_instance.module.id

        # Check if the module has changed
        if old_module != new_module:
            document_name = updated_instance.id
            updated_instance.app.id

            # Run the move command through the subprocess
            move_command = [
                "3plug",
                "move-doc",
                old_app,
                old_module,
                updated_instance.app.id,
                updated_instance.module.id,
                document_name,
            ]
            return run_subprocess(
                move_command, "Document moved successfully", "Failed to move document"
            )

        return Response(serializer.data)


class CreatePrintFormatAPIView(APIView):
    @handle_errors
    def post(self, request, *args, **kwargs):
        try:
            name = request.data.get("name")
            app = request.data.get("app")
            module = request.data.get("module")
            print(name, app, module)

            return run_subprocess(
                ["3plug", "new-print-format", "--app", app, "--module", module, name],
                "PrintFormat created successfully",
                "Failed to create PrintFormat",
            )
        except Exception as e:
            print(e)


class PrintFormatViewSet(GenericViewSet):
    queryset = PrintFormat.objects.all()
    serializer_class = PrintFormatSerializer
    filterset_class = PrintFormatFilter

    @handle_errors
    def create(self, request, *args, **kwargs):
        data = request.data
        module_id = data.pop("module")
        module = Module.objects.get(pk=module_id)
        data["app"] = App.objects.get(pk=module.app.id)
        data["module"] = module
        doc = PrintFormat.objects.create(**data)

        module_serializer = ModuleSerializer(module)
        app_serializer = AppSerializer(App.objects.get(pk=module.app.id))

        response_data = self.get_serializer(doc).data
        response_data["module"] = module_serializer.data
        response_data["app"] = app_serializer.data
        response_data["additional"] = {
            "type": "newprintformat",
            "info": {"message": "Print Format created and ready to be used."},
        }

        return Response(
            response_data,
            status=status.HTTP_201_CREATED,
            headers=self.get_success_headers(response_data),
        )

    @handle_errors
    def destroy(self, request, *args, **kwargs):
        print_format = self.get_object()
        print_format_name = print_format.id
        app = print_format.app.id
        module = print_format.module.id

        if not print_format_name:
            return Response(
                {"error": "Missing print_format name"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        print_format.delete()
        return run_subprocess(
            [
                "3plug",
                "drop-print-format",
                "--app",
                app,
                "--module",
                module,
                print_format_name,
            ],
            "PrintFormat deleted successfully",
            "Failed to delete PrintFormat",
        )


class MigrateAPIView(APIView):
    @handle_errors
    def post(self, request, *args, **kwargs):
        app_name = request.data.get("app")
        module_name = request.data.get("module")
        doc_name = request.data.get("doc")

        command = ["3plug", "migrate"]
        if doc_name:
            doc = Document.objects.get(pk=doc_name)
            command.append("--app")
            command.append(doc.app.id)
            command.append("--module")
            command.append(doc.module.id)
            command.append("--doc")
            command.append(doc.id)
        elif module_name:
            module = Module.objects.get(pk=module_name)
            command.append("--app")
            command.append(module.app.id)
            command.append("--module")
            command.append(module.id)
        elif app_name:
            command.append("--app")
            command.append(app_name)

        # Send a response immediately
        response = Response(
            {"message": "Migration started successfully"},
            status=status.HTTP_200_OK,
        )

        # Run subprocess in a separate thread
        threading.Thread(
            target=run_subprocess,
            args=(command, "Migration successful", "Failed to migrate"),
            daemon=True,  # Ensures the thread will not block server shutdown
        ).start()

        return response
