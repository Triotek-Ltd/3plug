import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const TableActions = ({
  handleAddRow,
  handleDeleteRows,
  handleCopyRows,
  selectedRows,
  field,
}) => {
  return (
    <div className="flex space-x-4 mt-2">
      {/* Add Row Button */}
      <button
        className="px-3 py-1 bg-gray-100 text-xs text-pink-700 rounded-md border border-pink-400 flex items-center hover:bg-pink-200 transition"
        onClick={handleAddRow}
      >
        <FontAwesomeIcon icon={faPlus} className="mr-1 text-pink-600" /> Add New
      </button>
      {selectedRows.length > 0 && !field?.is_section && (
        <>
          {/* Duplicate Button */}
          <button
            className="px-3 py-1 bg-blue-100 text-xs text-blue-800 rounded-md flex items-center hover:bg-blue-200 transition"
            onClick={handleCopyRows}
          >
            <FontAwesomeIcon icon={faCopy} className="mr-1 text-blue-600" />{" "}
            Duplicate
          </button>
          {/* Delete Button */}
          <button
            className="px-3 py-1 bg-red-100 text-xs text-red-800 rounded-md flex items-center hover:bg-red-200 transition"
            onClick={handleDeleteRows}
          >
            <FontAwesomeIcon icon={faTrash} className="mr-1 text-red-600" />{" "}
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default TableActions;
