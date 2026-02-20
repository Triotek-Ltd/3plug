import React, { useState } from "react";
import GradientTimePicker from "react-gradient-timepicker";
import "react-gradient-timepicker/dist/index.css";

const TimePicker = ({ value, onChange }) => {
  const [selectedTime, setSelectedTime] = useState(value || "12:00 AM");

  // Handle time change
  const handleTimeChange = (time) => {
    setSelectedTime(time);
    if (onChange) {
      onChange(time); // Pass the selected time to the parent component
    }
  };

  return (
    <div className="relative w-full">
      {/* Display Selected Time */}
      <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer text-sm flex justify-between items-center">
        <span>{selectedTime}</span>
      </div>

      {/* Gradient Time Picker */}
      <div className="mt-4">
        <GradientTimePicker
          value={selectedTime}
          onChange={handleTimeChange}
          is24HourClock={false} // Set to true if you prefer 24-hour format
          showSeconds={false} // Show seconds or not
        />
      </div>
    </div>
  );
};

export default TimePicker;
