export const getFieldsAfterBreak = (
  config,
  startField,
  breakType = "Column",
  includeStartField = false // Default condition to include startField
) => {
  if (!config?.fields || !config?.field_order || !startField) {
    return [];
  }

  const findField = (fieldname) =>
    config.fields.find((field) => field.fieldname === fieldname);

  // Define the break types for each level
  const breakTypes = {
    Column: ["Tab Break", "Section Break", "Column Break"],
    Section: ["Tab Break", "Section Break"],
    Tab: ["Tab Break"],
  };

  // Determine valid break types based on the parameter
  const validBreakTypes = breakTypes[breakType] || [];

  // Find the index of the startField
  const startFieldIndex = config.field_order.findIndex(
    (fieldname) => fieldname === startField
  );

  // If startField is not found in the order, return empty
  if (startFieldIndex === -1) {
    return [];
  }

  const fieldsAfter = [];

  // Optionally include the startField
  if (includeStartField) {
    const startFieldObj = findField(startField);
    if (startFieldObj) {
      fieldsAfter.push(startFieldObj.fieldname);
    }
  }

  // Collect fields after the startField, stopping at a valid break
  for (let i = startFieldIndex + 1; i < config.field_order.length; i++) {
    const field = findField(config.field_order[i]);
    if (!field) continue;

    if (validBreakTypes.includes(field.fieldtype)) {
      break; // Stop at the first matching break type
    }

    fieldsAfter.push(field.fieldname); // Add field to the end
  }

  return fieldsAfter;
};

// Alias for columns, reusing the updated function
export const getColumnFields = (
  config,
  startField,
  includeStartField = true
) => {
  return getFieldsAfterBreak(config, startField, "Column", includeStartField);
};
