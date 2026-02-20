import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

// Function to format date for display (e.g. from "2025-01-31" to "31-01-2025")
const formatDateDisplay = (dateInput) => {
  let dateStr;

  // Check if the input is a Date object
  if (dateInput instanceof Date) {
    // Format the Date object into a string in 'yyyy-mm-dd' format
    dateStr = dateInput.toISOString().split("T")[0];
  } else {
    // If it's a string, ensure it matches the expected format
    dateStr = dateInput;
  }

  // Now handle the date formatting
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  }
  return dateStr; // If it's not in the correct format, return the input as is
};

// Function to parse user input and convert it to a valid date format (yyyy-mm-dd)
const parseDateInput = (inputStr) => {
  if (/^\d{2}-\d{2}-\d{4}$/.test(inputStr)) {
    const [day, month, year] = inputStr.split("-");
    const formattedDate = `${year}-${month}-${day}`;
    const date = new Date(formattedDate);
    // Check if the date is valid
    return isNaN(date.getTime()) ? null : formattedDate;
  }
  return null;
};

const CustomDateSelector = ({ selectedDate, onChange, readOnly }) => {
  const [value, setValue] = useState(selectedDate);
  const [inputValue, setInputValue] = useState(formatDateDisplay(value));

  // Handle change in the input field
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Validate and handle when the input field loses focus
  const handleInputBlur = () => {
    const parsedDate = parseDateInput(inputValue);
    if (parsedDate) {
      setValue(parsedDate);
      setInputValue(formatDateDisplay(parsedDate));
      onChange(parsedDate); // Call the parent onChange with valid date
    } else {
      setInputValue(formatDateDisplay(value)); // Reset input if invalid
      setValue(null); // Set value as null if invalid input
      onChange(null); // Call the parent onChange with null
    }
  };

  // Handle changes from the datepicker
  const handleChange = (newValue) => {
    const startDate = newValue.startDate;
    setValue(startDate);
    setInputValue(formatDateDisplay(startDate));
    onChange(startDate);
  };

  return (
    <div className="flex flex-row w-full focus:outline-none focus:ring-0 focus:border-none">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        readOnly={readOnly}
        onBlur={handleInputBlur}
        placeholder="DD-MM-YYYY"
        className="w-full focus:outline-none focus:ring-0 focus:border-none"
      />
      <div className={`w-6 ${readOnly ? "hidden" : ""}`}>
        <Datepicker
          value={{ startDate: value, endDate: value }}
          inputClassName="w-0"
          toggleClassName="absolute bg-gradient-to-tl from-purple-700 to-pink-500 rounded-md text-white right-0 h-full p-[1px] text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          containerClassName=""
          readOnly
          onChange={handleChange}
          showShortcuts={true}
          useRange={false}
          asSingle={true}
          primaryColor={"fuchsia"}
          placeholder=""
        />
      </div>
    </div>
  );
};

export default CustomDateSelector;
