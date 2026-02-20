# Communication Functions

This folder contains components related to sending communications, specifically through email and SMS. The primary components are `SendEmail` and `SendSms`, which are designed to provide modal interfaces for users to input necessary information and send messages.

## Overview

### Components

1. **SendEmail**
   - **Purpose**: Provides a modal interface for users to send emails.
   - **Props**:
     - `isOpen`: Boolean that determines if the modal is visible.
     - `onRequestClose`: Function to handle closing the modal.
     - `email`: The default email address to pre-fill the input.
     - `subject`: The initial subject of the email.
     - `msg`: The default message body.
   - **Functionality**:
     - Allows users to input email address, subject, and message.
     - Validates input and displays toast notifications based on success or failure of the email sending process.
     - Utilizes the `postData` function from the `utils/Api` module to send the email via an API endpoint.

2. **SendSms**
   - **Purpose**: Provides a modal interface for users to send SMS messages.
   - **Props**:
     - `isOpen`: Boolean that determines if the modal is visible.
     - `onRequestClose`: Function to handle closing the modal.
     - `phone`: The default phone number to pre-fill the input.
     - `msg`: The default message body.
   - **Functionality**:
     - Allows users to input phone number and message.
     - Validates input and displays toast notifications based on success or failure of the SMS sending process.
     - Utilizes the `postData` function from the `utils/Api` module to send the SMS via an API endpoint.

## Usage

To use these components, import them into your desired component file:

```javascript
import SendEmail from "@/components/functions/communication/SendEmail";
import SendSms from "@/components/functions/communication/SendSms";
