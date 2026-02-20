// InputComponents.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";

const IconLabel = ({ icon, text }) => (
  <label className="block text-xs font-medium mb-1 flex items-center text-gray-600">
    <div className="flex items-center justify-center w-5 h-5 rounded bg-purple-100 mr-2">
      <FontAwesomeIcon icon={icon} className="text-purple-600 h-3 w-3" />
    </div>
    {text}
  </label>
);

export const TextInput = ({
  icon,
  label,
  value,
  onChange,
  placeholder,
  description,
}) => (
  <div>
    {icon && <IconLabel icon={icon} text={label} />}
    <input
      type="text"
      value={value || ""}
      onChange={onChange}
      className="mt-1 block w-full p-1.5 text-xs border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-300"
      placeholder={placeholder}
    />
    {description && (
      <div className="italic text-gray-600 text-xs">{description}</div>
    )}
  </div>
);

export const NumberInput = ({
  icon,
  label,
  value,
  onChange,
  placeholder,
  description,
}) => (
  <div>
    {icon && <IconLabel icon={icon} text={label} />}
    <input
      type="number"
      value={value || ""}
      onChange={onChange}
      className="mt-1 block w-full p-1.5 text-xs border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-300"
      placeholder={placeholder}
    />
    {description && (
      <div className="italic text-gray-600 text-xs">{description}</div>
    )}
  </div>
);

export const CheckboxInput = ({ label, value, onChange, description }) => (
  <div className="flex items-center mt-2">
    <input
      type="checkbox"
      checked={value || false}
      onChange={onChange}
      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
    />
    <span className="ml-2 text-xs text-gray-600">{label}</span>
    {description && (
      <div className="italic text-gray-600 text-xs">{description}</div>
    )}
  </div>
);

export const TextareaInput = ({
  icon,
  label,
  value,
  onChange,
  placeholder,
  description,
}) => (
  <div>
    {icon && <IconLabel icon={icon} text={label} />}
    <textarea
      value={value || ""}
      onChange={onChange}
      className="block w-full h-24 p-1.5 text-xs border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-purple-300"
      placeholder={placeholder}
    />
    {description && (
      <div className="italic text-gray-600 text-xs">{description}</div>
    )}
  </div>
);

export const SelectInput = ({
  icon,
  label,
  value,
  onChange,
  options,
  description,
}) => {
  // Map options to react-select format (if necessary)
  const formattedOptions = options.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  return (
    <div>
      {icon && <IconLabel icon={icon} text={label} />}
      <Select
        value={formattedOptions.find((option) => option.value === value)} // Set selected option based on the value
        onChange={(selectedOption) => onChange(selectedOption)} // Handle change event
        options={formattedOptions}
        className="mt-1 text-xs"
        classNamePrefix="react-select"
        isSearchable={true} // Enable search functionality if desired
        placeholder="Select..."
        // Custom styling for react-select (optional)
        styles={{
          control: (provided) => ({
            ...provided,
            borderColor: "#D1D5DB", // Tailwind gray-300
            borderRadius: "0.375rem", // Tailwind rounded-md
          }),
          menu: (provided) => ({
            ...provided,
            backgroundColor: "#FFFFFF", // White background for dropdown
          }),
          option: (provided) => ({
            ...provided,
            padding: "0.5rem", // Add padding for better clickability
            fontSize: "0.75rem", // Tailwind text-xs
          }),
        }}
      />
      {description && (
        <div className="italic text-gray-600 text-xs">{description}</div>
      )}
    </div>
  );
};
