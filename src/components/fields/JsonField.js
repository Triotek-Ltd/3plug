import React, { useState, useEffect } from "react";

const JsonField = ({ value = "", onChange, readOnly, preview, hidden }) => {
  const [jsonText, setJsonText] = useState(
    value ? JSON.stringify(value, null, 2) : ""
  );
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (value) {
      setJsonText(JSON.stringify(value, null, 2));
    }
  }, [value]);

  const handleJsonChange = (e) => {
    const inputText = e.target.value;
    setJsonText(inputText);

    try {
      const parsedJson = JSON.parse(inputText);
      setIsValid(true);
      onChange(parsedJson); // Pass the parsed JSON object to the parent component
    } catch (error) {
      setIsValid(false); // Invalid JSON input
      onChange(null); // Reset in the parent component if invalid
    }
  };

  return (
    <div className="w-full" hidden={hidden}>
      <textarea
        value={preview ? "" : jsonText} // In preview mode, do not display any value
        readOnly={readOnly || preview} // Make input readOnly in both readOnly and preview mode
        disabled={readOnly || preview}
        onChange={handleJsonChange}
        placeholder="Enter JSON here"
        className={`w-full p-3 text-sm focus:outline-none transition-all ${
          isValid ? "" : ""
        }`}
        rows={8}
      />
      {!isValid && (
        <p className="mt-2 text-sm text-red-500">Invalid JSON format</p>
      )}
    </div>
  );
};

export default JsonField;
