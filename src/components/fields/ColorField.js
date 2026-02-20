import React from "react";

const ColorField = ({
  value,
  onChange,
  readOnly,
  preview,
  hidden,
  placeholder,
}) => (
  <input
    type="color"
    value={preview ? "" : value || ""} // In preview mode, do not display any value
    readOnly={readOnly || preview} // Make input readOnly in both readOnly and preview mode
    disabled={readOnly || preview}
    placeholder={placeholder}
    hidden={hidden}
    onChange={onChange}
    className="p-1 text-xs bg-white rounded-md"
  />
);

export default ColorField;
