import React from "react";

const Checkbox = ({
  label,
  checked,
  onChange,
  className = "",
  description,
  ...props
}) => {
  return (
    <div className="flex flex-col items-start space-y-1">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={`h-4 w-4 rounded focus:ring-0 ${className}`}
          {...props}
        />
        {label && (
          <label className="text-sm font-medium text-gray-700">{label}</label>
        )}
      </div>
      {description && (
        <p className="text-xs text-gray-500 ml-6">{description}</p>
      )}
    </div>
  );
};

export default Checkbox;
