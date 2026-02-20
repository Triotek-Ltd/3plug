import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const QuickEntryActions = ({
  handleAddRow,
  handleDeleteRows,
  handleCopyRows,
  selectedRows,
}) => {
  return (
    <div className="flex space-x-4 mt-2">
      {/* Add Row Button */}
      <button
        className="px-3 py-1 bg-gray-200 text-xs text-gray-800 rounded-md flex items-center hover:bg-gray-300 transition"
        onClick={handleAddRow}
      >
        <FontAwesomeIcon icon={faPlus} className="mr-1 text-gray-600" /> Add Row
      </button>
      {selectedRows.length > 0 && (
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

export default QuickEntryActions;
