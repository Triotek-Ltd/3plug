import React, { useState } from "react";
import TableField from "./TableField";
import LinkField from "./LinkField";
import LinkSelectField from "./LinkSelectField";

const TableMultiSelectField = ({
  value = [],
  field,
  readOnly,
  preview,
  hidden,
  handleInputChange,
  ordered = false,
}) => {
  const [optionValue, setOptionValue] = useState(
    value ? value?.map((option) => ({
      value: option?.id,
      label: option?.id,
      fullData: option,
    })) : null
  );

  return (
    <div className="flex flex-col space-y-4 py-2 w-full" hidden={hidden}>
      <div
        className={`relative flex flex-col w-full break-words rounded-md font-bold text-[14px]`}
      >
        <LinkSelectField
          field={field}
          value={optionValue}
          onValueChange={(e) => setOptionValue(e)}
          onChange={(e) => handleInputChange(e)}
        />
      </div>

      <TableField field={field} value={value} readOnly={true} />
    </div>
  );
};

export default TableMultiSelectField;
