import React from "react";

const PhoneField = ({ value = "", onChange, readOnly, preview, hidden }) => (
  <input
    type="tel"
    value={preview ? "" : value || ""} // In preview mode, do not display any value
    readOnly={readOnly || preview} // Make input readOnly in both readOnly and preview mode
    disabled={readOnly || preview}
    onChange={onChange}
    hidden={hidden}
    placeholder="Enter Phone Number"
    className="p-1 text-xs bg-white rounded-md"
  />
);

export default PhoneField;
