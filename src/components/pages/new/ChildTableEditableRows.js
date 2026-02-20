import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSave } from "@fortawesome/free-solid-svg-icons";
import TableTooltip from "@/components/tooltip/TableTooltip";

const ChildTableEditableRows = ({
  handleSelectionChange,
  selected,
  setSelected,
  handleSavingRow,
  handleAddingRow,
  type,
  columns,
  field,
}) => {
  const [newRow, setNewRow] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [originalRow, setOriginalRow] = useState({});

  const handleNewRowChange = (e, column) => {
    const value = e.target.value;
    setNewRow((prevRow) => ({
      ...prevRow,
      [column]: value,
    }));
  };

  const handleAddRow = () => {
    const updatedRows = [...selected, newRow];
    handleAddingRow(newRow);
    setNewRow({});
  };

  const handleEditRow = (index) => {
    setEditingIndex(index);
    setOriginalRow({ ...selected[index] });
    setNewRow({ ...selected[index] });
    document.querySelector(`tr[data-index="${index}"]`).scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const handleSaveRow = (index) => {
    const editedFields = Object.keys(newRow).reduce((acc, key) => {
      if (newRow[key] !== originalRow[key]) {
        acc[key] = newRow[key];
      }
      return acc;
    }, {});

    if (Object.keys(editedFields).length > 0) {
      // Update the selected row with new data
      const updatedRows = selected.map((row, i) =>
        i === index ? { ...row, ...editedFields } : row
      );
      setSelected(updatedRows);

      handleSavingRow(newRow.id, editedFields);
    }

    setEditingIndex(null);
    setNewRow({});
    setOriginalRow({});
  };

  const handleDeleteRow = (index) => {
    const updatedRows = selected.filter((_, i) => i !== index);
    handleSelectionChange(updatedRows);
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border mb-4">
      <div className="flex-auto p-4">
        <div className="relative z-1">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                {columns.map((column) => (
                  <th
                    key={column.id}
                    className="py-3 px-4 text-left text-sm font-medium text-gray-700"
                  >
                    <TableTooltip content={column.id || column.label}>
                      {column.label}
                    </TableTooltip>
                  </th>
                ))}
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                  <TableTooltip content="Actions that can be performed on the row">
                    Actions
                  </TableTooltip>
                </th>
              </tr>
            </thead>
            <tbody>
              {selected.map((row, index) => (
                <tr
                  key={index}
                  data-index={index}
                  className="border-b border-gray-200"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="py-2 px-4 text-sm text-gray-700"
                    >
                      {index === editingIndex ? (
                        <input
                          type={column.type || "text"}
                          value={newRow[column.key] || ""}
                          readOnly={column.key === "id"}
                          onChange={(e) => handleNewRowChange(e, column.key)}
                          className="h-8 p-2 w-full border-gray-300 rounded focus:ring-purple-500"
                        />
                      ) : (
                        row[column.key]
                      )}
                    </td>
                  ))}
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {index === editingIndex ? (
                      <button
                        type="button"
                        onClick={() => handleSaveRow(index)}
                        className="text-green-500 hover:text-green-700"
                      >
                        <FontAwesomeIcon icon={faSave} />
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleEditRow(index)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {editingIndex == null && (
                <tr>
                  {columns.map((column) => (
                    <td key={column.key} className="py-1 px-1 text-xs">
                      <input
                        type={column.type || "text"}
                        value={newRow[column.key] || ""}
                        readOnly={column.key === "id"}
                        onChange={(e) => handleNewRowChange(e, column.key)}
                        className="h-8 p-2 w-full border-gray-300 rounded focus:ring-purple-500 border-[1px] border-slate-100"
                      />
                    </td>
                  ))}
                  <td className="py-2 px-2 text-xs">
                    <button
                      type="button"
                      onClick={handleAddRow}
                      className="px-3 py-2 text-xs font-semibold text-white bg-purple-500 rounded-md hover:bg-purple-600"
                    >
                      Add
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChildTableEditableRows;
