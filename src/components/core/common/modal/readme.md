# Modal Components

## Purpose
The Modal components in this directory are designed to provide various types of modal windows for user interactions. These modals serve as confirmation dialogs, error alerts, data import interfaces, and more, enhancing user experience with contextual overlays. Each modal comes with custom styles and functions for specific operations within the application.

## Functions

### Confirmation
- **Purpose**: Displays a modal for user confirmation with options to confirm or cancel the action.
- **Functions**:
  - `isOpen`: Controls modal visibility.
  - `onRequestClose`: Callback for closing the modal.
  - `onConfirm`: Callback for confirming the action.
  - `title`: Modal title.
  - `content`: Content message to display.

### ConfirmationModal
- **Purpose**: Confirms deletion of a document, giving the user a "Yes" or "No" choice.
- **Functions**:
  - `isOpen`: Controls modal visibility.
  - `onRequestClose`: Callback to close the modal.
  - `onConfirm`: Callback for confirming deletion.

### CustomMessageModal
- **Purpose**: Displays an error message with options to close or proceed.
- **Functions**:
  - `isOpen`: Controls modal visibility.
  - `onRequestClose`: Callback to close the modal.
  - `message`: Message displayed in the modal.
  - `title`: Title of the error.
  - `onProceed`: Callback to proceed despite the error.

### ForbiddenModal
- **Purpose**: Shows a forbidden error message when the user lacks permission to access a resource.
- **Functions**:
  - `isOpen`: Controls modal visibility.
  - `handleClose`: Callback to go back to the previous page.
  - **@imports**: `Link` (Next.js) for redirect options, `useRouter` (Next.js) for navigation.

### ImportDataModal
- **Purpose**: Allows users to upload and preview data files, with an option to select columns for import.
- **Functions**:
  - `isOpen`: Controls modal visibility.
  - `onRequestClose`: Callback to close the modal.
  - `onSendData`: Sends the selected data for processing.
  - `handleFileChange`: Handles file upload.
  - `processFileData`: Prepares file data for display.

### PrintTypeModal
- **Purpose**: Provides options for selecting the type of print and downloading PDFs.
- **Functions**:
  - `isOpen`: Controls modal visibility.
  - `onRequestClose`: Callback to close the modal.
  - `onSelectPrintType`: Chooses the print type.
  - `handlePdfDownload`: Downloads the selected PDF.
