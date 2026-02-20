import json
import logging

import requests
from core.models import Reminder
from core.utils import send_custom_email
from django.conf import settings
from django.utils import timezone
from requests.auth import HTTPBasicAuth

logger = logging.getLogger(__name__)
from datetime import timedelta

from django.utils import timezone


def send_sms(phone_number, message, code="254"):
    no = phone_number
    phone_number = phone_number.strip()
    if phone_number.startswith("+"):
        phone_number = phone_number[1:]
    if len(phone_number) > 10:
        no = f"{phone_number[-12:]}"
    elif 9 <= len(phone_number) <= 10:
        no = f"{code}{phone_number[-9:]}"
        
    if no.startswith("254"):
        send_254_sms(no, message)
    elif no.startswith("27"):
        send_sms_to_27(no, message)
        
def send_254_sms(phone_number, message):
    api_url = settings.SMS_API_URL
    payload = {
        "SenderId": settings.SMS_SENDER_ID,
        "IsUnicode": True,
        "IsFlash": True,
        "MessageParameters": [{"Number": phone_number, "Text": message}],
        "ApiKey": settings.SMS_API_KEY,
        "ClientId": settings.SMS_CLIENT_ID,
    }
    json_payload = json.dumps(payload)
    headers = {"Content-Type": "application/json", "Accept": "application/json"}

    response = requests.post(api_url, data=json_payload, headers=headers)
    if response.status_code == 200:
        response_data = response.json()
        if response_data.get("ErrorCode") == 0:
            for data in response_data.get("Data", []):
                if data.get("MessageErrorCode") == 0:
                    logger.info(f"SMS sent successfully to {data.get('MobileNumber')}")
                else:
                    logger.error(
                        f"Failed to send SMS to {data.get('MobileNumber')}. Error: {data.get('MessageErrorDescription')}"
                    )
        else:
            logger.error(
                f"Failed to send SMS. Error: {response_data.get('ErrorDescription')}"
            )
    else:
        logger.error(f"Failed to send SMS to {phone_number}. Response: {response.text}")

    return response


def send_sms_to_27(phone_number, message):
    apiKey = settings.SA_API_KEY
    apiSecret = settings.SA_API_SECRET
    apiUrl = settings.SA_SMS_API_URL
    basic = HTTPBasicAuth(apiKey, apiSecret)

    sendRequest = {
        "messages": [{"content": message, "destination": phone_number}]
    }

    try:
        sendResponse = requests.post(apiUrl,
                                    auth=basic,
                                    json=sendRequest)

        # Check the status code and handle different scenarios
        if sendResponse.status_code == 200:
            response_data = sendResponse.json()
            print("Success:")
            print(response_data)
            return {
                "status": "success",
                "data": response_data
            }
        elif sendResponse.status_code == 400:
            print("Bad Request: Invalid input or missing parameters")
            return {
                "status": "error",
                "message": "Invalid input or missing parameters",
                "details": sendResponse.json()
            }
        elif sendResponse.status_code == 401:
            print("Unauthorized: Invalid API key or secret")
            return {
                "status": "error",
                "message": "Invalid API key or secret",
                "details": sendResponse.json()
            }
        elif sendResponse.status_code == 402:
            print("Payment Required: Insufficient balance")
            return {
                "status": "error",
                "message": "Insufficient balance",
                "details": sendResponse.json()
            }
        elif sendResponse.status_code == 429:
            print("Too Many Requests: Rate limit exceeded")
            return {
                "status": "error",
                "message": "Rate limit exceeded",
                "details": sendResponse.json()
            }
        elif sendResponse.status_code == 500:
            print("Internal Server Error: Something went wrong on the server")
            return {
                "status": "error",
                "message": "Internal server error",
                "details": sendResponse.json()
            }
        else:
            print(f"Unexpected Error: Status code {sendResponse.status_code}")
            return {
                "status": "error",
                "message": f"Unexpected error: {sendResponse.status_code}",
                "details": sendResponse.json()
            }
    except requests.exceptions.RequestException as e:
        print(f"Request Exception: {e}")
        return {
            "status": "error",
            "message": "Failed to send SMS due to a network error",
            "details": str(e)
        }
    except Exception as e:
        print(f"Unexpected Exception: {e}")
        return {
            "status": "error",
            "message": "An unexpected error occurred",
            "details": str(e)
        }