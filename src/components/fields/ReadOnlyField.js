import React from "react";

const ReadOnlyField = ({ value = "", onChange, readOnly, preview, hidden }) => {
  return (
    <div className="flex flex-col space-y-2" hidden={hidden}>
      <label className="text-sm font-semibold text-gray-700">
        Read Only Field
      </label>
      <input
        type="text"
        value={value || ""}
        readOnly
        className="w-full p-2 text-sm border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
      />
    </div>
  );
};

export default ReadOnlyField;
