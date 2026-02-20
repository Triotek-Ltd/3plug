import React, { useState } from "react";

const Clock = ({
  isMinuteSelection,
  hour,
  minute,
  onHourSelect,
  onMinuteSelect,
}) => {
  const [selectedHour, setSelectedHour] = useState(hour);
  const [selectedMinute, setSelectedMinute] = useState(minute);

  const handleHourSelect = (selected) => {
    setSelectedHour(selected);
    onHourSelect(selected);
  };

  const handleMinuteSelect = (selected) => {
    setSelectedMinute(selected);
    onMinuteSelect(selected);
  };

  // Determine rotation for hour and minute hands
  const hourAngle = selectedHour === 12 ? 180 : selectedHour * 30 + 180; // Each hour is 30 degrees
  const minuteAngle = selectedMinute * 6 + 180;

  return (
    <div className="relative w-48 h-48 bg-gray-200 rounded-full flex justify-center items-center shadow-md">
      {/* Clock Numbers */}
      <div className="absolute w-full h-full flex justify-center items-center">
        {Array.from({ length: 12 }, (_, i) => {
          // Treat 0 as 12 for hours
          const hourNumber = i === 0 ? 12 : i; // Set 0 to 12 for the clock face
          const isSelected = isMinuteSelection
            ? selectedMinute === i * 5 // For minutes, multiples of 5 (0, 5, 10, ...)
            : selectedHour === hourNumber; // For hours, display 1-12

          // Format minutes as two digits
          const formattedMinute =
            i === 0 ? "00" : String(i * 5).padStart(2, "0");

          return (
            <div
              key={i}
              className={`flex justify-center items-center w-16 h-16 absolute cursor-pointer transition-all duration-200`}
              style={{
                transform: `rotate(${i * 30}deg) translateY(-120%)`, // Move numbers to the outer part of the circle
                transformOrigin: "center center",
              }}
              onClick={() => {
                if (isMinuteSelection) {
                  handleMinuteSelect(i * 5); // For minute selection, multiply by 5 (0, 5, 10, ...)
                } else {
                  handleHourSelect(hourNumber); // For hour selection, display 1-12
                }
              }}
            >
              <div
                className={`flex justify-center items-center w-6 h-6 text-xs font-semibold border-2 rounded-full hover:bg-gray-300 border-transparent ${
                  isSelected ? "bg-blue-500 text-white" : ""
                }`}
                style={{
                  transform: `rotate(-${i * 30}deg)`, // This ensures text is horizontal
                }}
              >
                {isMinuteSelection ? formattedMinute : hourNumber}{" "}
                {/* Display minute or hour */}
              </div>
            </div>
          );
        })}
      </div>

      {/* Clock Hand (Long Arrow) */}
      <div
        className="absolute top-1/2 left-1/2 transform origin-bottom transition-transform duration-200"
        style={{
          transform: `rotate(${
            isMinuteSelection ? minuteAngle : hourAngle
          }deg)`,
        }}
      >
        {/* Long Arrow Hand */}
        <div className={`w-[2px] h-14 bg-black absolute top-0 left-1/2`} />
      </div>
    </div>
  );
};

export default Clock;
