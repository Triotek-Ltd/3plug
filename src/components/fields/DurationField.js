import React, { useState } from "react";

const DurationField = ({ value, onChange, readOnly, preview, hidden }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [internalValue, setInternalValue] = useState(value || 0);
  const [displayValue, setDisplayValue] = useState(formatDuration(value));
  const [error, setError] = useState("");

  // Convert seconds to a readable format
  function formatDuration(seconds) {
    if (!seconds || seconds < 0) return "0s";
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d ? d + "d " : ""}${h ? h + "h " : ""}${m ? m + "m " : ""}${
      s ? s + "s" : ""
    }`.trim();
  }

  // Parse user input into total seconds
  function parseDuration(input) {
    const regex = /(\d+)([dhms])/g;
    let match;
    let totalSeconds = 0;

    while ((match = regex.exec(input))) {
      const num = parseInt(match[1], 10);
      const unit = match[2];

      if (unit === "d") totalSeconds += num * 86400;
      else if (unit === "h") totalSeconds += num * 3600;
      else if (unit === "m") totalSeconds += num * 60;
      else if (unit === "s") totalSeconds += num;
    }

    return totalSeconds;
  }

  // Handle input change
  const handleInputChange = (e) => {
    const input = e.target.value.trim();
    setDisplayValue(input);

    const parsedSeconds = parseDuration(input);

    if (parsedSeconds > 0) {
      setError(null);
      setInternalValue(parsedSeconds);
      onChange(parsedSeconds);
    } else {
      setError("Invalid format (e.g., 2d 4h 30m 20s)");
    }
  };

  return (
    <div className={`relative p-1 w-full ${hidden ? "hidden" : ""}`}>
      <input
        type="text"
        value={preview ? "" : displayValue}
        readOnly={readOnly}
        onChange={handleInputChange}
        onClick={() => !readOnly && setShowPopup(true)}
        placeholder="Enter Duration (e.g., 2d 4h 30m 20s)"
        className={`bg-white rounded-md w-full focus:outline-none ${
          error ? "border border-red-500 p-2" : ""
        }`}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}

      {showPopup && (
        <DurationPopup
          value={internalValue}
          onSave={(totalSeconds) => {
            setDisplayValue(formatDuration(totalSeconds));
            setInternalValue(totalSeconds);
            onChange(totalSeconds);
            setShowPopup(false);
            setError(null);
          }}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

const DurationPopup = ({ value, onSave, onClose }) => {
  const totalSeconds = value || 0;
  const [days, setDays] = useState(Math.floor(totalSeconds / 86400));
  const [hours, setHours] = useState(Math.floor((totalSeconds % 86400) / 3600));
  const [minutes, setMinutes] = useState(
    Math.floor((totalSeconds % 3600) / 60)
  );
  const [seconds, setSeconds] = useState(totalSeconds % 60);
  const [error, setError] = useState("");

  const handleSave = () => {
    const total = days * 86400 + hours * 3600 + minutes * 60 + seconds;
    if (total < 0) {
      setError("Duration cannot be negative");
    } else {
      setError("");
      onSave(total);
    }
  };

  return (
    <div className="absolute top-full left-0 mt-2 p-4 bg-white shadow-lg rounded-md z-10 border border-gray-300">
      <div className="grid grid-cols-4 gap-2">
        <div className="flex flex-col items-center">
          <input
            type="number"
            value={days}
            onChange={(e) =>
              setDays(Math.max(0, parseInt(e.target.value) || 0))
            }
            placeholder="0"
            className="p-1 w-16 border rounded-md text-center"
          />
          <span className="text-sm text-gray-600">Days</span>
        </div>
        <div className="flex flex-col items-center">
          <input
            type="number"
            value={hours}
            onChange={(e) =>
              setHours(Math.max(0, parseInt(e.target.value) || 0))
            }
            placeholder="0"
            className="p-1 w-16 border rounded-md text-center"
          />
          <span className="text-sm text-gray-600">Hours</span>
        </div>
        <div className="flex flex-col items-center">
          <input
            type="number"
            value={minutes}
            onChange={(e) =>
              setMinutes(Math.max(0, parseInt(e.target.value) || 0))
            }
            placeholder="0"
            className="p-1 w-16 border rounded-md text-center"
          />
          <span className="text-sm text-gray-600">Minutes</span>
        </div>
        <div className="flex flex-col items-center">
          <input
            type="number"
            value={seconds}
            onChange={(e) =>
              setSeconds(Math.max(0, parseInt(e.target.value) || 0))
            }
            placeholder="0"
            className="p-1 w-16 border rounded-md text-center"
          />
          <span className="text-sm text-gray-600">Seconds</span>
        </div>
      </div>
      {error && <span className="text-red-500 text-sm">{error}</span>}
      <div className="mt-2 flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default DurationField;
