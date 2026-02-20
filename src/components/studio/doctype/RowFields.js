import { useConfig } from "@/contexts/ConfigContext";
import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const DraggableRow = ({
  field,
  index,
  moveRow,
  selected,
  onToggleSelect,
  updateField,
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
    <tr
      ref={(node) => dragRef(dropRef(node))}
      className={`border ${
        isDragging ? "opacity-50 bg-gray-200" : "hover:bg-gray-50"
      }`}
    >
      <td className="border px-2 py-1 text-center">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(field.fieldname)}
          className="cursor-pointer"
        />
      </td>
      <td
        ref={dragRef}
        className="border px-2 py-1 text-center cursor-move bg-gray-100"
      >
        <span className="inline-block w-4 h-4 bg-gray-400 rounded-sm"></span>
      </td>
      <td
        className="border px-4 py-2"
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => handleFieldEdit("label", e.target.textContent)}
      >
        {field.label || ""}
      </td>
      <td
        className="border px-4 py-2"
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => handleFieldEdit("fieldname", e.target.textContent)}
      >
        {field.fieldname || ""}
      </td>
      <td
        className="border px-4 py-2"
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => handleFieldEdit("default", e.target.textContent)}
      >
        {field.default || ""}
      </td>
      <td
        className="border px-4 py-2"
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) =>
          handleFieldEdit(
            "options",
            e.target.textContent.split(",").map((opt) => opt.trim())
          )
        }
      >
        {/* {field.options?.join(", ") || ""} */}
      </td>
    </tr>
  );
};

const DraggableTable = () => {
  const { localConfig, setLocalConfig } = useConfig();
  const [orderedFields, setOrderedFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);

  useEffect(() => {
    // Map field_order to fields
    const ordered = localConfig.field_order.map((fieldname) =>
      localConfig.fields.find((field) => field.fieldname === fieldname)
    );
    setOrderedFields(ordered);
  }, [localConfig]);

  const moveRow = (fromIndex, toIndex) => {
    const updatedFields = [...orderedFields];
    const [movedRow] = updatedFields.splice(fromIndex, 1);
    updatedFields.splice(toIndex, 0, movedRow);

    setOrderedFields(updatedFields);

    // Update the localConfig's field_order
    const updatedFieldOrder = updatedFields.map((field) => field.fieldname);
    setLocalConfig({ ...localConfig, field_order: updatedFieldOrder });
  };

  const updateField = (fieldname, updatedField) => {
    const updatedFields = localConfig.fields.map((field) =>
      field.fieldname === fieldname ? updatedField : field
    );
    setLocalConfig({ ...localConfig, fields: updatedFields });
  };

  const onToggleSelect = (fieldname) => {
    setSelectedFields((prevSelected) =>
      prevSelected.includes(fieldname)
        ? prevSelected.filter((f) => f !== fieldname)
        : [...prevSelected, fieldname]
    );
  };

  return (
    <div className="w-full bg-white rounded-md shadow-lg p-4">
      <DndProvider backend={HTML5Backend}>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center">Select</th>
              <th className="border px-4 py-2 text-center">Drag</th>
              <th className="border px-4 py-2">Label</th>
              <th className="border px-4 py-2">Fieldname</th>
              <th className="border px-4 py-2">Default</th>
              <th className="border px-4 py-2">Options</th>
            </tr>
          </thead>
          <tbody>
            {orderedFields.map((field, index) => (
              <DraggableRow
                key={field.fieldname}
                field={field}
                index={index}
                moveRow={moveRow}
                selected={selectedFields.includes(field.fieldname)}
                onToggleSelect={onToggleSelect}
                updateField={updateField}
              />
            ))}
          </tbody>
        </table>
      </DndProvider>
    </div>
  );
};

export default DraggableTable;
