import React from "react";

const IntField = ({ value, onChange, readOnly, preview, hidden }) => (
  <input
    type="number"
    value={preview ? "" : value || ""} // In preview mode, do not display any value
    readOnly={readOnly || preview} // Make input readOnly in both readOnly and preview mode
    disabled={readOnly || preview}
    onChange={onChange}
    placeholder="Enter Integer"
    hidden={hidden}
    className="p-1 text-xs bg-white rounded-md"
  />
);

export default IntField;
