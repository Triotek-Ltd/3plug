import React from "react";

const CurrencyField = ({ value, onChange, readOnly, preview, hidden }) => (
  <input
    type="number"
    value={preview ? "" : value || ""} // In preview mode, do not display any value
    readOnly={readOnly || preview} // Make input readOnly in both readOnly and preview mode
    disabled={readOnly || preview}
    onChange={onChange}
    placeholder="$0.00"
    hidden={hidden}
    className="p-1 bg-white rounded-md"
  />
);

export default CurrencyField;
