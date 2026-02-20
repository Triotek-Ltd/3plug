import React from "react";
import DraggableRow from "./DraggableRow";

const TableBody = ({
  orderedFields,
  selectedIndices,
  toggleSelect,
  moveRow,
  updateField,
}) => (
  <tbody>
    {orderedFields.map((field, index) => (
      <DraggableRow
        key={field.fieldname}
        field={field}
        index={index}
        moveRow={moveRow}
        isSelected={selectedIndices.includes(index)}
        toggleSelect={toggleSelect}
        updateField={updateField}
        selectedIndices={selectedIndices}
        value={field.fieldname}
      />
    ))}
  </tbody>
);

export default TableBody;
