export const getFieldsBeforeBreak = (
  config,
  lastField,
  breakType = "Column"
) => {
  if (!config?.fields || !config?.field_order || !lastField) {
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

  // Find the index of the lastField
  const lastFieldIndex = config.field_order.findIndex(
    (fieldname) => fieldname === lastField
  );

  // If lastField is not found in the order, return empty
  if (lastFieldIndex === -1) {
    return [];
  }

  // Collect fields before the lastField, stopping at a valid break
  const fieldsBefore = [];
  for (let i = lastFieldIndex - 1; i >= 0; i--) {
    const field = findField(config.field_order[i]);
    if (!field) continue;

    if (validBreakTypes.includes(field.fieldtype)) {
      break; // Stop at the first matching break type
    }

    fieldsBefore.unshift(field.fieldname); // Add field to the beginning
  }

  return fieldsBefore;
};
