import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPlus, faClone } from "@fortawesome/free-solid-svg-icons";

const ItemActions = ({ onDelete, onDuplicate, onAddField }) => {
  // Base button class for common styling
  const baseButtonClass = "transition-all text-xs items-center justify-center";

  return (
    <div className="flex space-x-1 items-center">
      {/* Delete Action */}

      {/* Add Field Action */}
      <button
        onClick={onAddField}
        className={`${baseButtonClass} text-slate-700 hover:text-slate-700 bg-transparent hover:bg-white p-1 rounded-md`}
        title="Add Field"
      >
        <FontAwesomeIcon icon={faPlus} size="lg" />
      </button>

      {/* Duplicate Action */}
      <button
        onClick={onDuplicate}
        className={`${baseButtonClass} text-slate-700 hover:text-slate-700 bg-transparent hover:bg-white p-1 rounded-md`}
        title="Duplicate Item"
      >
        <FontAwesomeIcon icon={faClone} size="lg" />
      </button>

      <button
        onClick={onDelete}
        className={`${baseButtonClass} text-red-600 hover:text-slate-700 bg-transparent hover:bg-white p-1 rounded-md`}
        title="Delete Item"
      >
        <FontAwesomeIcon icon={faTrashAlt} size="lg" />
      </button>
    </div>
  );
};

export default ItemActions;
