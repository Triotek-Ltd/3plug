import LinkField from "@/components/fields/LinkField";
import React from "react";

const SettingLink = ({
  label,
  icon,
  value,
  onChange,
  options = [],
  className = "",
  description,
  item,
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
      <div className="p-1 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out">
        <LinkField field={item} value={value} onChange={onChange} />
      </div>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
};

export default SettingLink;
