import React from "react";

const DataField = ({
  value = "",
  onChange,
  readOnly,
  preview,
  placeholder,
  hidden,
}) => (
  <input
    type="text"
    value={preview ? "" : value ? value : ""} // In preview mode, do not display any value
    readOnly={readOnly || preview} // Make input readOnly in both readOnly and preview mode
    disabled={readOnly || preview}
    onChange={onChange}
    placeholder={placeholder}
    hidden={hidden}
    className="p-1 bg-white rounded-md w-full focus:outline-none focus:ring-0 focus:border-none"
  />
);

export default DataField;
