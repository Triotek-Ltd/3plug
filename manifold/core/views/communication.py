import json

import requests
from core.filters import ReminderFilter
from core.models import Reminder
from core.models.communication import Reminder
from core.serializers import ReminderSerializer
from core.utils import send_custom_email, send_sms
from core.views.template import GenericViewSet
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class ReminderListAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request):
        """
        Returns a list of reminders for the authenticated user.
        """
        user = request.user
        reminders = Reminder.objects.filter(users=user)  # Filter reminders by user

        # Serialize the reminders
        serializer = ReminderSerializer(reminders, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class SendEmailView(APIView):
    def post(self, request):
        recipients = request.data.get("recipients", [])
        subject = request.data.get("subject", "No Subject")
        message = request.data.get("message", "")

        if not isinstance(recipients, list) or not all(
            isinstance(email, str) for email in recipients
        ):
            return Response(
                {"error": "Recipients must be a list of email addresses."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not subject or not message:
            return Response(
                {"error": "Subject and message are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Use send_custom_email for each recipient
            for recipient in recipients:
                context = {
                    "message": message,
                }
                send_custom_email(
                    subject, "email/default.html", context, [recipient]  # Template path
                )
            return Response(
                {"message": "Email(s) sent successfully."}, status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SendSmsView(APIView):
    def post(self, request):
        phone_numbers = request.data.get("phone_numbers", [])
        message = request.data.get("message", "")

        if not isinstance(phone_numbers, list) or not all(
            isinstance(number, str) for number in phone_numbers
        ):
            return Response(
                {"error": "Phone numbers must be a list of phone numbers."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not message:
            return Response(
                {"error": "Message is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            for phone_number in phone_numbers:
                send_sms(phone_number, message)
            return Response(
                {"message": "SMS sent successfully."}, status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ReminderViewSet(GenericViewSet):
    queryset = Reminder.objects.all()
    filterset_class = ReminderFilter
    serializer_class = ReminderSerializer


#     def list(self, request, *args, **kwargs):
#         try:
#             # Check if the user is an admin
#             if request.user.is_superuser:
#                 filtered_queryset = self.queryset  # Allow admin to view all
#             else:
#                 # filtered_queryset = custom_list(self, request).filter(users=request.user)
#                 pass

#             # Handle pagination parameters
#             query_params = request.GET.copy()
#             page = query_params.pop("page", [1])[0]
#             page_length = query_params.pop("page_length", [20])[0]

#             total = filtered_queryset.count()

#             # Apply pagination
#             try:
#                 page = int(page) if page else 1
#                 page_length = int(page_length)
#             except ValueError:
#                 page = 1
#                 page_length = 20

#             total_pages = (total + page_length - 1) // page_length  # Calculate the total number of pages

#             # Handle pagination boundaries
#             if page > total_pages or page < 1:
#                 page = 1

#             start_index = (page - 1) * page_length
#             end_index = start_index + page_length
#             paginated_queryset = filtered_queryset[start_index:end_index]

#             # Serialize the paginated data
#             serializer = self.get_serializer(paginated_queryset, many=True)
#             li = {
#                 "list": serializer.data,
#                 "total": total,
#                 "total_pages": total_pages,
#                 "current_page": page,
#             }

#             return Response(li)
#         except Exception as e:
#             print(e)
#             return Response(
#                 {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )

#     def retrieve(self, request, *args, **kwargs):
#         instance = self.get_object()

#         # Check if the user is an admin or if the user is in the users ManyToMany field
#         if not (request.user.is_staff or request.user.is_superuser) and not instance.users.filter(id=request.user.id).exists():
#             raise PermissionDenied("You do not have permission to view this reminder.")

#         serializer = self.get_serializer(instance)
#         return Response(serializer.data)
