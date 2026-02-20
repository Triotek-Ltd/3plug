import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { FaGripVertical, FaTrashAlt, FaPlus, FaCopy } from "react-icons/fa"; // FontAwesome Icons

const DraggableRow = ({
  field,
  index,
  moveRow,
  updateField,
  isSelected,
  handleCheckboxChange,
  handleAddRow,
  handleDuplicateRow,
  handleDeleteRow,
}) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: "ROW",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: "ROW",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveRow(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const handleFieldEdit = (key, value) => {
    updateField(field.fieldname, { ...field, [key]: value });
  };

  return (
    <div
      ref={(node) => dragRef(dropRef(node))}
      className={`grid grid-cols-12 items-center gap-2 px-3 py-1 border-b text-xs transition-all ${
        isDragging ? "bg-pink-50" : "hover:bg-gray-50"
      }`}
    >
      {/* Checkbox */}
      <div className="col-span-1 flex items-center justify-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => handleCheckboxChange(index)}
          className="form-checkbox w-4 h-4 text-purple-600 border-gray-300 rounded"
        />
      </div>

      {/* Drag Handle */}
      <div
        className="col-span-1 flex items-center justify-center cursor-move"
        ref={dragRef}
      >
        <FaGripVertical className="text-gray-500 hover:text-gray-700 text-lg" />
      </div>

      {/* Editable Label */}
      <div className="col-span-3">
        <input
          type="text"
          value={field.label || ""}
          onChange={(e) => handleFieldEdit("label", e.target.value)}
          className="w-full px-2 py-1 text-xs rounded outline-none ring-none focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Editable Fieldname */}
      <div className="col-span-3">
        <input
          type="text"
          value={field.fieldname || ""}
          onChange={(e) => handleFieldEdit("fieldname", e.target.value)}
          className="w-full px-2 py-1 text-xs rounded outline-none ring-none focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Editable Default */}
      <div className="col-span-2">
        <textarea
          value={field.default || ""}
          onChange={(e) => handleFieldEdit("default", e.target.value)}
          rows={1}
          className="w-full px-2 py-1 text-xs rounded outline-none ring-none focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Actions with Icons */}
      <div className="col-span-2 flex justify-center space-x-2">
        <button
          onClick={() => handleDeleteRow(index)}
          className="text-red-500 hover:text-red-600 p-1 rounded-full transition-all"
          aria-label="Delete Row"
        >
          <FaTrashAlt className="text-md" />
        </button>
        <button
          onClick={() => handleAddRow(index)}
          className="text-green-500 hover:text-green-600 p-1 rounded-full transition-all"
          aria-label="Add Row"
        >
          <FaPlus className="text-md" />
        </button>
        <button
          onClick={() => handleDuplicateRow(index)}
          className="text-blue-500 hover:text-blue-600 p-1 rounded-full transition-all"
          aria-label="Duplicate Row"
        >
          <FaCopy className="text-md" />
        </button>
      </div>
    </div>
  );
};

export default DraggableRow;
