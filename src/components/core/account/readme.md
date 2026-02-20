# Accounts Component README

## Overview

The `accounts` folder in the Next.js project contains key components for user authentication and profile management, including a login form, layout, loading indicators, logout mechanism, profile settings, and more. These components work together to create a seamless and responsive user experience for managing user authentication and account settings.

## Components

### 1. Layout Component

The `Layout` component serves as a wrapper for the login form and provides a consistent visual structure and styling for the login interface, enhancing the overall user experience.

- **Props**:
  - `children`: Allows the inclusion of child components, such as the login form itself.
  - `gradientFrom` and `gradientTo`: Define the gradient background colors for the layout, adding aesthetic appeal.
  - `className`: An optional prop for additional CSS classes, allowing for further customization.

- **Features**:
  - Applies a gradient background that spans the full screen, creating a visually striking entrance to the login form.
  - Centers the login form vertically and horizontally, making it user-friendly across various devices.
  - Includes a `ToastContainer` for displaying notifications, ensuring users receive feedback about their login status.

### 2. Loading Component

The `Loading` component indicates that a process is ongoing, specifically during the login operation.

- **Features**:
  - Displays a fixed overlay that covers the entire screen with a semi-transparent black background, signaling to the user that an operation is in progress.
  - Features multiple colored dots that blink in sequence, drawing attention and indicating activity, which keeps users engaged while waiting.

### 3. LoginForm Component

The `LoginForm` component is the core of the user authentication process, handling user input, login logic, and navigation upon successful login.

- **State Management**:
  - Maintains local state for user credentials (username and password) and a loading state indicating whether the login process is in progress.

- **Login Logic**:
  - Invokes an asynchronous login function, which communicates with the manifold API to authenticate the user.
  - On receiving a successful response, it:
    - Displays a success notification.
    - Saves the authentication token in the database for future requests.
    - Checks if it is the user's first login; if so, it redirects the user to an OTP verification page. For returning users, it redirects them to the home page.

- **Form Handling**:
  - Includes two input fields: one for the username and one for the password, both of which are required.
  - Labels adjust based on user interaction, ensuring clarity regarding required information.

- **User Feedback**:
  - Notifications provided through the ToastContainer alert users to success or failure in the login process, enhancing the user experience.

### 4. Logout Component

The `Logout` component is responsible for handling user logout functionality, ensuring a secure and user-friendly experience when users choose to log out of the application.

- **State Management**:
  - Uses a state variable to manage the visibility of a confirmation modal before executing the logout process.

- **Logout Logic**:
  - Invokes an asynchronous function to communicate with the manifold API for logout.
  - On successful logout:
    - Removes the authentication token and username from cookies to ensure that user sessions are terminated securely.
    - Redirects the user to the login page.

- **User Confirmation**:
  - Displays a confirmation modal to prevent accidental logouts, prompting the user to confirm their decision before executing the logout logic.

### 5. ProfilePage Component

The `ProfilePage` component provides a user-friendly interface for displaying and editing user profile information, managing account settings, and confirming profile deletions.

- **State Management**:
  - Maintains local state for profile data, edit mode status, and modal visibility for confirmation on profile deletion.
  - Uses `useRef` to reference the profile edit form for easier manipulation.

- **Profile Data Fetching**:
  - On component mount and whenever the editing state changes, it fetches user profile data from the API and updates the state accordingly.

- **Edit Functionality**:
  - Toggles between view and edit modes, allowing users to edit their profile information directly on the page.
  - Handles changes to form fields and updates the local state accordingly, ensuring that only modified fields are sent back to the server upon save.

- **Update Logic**:
  - When the user saves changes, it sends the modified data to the API for updating the profile.
  - Notifies the user of success or failure through toast notifications, enhancing the user experience.

- **Profile Deletion**:
  - Provides a confirmation modal for users to confirm their intent to delete their profile.
  - On confirmation, it sends a delete request to the API and redirects the user to the profiles list or home page upon successful deletion.

