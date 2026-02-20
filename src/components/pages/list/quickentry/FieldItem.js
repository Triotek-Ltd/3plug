import React, { useRef } from "react";
import FieldRenderer from "@/components/pages/form/FieldRenderer";
import { useConfig } from "@/contexts/ConfigContext";

const FieldItem = ({ form, item, handleInputChange }) => {
  const ref = useRef(null);
  const { selectedItem, setSelectedItem } = useConfig();

  if (!item) {
    console.error(`Item is undefined`);
    return null;
  }
  const handleChange = (field, value) => {
    handleInputChange(field?.fieldname, value);
  };

  const fieldValue = form[item.fieldname] || null;
  const handleSelect = (e) => {
    e.stopPropagation();
    setSelectedItem(item);
  };

  return (
    <div
      ref={ref}
      className={`relative flex flex-col w-full break-words rounded-md font-medium text-[14px] px-1 text-gray-900 my-3  ${
        selectedItem?.fieldname === item?.fieldname
          ? "border-yellow-600"
          : "border-gray-300"
      } ${
        item.fieldtype === "Check" ||
        item.fieldtype === "Button" ||
        item.fieldtype === "Table"
          ? "border-none bg-transparent"
          : "border min-h-9 bg-white"
      } ${item?.hidden || (item?.read_only && !fieldValue) ? "hidden" : ""}`}
      onClick={handleSelect}
    >
      <FieldRenderer
        fieldtype={item.fieldtype}
        item={item}
        value={fieldValue}
        placeholder={item?.label}
        handleInputChange={handleChange} // Pass fieldname and value
        label={item.label}
      />
    </div>
  );
};

export default FieldItem;
