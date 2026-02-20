import React from "react";

const CheckField = ({
  checked,
  value,
  onChange,
  readOnly,
  preview,
  hidden,
}) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={onChange}
    readOnly={readOnly || preview} // Make input readOnly in both readOnly and preview mode
    disabled={readOnly || preview}
    hidden={hidden}
    className="px-1 text-sm w-fit focus:outline-none focus:ring-0 focus:border-none"
  />
);

export default CheckField;
