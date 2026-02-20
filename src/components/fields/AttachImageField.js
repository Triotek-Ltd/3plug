import React from "react";

const AttachImageField = ({ value, onChange, readOnly, preview, hidden }) => (
  <input
    type="file"
    accept="image/*"
    onChange={onChange}
    hidden={hidden}
    readOnly={readOnly || preview} // Make input readOnly in both readOnly and preview mode
    disabled={readOnly || preview}
    className="p-1 text-xs bg-white rounded-md"
  />
);

export default AttachImageField;
