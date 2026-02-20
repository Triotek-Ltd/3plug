import React from "react";

const MultiSelectView = ({ field, data }) => {
  const selectedValues = data[field.id] || [];
  return (
    <div className="">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
      </label>
      <div className="">
        {selectedValues.length > 0 ? (
          <div className="selected-options-list">
            <ul className="flex flex-wrap gap-2">
              {selectedValues.map((option, index) => (
                <li
                  key={index}
                  className="bg-purple-100 text-purple-700 py-1 px-3 rounded-full text-xs font-semibold shadow-sm"
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No options selected</p>
        )}
      </div>
    </div>
  );
};

export default MultiSelectView;
