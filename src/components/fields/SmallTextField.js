import React, { useState } from "react";

const SmallTextField = ({
  value = "",
  onChange,
  readOnly,
  preview,
  hidden,
  placeholder = "Enter text",
}) => {
  const [rows, setRows] = useState(8);

  const expand = () => setRows((prev) => prev + 4);
  const collapse = () => setRows((prev) => (prev > 4 ? prev - 4 : 4)); // Minimum 4 rows

  return (
    <div className={`flex flex-col space-y-2 ${hidden ? "hidden" : ""}`}>
      <label className="text-sm font-semibold text-gray-700">Small Text</label>
      <textarea
        value={preview ? "" : value}
        onChange={onChange}
        rows={rows}
        readOnly={readOnly || preview}
        disabled={readOnly || preview}
        className="px-2 py-1 text-sm w-full border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        placeholder={placeholder}
      />
      {!readOnly && !preview && (
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={expand}
            className="text-xs text-blue-500 underline"
          >
            Expand
          </button>
          <button
            type="button"
            onClick={collapse}
            className="text-xs text-red-500 underline"
          >
            Collapse
          </button>
        </div>
      )}
    </div>
  );
};

export default SmallTextField;
