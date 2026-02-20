import React, { useState, useEffect, useRef } from "react";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Clock from "./Clock"; // Assuming the Clock component is already defined
import CustomButton from "@/components/core/common/buttons/Custom";
import PrimaryButton from "@/components/core/common/buttons/Primary";
import DatePicker from "react-datepicker";
import CustomDateSelector from "./CustomDateSelector";

// Helper function to convert 24-hour time to 12-hour time with AM/PM
const format24to12 = (hour, minute) => {
  const isAm = hour < 12;
  let displayHour = hour % 12;
  displayHour = displayHour === 0 ? 12 : displayHour; // 0 hour should be displayed as 12
  const displayMinute = String(minute).padStart(2, "0");
  return `${displayHour}:${displayMinute} ${isAm ? "AM" : "PM"}`;
};

const CustomTimePicker = ({
  value = "",
  onChange,
  readOnly,
  hidden,
  placeholder,
  includeDate = false,
}) => {
  const [timeState, setTimeState] = useState(
    includeDate ? new Date(value) : value
  );
  const [selectedDate, setSelectedDate] = useState(new Date(value));
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [isAmSelected, setIsAmSelected] = useState(true);
  const [showMinuteSelection, setShowMinuteSelection] = useState(false);
  const [toShow, setToShow] = useState(false);

  const pickerRef = useRef(null); // Reference to the time picker modal

  // Helper function to get the initial configuration from the 24-hour format time string
  const getInitialConfig = (format24) => {
    const [hour, minute] = format24.split(":");
    const amPmHour = Number(hour) % 12;
    const isAmSelected = Number(hour) < 12;
    return {
      hour: amPmHour,
      minute: Number(minute),
      isAmSelected,
    };
  };

  useEffect(() => {
    if (timeState) {
      let hour, minute;

      // Handle case if value is a Date object
      if (timeState instanceof Date) {
        hour = timeState.getHours();

        minute = timeState.getMinutes();
      }
      // Handle case if value is a string in 'HH:mm' format
      else if (typeof value === "string" && value.includes(":")) {
        [hour, minute] = value.split(":").map(Number);
      }
      // Handle case if value is a datetime string (e.g., 'YYYY-MM-DDTHH:mm:ss')
      else if (typeof value === "string" && value.includes("T")) {
        const timePart = value.split("T")[1]?.split(":");
        if (timePart) {
          [hour, minute] = timePart.map(Number);
        }
      }

      if (hour !== undefined && minute !== undefined) {
        setTimeState({
          format12: format24to12(hour, minute),
          format24: `${String(hour).padStart(2, "0")}:${String(minute).padStart(
            2,
            "0"
          )}`,
        });
      }
    } else {
      // Fallback to current time if value is not provided
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      const formattedTime24 = `${String(currentHour).padStart(2, "0")}:${String(
        currentMinute
      ).padStart(2, "0")}`;
      setTimeState({
        format12: format24to12(currentHour, currentMinute),
        format24: formattedTime24,
      });
    }
  }, [value]);

  // Add event listener to detect clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setToShow(false); // Close the modal if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleIconClick = () => {
    let format24 = timeState.format24;
    const { hour, minute, isAmSelected } = getInitialConfig(format24); // Now it will work
    setToShow(true);
    setHour(hour);
    setMinute(minute);
    setIsAmSelected(isAmSelected);
    setShowMinuteSelection(false);
  };

  const toggleAmPm = (isAm) => setIsAmSelected(isAm);

  const handleHourSelect = (selectedHour) => {
    setHour(selectedHour);
    autoTriggerOnChange(selectedHour, minute, isAmSelected);
    setShowMinuteSelection(true);
  };

  const handleMinuteSelect = (selectedMinute) => {
    setMinute(selectedMinute);
    autoTriggerOnChange(hour, selectedMinute, isAmSelected);
  };

  const autoTriggerOnChange = (hour, minute, isAmSelected) => {
    const allFormat = getTime(hour, minute, isAmSelected);

    if (includeDate && selectedDate) {
      // Create a DateTime object when a date is included
      const selectedDateTime = new Date(selectedDate);
      const [hours, minutes] = allFormat.format24.split(":").map(Number);

      selectedDateTime.setHours(hours);
      selectedDateTime.setMinutes(minutes);
      selectedDateTime.setSeconds(0); // Optional: set seconds to zero

      onChange(selectedDateTime); // Pass the DateTime object to the onChange callback
    } else {
      // Return the time string in HH:mm:ss format
      const timeString = `${String(allFormat.format24.split(":")[0]).padStart(
        2,
        "0"
      )}:${String(allFormat.format24.split(":")[1]).padStart(2, "0")}:00`;

      onChange(timeString); // Pass the time string to the onChange callback
    }
  };

  const getTime = (hour, minute, isAmSelected) => {
    let finalHour = hour;
    if (isAmSelected) {
      if (finalHour === 12) finalHour = 0;
    } else {
      if (finalHour < 12) finalHour += 12;
    }

    const formattedMinute = String(minute).padStart(2, "0");
    const format12 = format24to12(finalHour, minute);
    const format24 = `${String(finalHour).padStart(2, "0")}:${formattedMinute}`;

    return { format12, format24 };
  };

  // Reset button functionality
  const resetTime = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const formattedTime24 = `${String(currentHour).padStart(2, "0")}:${String(
      currentMinute
    ).padStart(2, "0")}`;

    const formattedTime12 = format24to12(currentHour, currentMinute);

    // Update state
    setTimeState({
      format12: formattedTime12,
      format24: formattedTime24,
    });

    setHour(currentHour % 12);
    setMinute(currentMinute);
    setIsAmSelected(currentHour < 12); // Set AM/PM based on the current time

    // Trigger onChange callback
    onChange(formattedTime24);
  };

  const getBody = () => {
    if (!toShow) return null;

    return (
      <div
        className="absolute top-8 z-1 flex justify-center items-center"
        style={{ zIndex: 900 }}
      >
        <div
          ref={pickerRef} // Attach the ref to the modal container
          className="bg-white rounded-lg p-5 shadow-lg w-[350px] sm:w-[400px]"
        >
          <div className="">
            {includeDate && (
              <CustomDateSelector
                selectedDate={selectedDate}
                onChange={(date) => setSelectedDate(date)}
              />
            )}
          </div>
          <header className="flex justify-between items-center bg-gray-100 p-3 rounded-t-lg shadow-md">
            <div className="flex items-center space-x-1">
              <span
                className={`text-lg cursor-pointer ${
                  showMinuteSelection
                    ? "text-gray-600"
                    : "font-bold text-purple-900"
                }`}
                onClick={() => setShowMinuteSelection(false)}
              >
                {hour}
              </span>
              <span className="text-lg font-semibold text-gray-700 mx-2">
                :
              </span>
              <span
                className={`text-lg cursor-pointer ${
                  !showMinuteSelection
                    ? "text-gray-600"
                    : "font-bold text-purple-900"
                }`}
                onClick={() => setShowMinuteSelection(true)}
              >
                {String(minute).padStart(2, "0")}
              </span>
            </div>
            <div className="flex space-x-1">
              <div
                onClick={() => toggleAmPm(true)}
                className={`cursor-pointer text-xs font-medium px-3 py-1 rounded-md ${
                  isAmSelected ? "bg-indigo-500 text-white" : "bg-gray-300"
                }`}
              >
                AM
              </div>
              <div
                onClick={() => toggleAmPm(false)}
                className={`cursor-pointer text-xs font-medium px-3 py-1 rounded-md ${
                  !isAmSelected ? "bg-indigo-500 text-white" : "bg-gray-300"
                }`}
              >
                PM
              </div>
            </div>
          </header>
          <main className="p-4 flex justify-center items-center">
            <Clock
              isMinuteSelection={showMinuteSelection}
              hour={hour}
              minute={minute}
              onHourSelect={handleHourSelect}
              onMinuteSelect={handleMinuteSelect}
            />
          </main>
          <footer className="flex justify-between space-x-3 mt-4">
            <PrimaryButton text={"Close"} onClick={() => setToShow(false)} />
            <PrimaryButton text={"Reset"} onClick={resetTime} />
          </footer>
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative flex flex-row w-full"
      readOnly={readOnly}
      hidden={hidden}
    >
      <input
        className="!w-full px-2 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:border-none focus:ring-0 bg-transparent"
        value={value}
        onFocus={handleIconClick}
        onChange={(e) => onChange(e.target.value)}
        placeholder="HH:mm:ss"
      />

      {getBody()}
    </div>
  );
};

export default CustomTimePicker;
