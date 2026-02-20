import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // Import icons

const TextAreaField = ({
  value = "",
  onChange,
  readOnly,
  preview,
  hidden,
  handleInputChange,
  placeholder = "",
}) => {
  const [rows, setRows] = useState(8);

  const expand = () => setRows((prev) => prev + 4);
  const collapse = () => setRows((prev) => (prev > 4 ? prev - 4 : 4));

  return (
    <div className={`flex flex-col space-y-2 w-full ${hidden ? "hidden" : ""}`}>
      <textarea
        value={preview ? "" : value || ""}
        readOnly={readOnly || preview}
        disabled={readOnly || preview}
        onChange={handleInputChange || onChange}
        rows={rows}
        className="px-1 text-sm w-full focus:outline-none focus:ring-0 focus:border-none"
        placeholder={placeholder}
      />
      {!readOnly && !preview && (
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={expand}
            className="p-1 rounded hover:bg-gray-100"
            title="Expand"
          >
            <ChevronDown size={16} className="text-blue-500" />
          </button>
          <button
            type="button"
            onClick={collapse}
            className="p-1 rounded hover:bg-gray-100"
            title="Collapse"
          >
            <ChevronUp size={16} className="text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TextAreaField;
