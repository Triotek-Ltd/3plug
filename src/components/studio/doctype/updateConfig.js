import { generateTabStructure } from "./utils/generateTabStructure";

export const updateConfig = (config) => {
  const structure = generateTabStructure(config);

  const updatedFields = [...(config?.fields || [])];

  const updatedFieldOrder = [];

  const addFieldToOrder = (field) => {
    if (!updatedFieldOrder.includes(field.fieldname)) {
      updatedFieldOrder.push(field.fieldname);
    }
  };

  // Traverse through the structure to update `updatedFields` and `updatedFieldOrder` in the required strict sequence.
  structure.forEach((tab) => {
    // Add tab itself to updatedFields and field order
    if (!updatedFields.some((f) => f.fieldname === tab.fieldname)) {
      updatedFields.push(tab);
    }
    addFieldToOrder(tab);

    tab.sections.forEach((section) => {
      // Add section to updatedFields and field order
      if (!updatedFields.some((f) => f.fieldname === section.fieldname)) {
        updatedFields.push(section);
      }
      addFieldToOrder(section);

      section.columns.forEach((column) => {
        // Add column to updatedFields and field order
        if (!updatedFields.some((f) => f.fieldname === column.fieldname)) {
          updatedFields.push(column);
        }
        addFieldToOrder(column);

        // Add each field in the column in strict order
        column.fields.forEach((field) => {
          if (!updatedFields.some((f) => f.fieldname === field.fieldname)) {
            updatedFields.push(field);
          }
          addFieldToOrder(field);
        });
      });
    });
  });

  return {
    ...config,
    fields: updatedFields,
    field_order: updatedFieldOrder,
  };
};
