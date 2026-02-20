import FieldRenderer from "./FieldRenderer";
import clsx from "clsx";
import React from "react";

const FieldInput = ({
  fieldname,
  value,
  onChange,
  readOnly,
  preview,
  getFieldDetails,
}) => {
  const item = getFieldDetails(fieldname);
  if(item?.fieldtype in ["Table", "Table MultiSelect", "MultiSelect", "Connection", "Image", "QR Code", "Attach", "Attach Image"] ) {
    return
  }

  return (
    <div
      className={clsx(
        "border-r-[1px] bg-white text-[14px] font-semibold p-1 border-gray-200",
        "focus-within:border-yellow-500  focus-within:border"
      )}
      readOnly={readOnly}
      tabIndex={readOnly ? -1 : 0}
    >
      <FieldRenderer
        fieldtype={item.fieldtype}
        item={item}
        value={value}
        placeholder={item?.label}
        handleInputChange={onChange}
        minimal={true}
        readOnly={readOnly}
      />
    </div>
  );
};

export default FieldInput;
