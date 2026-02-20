// MultiSelect.js
import React from "react";
import Select from "react-select";

const MultiSelect = ({
  name,
  options,
  handleChange,
  placeholder,
  value,
  readOnly,
  hidden,
}) => {
  if (hidden) return null;

  const handleMultiSelectChange = (selectedOptions) => {
    handleChange(
      name,
      selectedOptions ? selectedOptions.map((option) => option.value) : [],
      "multiselect"
    );
  };

  const selectedValues = options.filter((option) => value.includes(option));

  return (
    <div>
      <Select
        isMulti
        name={name}
        options={options.map((option) => ({
          value: option,
          label: option,
        }))}
        value={selectedValues.map((option) => ({
          value: option,
          label: option,
        }))}
        onChange={handleMultiSelectChange}
        placeholder={placeholder}
        isDisabled={readOnly}
        className="basic-multi-select text-xs"
        classNamePrefix="select"
      />
      <div className="mt-4">
        {selectedValues.length > 0 && (
          <div className="selected-options-list">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Selected Options:
            </p>
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
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
