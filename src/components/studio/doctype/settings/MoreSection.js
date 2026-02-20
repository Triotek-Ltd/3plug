import React from "react";

const MoreSection = ({ item, handleInputChange }) => (
  <div className="p-4 bg-white border border-gray-200 rounded-lg grid gap-3 shadow-sm">
    {/* Default Value */}
    <div className="text-sm mb-2">
      <label className="block font-medium text-gray-700 mb-1">
        Default Value
      </label>
      <input
        type="text"
        value={item.default || ""}
        onChange={(e) => handleInputChange("default", e.target.value, item)}
        className="block w-full p-2 border border-gray-300 rounded text-gray-800 focus:border-purple-500 focus:ring-purple-500"
        placeholder="Enter default value"
      />
    </div>

    {/* Description */}
    <div className="text-sm mb-2">
      <label className="block font-medium text-gray-700 mb-1">
        Description
      </label>
      <textarea
        value={item.description || ""}
        onChange={(e) => handleInputChange("description", e.target.value, item)}
        className="block w-full p-2 border border-gray-300 rounded text-gray-800 focus:border-purple-500 focus:ring-purple-500"
        placeholder="Enter description"
        rows="3"
      />
    </div>
  </div>
);

export default MoreSection;
