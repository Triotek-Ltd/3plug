import React from "react";

const PercentField = ({ value = "", onChange, readOnly, preview, hidden }) => (
  <input
    type="number"
    value={preview ? "" : value || ""} // In preview mode, do not display any value
    readOnly={readOnly || preview} // Make input readOnly in both readOnly and preview mode
    disabled={readOnly || preview}
    hidden={hidden}
    onChange={onChange}
    placeholder="0%"
    className="p-1 text-xs bg-white rounded-md"
    min="0"
    max="100"
  />
);

export default PercentField;
