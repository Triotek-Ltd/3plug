import FieldRenderer from "./FieldRenderer";
import clsx from "clsx";
import React from "react";

const FieldInput = ({
  fieldname,
  value,
  onChange,
  readonly,
  preview,
  getFieldDetails,
}) => {
  const item = getFieldDetails(fieldname);

  return (
    <div
      className={clsx(
        "border-r-[1px] bg-white text-xs font-semibold p-1 border-gray-200",
        "focus-within:border-yellow-500  focus-within:border"
      )}
    >
      <FieldRenderer
        fieldtype={item.fieldtype}
        item={item}
        value={value}
        placeholder={item?.label}
        handleInputChange={onChange}
        minimal={true}
      />
    </div>
  );
};

export default FieldInput;
