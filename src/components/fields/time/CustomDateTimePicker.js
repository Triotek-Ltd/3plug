import React, { useState, useEffect, useRef } from "react";
import Clock from "./Clock";
import PrimaryButton from "@/components/core/common/buttons/Primary";
import CustomDateSelector from "./CustomDateSelector";
import PrimaryButton1 from "@/components/core/common/buttons/Primary1";
import SecondaryButton from "@/components/core/common/buttons/Secondary";

const formatDateTimeDisplay = (dateInput) => {
  // Check if the input is a valid Date object
  if (dateInput instanceof Date && !isNaN(dateInput)) {
    const day = String(dateInput.getDate()).padStart(2, "0");
    const month = String(dateInput.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = dateInput.getFullYear();
    const hours = String(dateInput.getHours()).padStart(2, "0");
    const minutes = String(dateInput.getMinutes()).padStart(2, "0");
    const seconds = String(dateInput.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  // If it's not a valid Date object, return the input as is (could be a string)
  return dateInput;
};

// Function to parse input in 'dd-mm-yyyy hh:mm:ss' format
const parseDateTimeInput = (inputStr) => {
  const regex = /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
  const match = inputStr.match(regex);

  if (match) {
    const [, day, month, year, hour, minute, second] = match;
    const date = new Date(
      `${year}-${month}-${day}T${hour}:${minute}:${second}`
    );
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
};

const CustomDateTimePicker = ({
  value, // Default to the current date if not provided
  onChange,
  readOnly,
  hidden,
  placeholder,
  includeDate = true,
}) => {
  // Ensure the initial value is a Date object

  const initialDate = value ? new Date(value) : new Date();
  const dateDisplay =
    value && typeof value === "string" && value.endsWith("Z")
      ? new Date(value)
      : value;

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [hour, setHour] = useState(initialDate?.getHours());
  const [minute, setMinute] = useState(initialDate?.getMinutes());
  const [isAmSelected, setIsAmSelected] = useState(hour < 12);
  const [showMinuteSelection, setShowMinuteSelection] = useState(false);
  const [toShow, setToShow] = useState(false);

  const pickerRef = useRef(null); // Reference to the time picker modal

  useEffect(() => {
    if (value) {
      setSelectedDate(initialDate);
      setHour(initialDate?.getHours());
      setMinute(initialDate?.getMinutes());
      setIsAmSelected(initialDate?.getHours() < 12);
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
    setToShow(true);
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
    let finalHour = isAmSelected ? hour : (hour % 12) + 12;

    // Update the selectedDate with the new time
    const updatedDate = new Date(selectedDate);
    updatedDate.setHours(finalHour);
    updatedDate.setMinutes(minute);
    updatedDate.setSeconds(0);

    setSelectedDate(updatedDate);
    onChange(updatedDate);
  };

  const updateDate = (date) => {
    let finalHour = isAmSelected ? hour : (hour % 12) + 12;
    const updatedDate = new Date(date);
    updatedDate.setHours(finalHour);
    updatedDate.setMinutes(minute);
    updatedDate.setSeconds(0);

    onChange(updatedDate); // Pass the updated Date object to the parent
  };

  const resetTime = () => {
    const currentTime = new Date();
    setSelectedDate(currentTime);
    setHour(currentTime.getHours() % 12);
    setMinute(currentTime.getMinutes());
    setIsAmSelected(currentTime.getHours() < 12);
    onChange(currentTime); // Reset to the current time
  };

  const getBody = () => {
    if (!toShow) return null;

    return (
      <div
        className="absolute top-12 z-1 flex justify-center items-center"
        style={{ zIndex: 900 }}
      >
        <div
          ref={pickerRef} // Attach the ref to the modal container
          className="bg-white rounded-lg p-5 shadow-lg w-[350px] sm:w-[400px]"
        >
          <div className="p-1 mb-2 w-full border border-gray-400 rounded focus:outline-none focus:ring-0 focus:border-yellow-500">
            {includeDate && (
              <CustomDateSelector
                selectedDate={selectedDate}
                onChange={(date) => updateDate(date)}
              />
            )}
          </div>
          <header className="flex justify-between items-center bg-gray-100 p-1 rounded shadow-md">
            <div className="flex items-center jstify-center text-center space-x-1">
              <input
                className={`text-base text-center rounded cursor-pointer w-10 ${
                  showMinuteSelection
                    ? "text-gray-600"
                    : "font-bold text-purple-900"
                }`}
                onClick={() => setShowMinuteSelection(false)}
                value={hour}
                onChange={(e) => handleHourSelect(e.target.value)}
              ></input>
              <span className="text-lg text-center font-semibold text-gray-700 mx-2">
                :
              </span>
              <input
                className={`text-base text-center rounded cursor-pointer w-10 ${
                  !showMinuteSelection
                    ? "text-gray-600"
                    : "font-bold text-purple-900"
                }`}
                onClick={() => setShowMinuteSelection(true)}
                value={minute}
                onChange={(e) => handleMinuteSelect(e.target.value)}
              ></input>
            </div>
            <div className="flex space-x-1">
              <div
                onClick={() => setIsAmSelected(true)}
                className={`cursor-pointer text-xs font-medium px-3 py-1 rounded-md ${
                  isAmSelected ? "bg-indigo-500 text-white" : "bg-gray-300"
                }`}
              >
                AM
              </div>
              <div
                onClick={() => setIsAmSelected(false)}
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
            <div className="flex flex-row space-x-2 justify-end items-center">
              <PrimaryButton text={"Reset"} onClick={resetTime} />
              <SecondaryButton
                className={"px-8"}
                text={"Set"}
                onClick={() => setToShow(false)}
              />
            </div>
          </footer>
        </div>
      </div>
    );
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    console.log(inputValue);

    // Attempt to parse the input as a valid date-time string
    const parsedDate = parseDateTimeInput(inputValue);

    // If the input is valid, update the displayed value and main date
    if (parsedDate) {
      setSelectedDate(parsedDate); // Update main date value
      onChange(parsedDate); // Pass the updated date to the parent
    } else {
      // If the input is invalid, only update the display value
      setSelectedDate(inputValue); // This only updates the display value
    }
  };

  return (
    <div
      className="relative flex flex-row w-full mt-4"
      readOnly={readOnly}
      hidden={hidden}
    >
      <input
        className="!w-full px-2 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:border-none focus:ring-0 bg-transparent"
        value={value ? formatDateTimeDisplay(selectedDate) : dateDisplay}
        onChange={handleInputChange}
        onFocus={handleIconClick}
        placeholder="DD-MM-YYYY HH:mm:ss"
      />
      {getBody()}
    </div>
  );
};

export default CustomDateTimePicker;
