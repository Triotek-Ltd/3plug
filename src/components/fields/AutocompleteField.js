import React from "react";

const AutocompleteField = ({
  value,
  onChange,
  readOnly,
  preview,
  hidden,
  placeholder,
  options = [],
}) => (
  <>
    <input
      type="text"
      list="autocomplete-options"
      value={preview ? "" : value || ""} // In preview mode, do not display any value
      readOnly={readOnly || preview} // Make input readOnly in both readOnly and preview mode
      disabled={readOnly || preview}
      onChange={onChange}
      placeholder={placeholder}
      hidden={hidden}
      className="p-1 bg-white rounded-md"
    />
    <datalist id="autocomplete-options">
      {options.map((option, index) => (
        <option key={index} value={option} />
      ))}
    </datalist>
  </>
);

export default AutocompleteField;
