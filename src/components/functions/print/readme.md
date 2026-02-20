# Print Components

This folder contains React components designed for generating printable documents and layouts. The components utilize structured data to create dynamic, multi-page print outputs suitable for various use cases.

## Components

### 1. `DefaultPrint.js`

A component that generates a multi-page print layout for displaying detailed information in a structured format.

- **Props**:
  - `data`: The main data object containing key-value pairs for printing.
  - `title`: The title to display on the first page.
  - `load`: A trigger to recalculate pages when data changes.

- **Key Features**:
  - Dynamically calculates page breaks based on content height.
  - Supports both portrait and landscape orientations.
  - Displays a header, content, and footer on each page.
  - Handles various data types, including arrays and objects.

### 2. `DocumentPrint.js`

A component designed for generating a structured print layout based on a given field schema and data.

- **Props**:
  - `fields`: The structure defining how data should be displayed (e.g., text areas, checkboxes, images).
  - `data`: The actual data to be displayed in the layout.

- **Key Features**:
  - Renders fields based on their types (e.g., text, link, image).
  - Dynamically calculates pagination based on content size.
  - Includes custom headers and footers for print layout.
  - Utilizes a hidden container to accurately measure content height.

### 3. `ColorPrint.js`

A component that generates a colorful multi-page print layout, emphasizing visual elements in printed documents.

- **Props**:
  - `data`: An array of data objects to be displayed in a colorful format.
  - `title`: The title for the printout.
  - `load`: A dependency that triggers re-rendering of the component.

- **Key Features**:
  - Utilizes color coding and styling for different data fields.
  - Provides visual differentiation for better readability.
  - Supports pagination based on content length and formatting.

### 4. `ListColorPrint.js`

A component that generates a colorful, paginated print layout based on structured data and specified fields.

- **Props**:
  - `data`: An array of data objects for printing.
  - `title`: The title of the printed document.
  - `fields`: A list of field definitions that determine how to display data.
  - `filters`: An object containing filters applied to the data.
  - `load`: A dependency that triggers re-calculation of pages when data changes.

- **Key Features**:
  - Calculates pagination based on content height.
  - Renders a header with an optional title and filters.
  - Displays structured data in a grid format with alternating row colors.
  - Automatically switches to landscape orientation if the number of fields exceeds a threshold.
  - Includes a timestamp for when the document was generated.

## Usage

1. Import the components where needed in your application:
   ```javascript
   import DefaultPrint from '@/components/functions/print/DefaultPrint';
   import DocumentPrint from '@/components/functions/print/DocumentPrint';
   import ColorPrint from '@/components/functions/print/ColorPrint';
   import ListColorPrint from '@/components/functions/print/ListColorPrint';


# Print Components Documentation

## Table of Contents
- [Overview](#overview)
- [ListColorPrint](#listcolorprint)
- [ListDefaultPrint](#listdefaultprint)

---

## Overview
This documentation covers the print components used for generating printable lists in various formats within the project. These components support customizable layouts, handle different data requirements, and enable developers to create well-structured print views of their data. The following components are included:

- **ListColorPrint**: Generates a printable list with customizable colors and layouts.
- **ListDefaultPrint**: Creates a basic printable list with a simple layout.

## ListColorPrint

### Description
`ListColorPrint` is a React component designed to generate a printable list with customizable colors and layouts. It supports both portrait and landscape orientations based on the number of fields displayed. The component dynamically calculates page content, handles page breaks, and generates a structured output that includes headers, footers, and data rows.

### Props
- `data`: Array of objects containing the data to be printed.
- `title`: String representing the title of the list.
- `fields`: Array of objects containing field definitions, each with an `id` and `name`.
- `filters`: Object containing filters applied to the data.
- `load`: Boolean value indicating when to recalculate pages.

### State Variables
- `pages`: Array that holds the formatted pages of content.
- `currentDateTime`: String representing the current date and time.
- `isLandscape`: Boolean that determines if the layout should be landscape based on the number of fields.

### Key Constants
- `CONTENT_PADDING`: Padding value for content.
- `PAGE_HEIGHT`, `PAGE_WIDTH`: Dimensions for standard A4 page.
- `LANDSCAPE_PAGE_HEIGHT`, `LANDSCAPE_PAGE_WIDTH`: Dimensions for landscape layout.

### Icon Class Map
The component uses FontAwesome icons for various fields:
```javascript
const iconClassMap = {
  id: "fa-id-badge",
  file: "fa-file-alt",
  date: "fa-calendar-day",
  email: "fa-envelope",
  phone: "fa-phone",
  url: "fa-link",
  address: "fa-map-marker-alt",
};


