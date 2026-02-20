import React from "react";

const Select = ({
  label,
  icon,
  value,
  onChange,
  options = [],
  className = "",
  description,
  ...props
}) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label className="text-sm font-medium flex items-center text-gray-700">
          {icon && <span className="mr-2">{icon}</span>}
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`mt-1 p-2 border rounded focus:ring-0 text-sm ${className}`}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
};

export default Select;