- **Rendering**:
  - Displays the user's profile picture, name, and role, along with options to edit the profile or save changes.
  - Includes components for profile information, messages, and settings, maintaining a structured layout for the profile page.

### 6. ProfileEditForm Component

The `ProfileEditForm` component facilitates editing the user's profile information, enabling a smooth and intuitive user experience for making updates.

- **State Management**:
  - Uses `useEffect` to populate the form fields with existing user data when the `user` prop is updated.
  - Maintains local state for the form data, which includes fields like first name, last name, email, phone, location, bio, and password.

- **Input Handling**:
  - Provides controlled input fields for each piece of user data, ensuring that changes are reflected in the component's state immediately.
  - Includes a handler function for input changes that updates the form data state based on user interactions.

- **Form Submission**:
  - Implements a form submission handler that prevents the default form submission behavior and calls the `onSubmit` function with the current form data.
  - Uses `useImperativeHandle` to expose a `submit` method, allowing parent components to programmatically submit the form.

- **Rendering**:
  - Renders a form with input fields for each profile attribute, along with appropriate labels and styles.
  - Applies validation attributes like `required` to ensure necessary fields are filled out before submission.
  - Offers a user-friendly layout that adapts well to different screen sizes.

### 7. ProfileInfo Component

The `ProfileInfo` component displays detailed information about the user's profile, enhancing the user experience by providing quick access to important data.

- **Props**:
  - `userData`: An object containing user profile information, such as name, phone number, email, location, username, role, and timestamps for account creation and last login.

- **Rendering**:
  - Utilizes a responsive layout to present profile information in a structured format, making it easy for users to review their details.
  - Displays the user bio at the top, followed by an organized list of key profile attributes.

- **Icons and Styling**:
  - Incorporates Font Awesome icons next to each profile attribute for a visually appealing presentation and better user experience.
  - Each attribute is encapsulated within a styled list item, using colors to distinguish different sections and enhance readability.

- **Fallback Values**:
  - Each profile attribute has a fallback value (e.g., "N/A" or "No bio available") to ensure that users see meaningful information even if some data is missing.

### 8. ProfileMessages Component

The `ProfileMessages` component presents a summary of messages or notifications relevant to the user’s profile, improving user engagement by keeping them informed.

- **Rendering**:
  - Displays a list of message notifications in a clean and organized layout, with each message item featuring a title and description.
  - Each message includes a placeholder image to represent its context, enhancing visual appeal and user comprehension.

- **Message Types**:
  - Different messages are categorized by type (e.g., shipment updates, delivery status, alerts), allowing users to quickly scan for relevant information.
  - Each message includes a "View" link that users can click to learn more or take action, enhancing interactivity.

- **Styling**:
  - Utilizes a responsive design with flexbox layout to ensure a visually pleasing experience on various devices.
  - Each message item is styled with rounded corners and subtle shadows, creating a card-like appearance that enhances readability and visual hierarchy.

### 9. ProfileSettings Component

The `ProfileSettings` component allows users to manage their account settings, including notification preferences and account privacy options.

- **State Management**:
  - Uses local state to maintain user preferences, such as email notifications and privacy settings.

- **Settings Fetching**:
  - Fetches the current settings from the API on component mount and updates the local state accordingly.

- **Settings Update Logic**:
  - When users make changes and submit the form, it sends the updated settings to the API for persistence.
  - Provides feedback on the success or failure of the update through toast notifications.

- **Rendering**:
  - Displays toggle switches or checkboxes for each setting, making it easy for users to modify their preferences.
  - Uses clear labels and descriptions to guide users in adjusting their settings.

### Conclusion

The components within the `accounts` folder work cohesively to provide a robust authentication experience for users. Responsive design principles ensure that the interface is accessible on various devices, while aesthetic features contribute to an engaging user experience. Overall, these components facilitate secure user authentication and management while maintaining a seamless and intuitive workflow for users interacting with the application.
