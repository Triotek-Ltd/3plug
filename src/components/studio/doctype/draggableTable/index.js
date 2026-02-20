import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableRow from "./DraggableRow";
import { useConfig } from "@/contexts/ConfigContext";

const DraggableTable = () => {
  const { localConfig, setLocalConfig, selectedItem, setSelectedItem } =
    useConfig();
  const [orderedFields, setOrderedFields] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // Function to toggle selection of a row
  const handleCheckboxChange = (index) => {
    setSelectedRows(
      (prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index) // Deselect if already selected
          : [...prev, index] // Select if not selected
    );
  };

  useEffect(() => {
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

    const updatedFieldOrder = updatedFields.map((field) => field.fieldname);
    setLocalConfig({ ...localConfig, field_order: updatedFieldOrder });
  };

  const updateField = (fieldname, updatedField) => {
    const updatedFields = localConfig.fields.map((field) =>
      field.fieldname === fieldname ? updatedField : field
    );
    setLocalConfig({ ...localConfig, fields: updatedFields });
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-x-auto">
      <DndProvider backend={HTML5Backend}>
        {orderedFields.map((field, index) => (
          <div
            className={`${selectedItem == field ? "bg-purple-50" : ""}`}
            onClick={() => setSelectedItem(field)}
          >
            <DraggableRow
              key={field.fieldname}
              field={field}
              index={index}
              moveRow={moveRow}
              updateField={updateField}
              isSelected={selectedRows.includes(index)} // Pass isSelected to each row
              handleCheckboxChange={handleCheckboxChange} // Handle checkbox change here
            />
          </div>
        ))}
      </DndProvider>
    </div>
  );
};

export default DraggableTable;
