import React from "react";

const AttachField = ({ value, onChange, readOnly, preview, hidden }) => (
  <input
    type="file"
    value={preview ? "" : value} // In preview mode, do not display any value
    readOnly={readOnly || preview} // Make input readOnly in both readOnly and preview mode
    disabled={readOnly || preview}
    onChange={onChange}
    hidden={hidden}
    className="px-1 w-full focus:outline-none focus:ring-0 focus:border-none"
  />
);

export default AttachField;
