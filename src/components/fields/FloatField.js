import React from "react";

const FloatField = ({ value = "", onChange, readOnly, preview, hidden }) => (
  <input
    type="number"
    step="0.01"
    value={preview ? "" : value || ""} // In preview mode, do not display any value
    readOnly={readOnly || preview} // Make input readOnly in both readOnly and preview mode
    disabled={readOnly || preview}
    onChange={onChange}
    hidden={hidden}
    placeholder="Enter Float Value"
    className="p-1 text-xs bg-white rounded-md"
  />
);

export default FloatField;
