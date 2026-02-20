import React from "react";

const LongTextField = ({ value = "", onChange, readOnly, preview, hidden }) => (
  <textarea
    value={preview ? "" : value || ""} // In preview mode, do not display any value
    readOnly={readOnly || preview} // Make input readOnly in both readOnly and preview mode
    disabled={readOnly || preview}
    hidden={hidden}
    onChange={onChange}
    rows="3"
    className="p-1 bg-white rounded-md w-full"
    placeholder="Enter long text..."
  />
);

export default LongTextField;
