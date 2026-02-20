# Buttons Component README

## Overview

The `buttons` folder in the `components/core/common` directory contains reusable button components designed to enhance user interaction and facilitate various actions within the application. Each button is styled for visual consistency and responsiveness, ensuring a user-friendly experience.

## Components

### 1. DeleteButton

The `DeleteButton` component is a customizable button designed for deleting items.

- **Props**:
  - `className`: Optional custom CSS classes for additional styling.

- **Features**:
  - Displays a trash icon from FontAwesome.
  - Applies various utility classes for styling, hover effects, and transitions.

### 2. Download

The `Download` component allows users to download files, specifically in Excel format.

- **Props**:
  - `className`: Optional custom CSS classes for additional styling.

- **Features**:
  - Displays a download icon with a tooltip indicating the action.
  - Utilizes `TableTooltip` to provide contextual information on hover.
  - Styled for a professional appearance with hover effects and transitions.

### 3. EmailButton

The `EmailButton` component facilitates sending emails directly from the interface.

- **Props**:
  - `className`: Optional custom CSS classes for additional styling.

- **Features**:
  - Displays an envelope icon from FontAwesome.
  - Includes a tooltip for guidance on hover using `DefaultTooltip`.
  - Styled to provide a clear and engaging user experience.

### 4. LabelDownload

The `LabelDownload` component allows users to download labels as a zip file.

- **Props**:
  - `className`: Optional custom CSS classes for additional styling.

- **Features**:
  - Displays a file download icon with a tooltip indicating the action.
  - Styled similarly to other buttons for consistency across the application.

### 5. PrimaryButton

The `PrimaryButton` component serves as a primary action button within the UI.

- **Props**:
  - `text`: The text to be displayed on the button.
  - `className`: Optional custom CSS classes for additional styling.

- **Features**:
  - Utilizes various utility classes for hover effects and transitions.
  - Designed for primary actions, ensuring it stands out visually.

### 6. PrimaryButton1

The `PrimaryButton1` component serves as an alternative primary action button.

- **Props**:
  - `text`: The text to be displayed on the button.
  - `className`: Optional custom CSS classes for additional styling.

- **Features**:
  - Similar styling to `PrimaryButton`, ensuring visual consistency.
  - Offers an additional option for primary actions.

### 7. PrintButton

The `PrintButton` component allows users to initiate a print action.

- **Props**:
  - `className`: Optional custom CSS classes for additional styling.

- **Features**:
  - Displays a print icon from FontAwesome.
  - Styled for consistency with other button components.

### 8. PrintConfirmButton

The `PrintConfirmButton` component manages print confirmation through a modal.

- **Props**:
  - `className`: Optional custom CSS classes for additional styling.
  - `modalIsOpen`: Boolean indicating if the modal is open.
  - `setModalIsOpen`: Function to manage the modal's open state.

- **Features**:
  - Renders a confirmation modal when the button is clicked.
  - Allows users to confirm or cancel the print action.

### 9. SecondaryButton

The `SecondaryButton` component serves as a secondary action button within the UI.

- **Props**:
  - `text`: The text to be displayed on the button.
  - `className`: Optional custom CSS classes for additional styling.

- **Features**:
  - Styled to indicate a secondary action while still maintaining visual appeal.

### 10. SmsButton

The `SmsButton` component facilitates sending SMS messages from the application.

- **Props**:
  - `className`: Optional custom CSS classes for additional styling.

- **Features**:
  - Displays an SMS icon from FontAwesome.
  - Includes a tooltip for user guidance on hover using `DefaultTooltip`.

### 11. Upload

The `Upload` component allows users to import data from a file.

- **Props**:
  - `className`: Optional custom CSS classes for additional styling.

- **Features**:
  - Displays an upload icon from FontAwesome.
  - Includes a tooltip for context, guiding users through the upload process.

## Conclusion

The button components in the `components/core/common/buttons` folder are designed for flexibility and reusability, ensuring a consistent user experience across various interactions in the application. Each button is styled for responsiveness and accessibility, contributing to an intuitive interface.
