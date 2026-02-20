import React from "react";

const DynamicLinkField = ({ value, onChange, readOnly, preview, hidden }) => (
  <input
    type="url"
    value={preview ? "" : value || ""} // In preview mode, do not display any value
    readOnly={readOnly || preview} // Make input readOnly in both readOnly and preview mode
    disabled={readOnly || preview}
    onChange={onChange}
    hidden={hidden}
    placeholder="Enter URL"
    className="p-1 bg-white rounded-md"
  />
);

export default DynamicLinkField;
