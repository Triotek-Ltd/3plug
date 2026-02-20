import { getFieldsAfterBreak } from "./getFieldsAfterBreak";

// Helper to extract field names
const getFieldName = (item) => {
  if (Array.isArray(item)) {
    return item[0].fieldname || item[0].id;
  }
  return item?.fieldname || item?.id || item;
};

// Generic move function
export const moveItem = (
  draggedItem,
  targetItem,
  localConfig,
  moveAfter = false
) => {
  const draggedFieldName = getFieldName(draggedItem);
  const targetFieldName = getFieldName(targetItem);

  const draggedItemIndex = localConfig.field_order.indexOf(draggedFieldName);
  const targetItemIndex = localConfig.field_order.indexOf(targetFieldName);

  if (draggedItemIndex === -1 || targetItemIndex === -1) {
    return { success: false, error: "Field not found in field_order" };
  }

  const updatedFieldOrder = [...localConfig.field_order];
  updatedFieldOrder.splice(draggedItemIndex, 1);

  const newTargetIndex = moveAfter
    ? targetItemIndex + 1
    : targetItemIndex > draggedItemIndex
    ? targetItemIndex - 1
    : targetItemIndex;

  updatedFieldOrder.splice(newTargetIndex, 0, draggedFieldName);
  return { ...localConfig, field_order: updatedFieldOrder };
};

// Move column items
export const moveColumn = (draggedItem, targetItem, localConfig) => {
  return moveGroupedItems(draggedItem, targetItem, localConfig, "Column");
};

// Move section items
export const moveSection = (draggedItem, targetItem, localConfig) => {
  return moveGroupedItems(draggedItem, targetItem, localConfig, "Section");
};

// Move tab items
export const moveTab = (draggedItem, targetItem, localConfig) => {
  return moveGroupedItems(draggedItem, targetItem, localConfig, "Tab");
};

const moveGroupedItems1 = (draggedItem, targetItem, localConfig, breakType) => {
  const draggedFieldName = getFieldName(draggedItem);
  const targetFieldName = getFieldName(targetItem);

  const draggedItemIndex = localConfig.field_order.indexOf(draggedFieldName);
  const targetItemIndex = localConfig.field_order.indexOf(targetFieldName);

  if (draggedItemIndex === -1 || targetItemIndex === -1) {
    return { success: false, error: "Field not found in field_order" };
  }

  const updatedFieldOrder = [...localConfig.field_order];

  // Use getFieldsAfterBreak to collect fields to move
  const draggedItemsToMove = [
    draggedFieldName,
    ...getFieldsAfterBreak(localConfig, draggedFieldName, breakType),
  ];

  // Remove the dragged items from their current positions
  draggedItemsToMove.forEach((fieldname) => {
    const index = updatedFieldOrder.indexOf(fieldname);
    if (index !== -1) {
      updatedFieldOrder.splice(index, 1);
    }
  });

  // Insert the dragged items immediately above the targetFieldName
  const insertIndex = updatedFieldOrder.indexOf(targetFieldName);

  // If insertIndex is valid, splice the items above the target
  if (insertIndex !== -1) {
    updatedFieldOrder.splice(insertIndex, 0, ...draggedItemsToMove);
  }

  return { ...localConfig, field_order: updatedFieldOrder };
};

// Function to move multiple fields relative to a target field
export const moveGroupedItems = (
  fieldsToMove,
  targetField,
  localConfig,
  moveAbove = true // Default to moving above the target field
) => {
  const fieldOrder = [...localConfig.field_order];

  // Extract field names to move and the target field name
  const fieldNamesToMove = fieldsToMove.map(getFieldName);
  const targetFieldName = getFieldName(targetField);

  // Validate all fields are in field_order
  if (fieldNamesToMove.some((field) => !fieldOrder.includes(field))) {
    return {
      success: false,
      error: "Some fields to move are not in field_order",
    };
  }
  if (!fieldOrder.includes(targetFieldName)) {
    return { success: false, error: "Target field not found in field_order" };
  }

  // Remove the fields to move from the field order
  const updatedFieldOrder = fieldOrder.filter(
    (field) => !fieldNamesToMove.includes(field)
  );

  // Find the index of the target field in the updated field order
  const targetIndex = updatedFieldOrder.indexOf(targetFieldName);

  if (targetIndex === -1) {
    return { success: false, error: "Target field index not found" };
  }

  // Calculate the insertion index based on moveAbove flag
  const insertionIndex = moveAbove ? targetIndex : targetIndex + 1;

  // Insert the fields to move at the calculated index
  updatedFieldOrder.splice(insertionIndex, 0, ...fieldNamesToMove);

  // Return the updated localConfig with the new field order
  return { ...localConfig, field_order: updatedFieldOrder };
};
