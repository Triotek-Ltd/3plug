import React from "react";

const AdvancedSection = ({ item, handleInputChange }) => (
  <div className="p-4 bg-white border border-gray-200 rounded-lg grid gap-3 shadow-sm">
    {/* Mandatory Checkbox */}
    <div className="flex items-center text-sm">
      <label className="mr-3 text-gray-700">Mandatory</label>
      <input
        type="checkbox"
        checked={!!item.mandatory}
        onChange={(e) => handleInputChange("mandatory", e.target.checked, item)}
        className="form-checkbox text-purple-600 rounded focus:ring-purple-500"
      />
    </div>

    {/* Read Only Checkbox */}
    <div className="flex items-center text-sm">
      <label className="mr-3 text-gray-700">Read Only</label>
      <input
        type="checkbox"
        checked={!!item.readonly}
        onChange={(e) => handleInputChange("readonly", e.target.checked, item)}
        className="form-checkbox text-purple-600 rounded focus:ring-purple-500"
      />
    </div>

    {/* Unique Checkbox */}
    <div className="flex items-center text-sm">
      <label className="mr-3 text-gray-700">Unique</label>
      <input
        type="checkbox"
        checked={!!item.unique}
        onChange={(e) => handleInputChange("unique", e.target.checked, item)}
        className="form-checkbox text-purple-600 rounded focus:ring-purple-500"
      />
    </div>
  </div>
);

export default AdvancedSection;
