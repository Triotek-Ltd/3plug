import React from "react";
import { motion } from "framer-motion";
import FieldInput from "./FieldInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faCopy } from "@fortawesome/free-solid-svg-icons";
import { toUnderscoreLowercase } from "@/utils/textConvert";

const TableRow = ({
  rowIndex,
  row,
  columnsData,
  selectedRows,
  setSelectedRows,
  handleCellChange,
  readOnly,
  preview,
  handleRowEdit,
  handleRowSelect,
  handleDeleteRow,
  handleDuplicateRow,
  getFieldDetails,
  configData,
}) => {
  const openFullForm = () => {
    if (configData?.name && row?.id) {
      window.open(
        `/app/${toUnderscoreLowercase(configData?.name)}/${row?.id}`,
        "_blank"
      );
    }
  };

  return (
    <motion.tr
      key={rowIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.1, ease: "easeInOut", delay: rowIndex * 0.1 }}
      className="bg-white shadow-sm hover:bg-gray-100"
    >
      <td className={`px-2 ${readOnly ? "hidden" : ""}`}>
        <input
          type="checkbox"
          checked={selectedRows.includes(rowIndex)}
          onChange={() => !readOnly && handleRowSelect(rowIndex)}
          readOnly={readOnly}
          className="form-checkbox text-center"
        />
      </td>
      <td className="text-center border-r-[1px] border-gray-200 border-b-[1px]">
        <span className="px-2 text-purple-900 ">{rowIndex + 1}</span>
      </td>
      <td className="text-center border-r-[1px] border-gray-200 border-b-[1px]  ">
        <span
          onClick={openFullForm}
          className="px-2 text-purple-900 cursor-pointer hover:text-purple-700"
        >
          {row?.id}
        </span>
      </td>
      {columnsData.map((column) => (
        <td
          key={column.fieldname}
          className="p-0 w-fit border-b-[1px] border-gray-400"
        >
          <FieldInput
            fieldname={column.fieldname}
            value={row[column.fieldname] || ""}
            onChange={(field, newValue) => {
              if (!readOnly) {
                handleCellChange(rowIndex, field.fieldname, newValue);
              }
            }}
            readOnly={readOnly}
            preview={preview}
            getFieldDetails={getFieldDetails}
          />
        </td>
      ))}
      <td className={`p-1 text-lg flex space-x-4 ${readOnly ? "hidden" : ""}`}>
        <button
          className="text-blue-500"
          onClick={() => handleRowEdit(rowIndex)}
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button
          className="text-green-500"
          onClick={() => handleDuplicateRow(rowIndex)}
        >
          <FontAwesomeIcon icon={faCopy} />
        </button>
        <button
          className="text-red-500"
          onClick={() => handleDeleteRow(rowIndex)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </td>
    </motion.tr>
  );
};

export default TableRow;
