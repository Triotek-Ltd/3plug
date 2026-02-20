import React, { useState } from "react";
import CustomDateTimePicker from "./time/CustomDateTimePicker";

// Format a Date object to "HH:mm:ss"
const formatTime = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";
  return date
    .toLocaleTimeString("en-GB", { hour12: false }) // Use 24-hour format
    .split(":")
    .map((unit, i) => (i < 2 ? unit.padStart(2, "0") : unit)) // Ensure HH:mm:ss
    .join(":");
};

const DateTimeField = ({ value = "", onChange, readOnly, hidden }) => {
  const parseTime = (val) => {
    // Attempt to parse the value as a Date or return null
    const date = new Date(`1970-01-01T${val}`);
    return isNaN(date.getTime()) ? null : date;
  };

  const [inputValue, setInputValue] = useState(
    value && typeof value === "string" ? formatTime(parseTime(value)) : ""
  );

  if (hidden) return null;

  return (
    <div className="w-full h-2 flex flex-row items-center justify-between">
      <CustomDateTimePicker
        value={value}
        onChange={onChange}
        includeDate={true}
      />
    </div>
  );
};

export default DateTimeField;
