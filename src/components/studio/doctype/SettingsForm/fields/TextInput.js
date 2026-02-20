import React from "react";

const TextInput = ({
  label,
  icon,
  value,
  onChange,
  placeholder = "",
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
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`mt-1 p-2 border rounded focus:ring-0 text-sm ${className}`}
        {...props}
      />
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
};

export default TextInput;
