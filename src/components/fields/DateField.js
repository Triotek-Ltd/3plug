import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomDateSelector from "./time/CustomDateSelector";

const formatDate = (date) => {
  if (!date || isNaN(date.getTime())) return null;
  // Format the date as YYYY-MM-DD
  return date.toISOString().split("T")[0];
};

const DateField = ({ value = "", onChange, placeholder, readOnly, hidden }) => {
  return (
    <div className="relative w-full" readOnly={readOnly}>
      <CustomDateSelector
        selectedDate={value}
        onChange={(date) => onChange(date)}
        readOnly={readOnly}
      />
    </div>
  );
};

export default DateField;
