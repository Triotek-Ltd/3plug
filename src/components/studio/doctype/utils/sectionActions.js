/**
 * Generates a unique fieldname using a prefix and random string.
 * @param {string} prefix - The prefix for the fieldname (e.g., "section", "column").
 * @returns {string} - A unique fieldname.
 */
const generateUniqueFieldname = (prefix) => {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Adds a new section above the specified section.
 * @param {object} config - The current configuration object.
 * @param {object} section - The section to add above.
 * @returns {object} - The updated configuration object.
 */
export const addSectionAbove = (config, section) => {
  const index = config.field_order.indexOf(section.fieldname);
  if (index === -1) return config; // Section not found, return unchanged.

  const newSection = {
    fieldname: generateUniqueFieldname("section"),
    label: `Section Above ${index + 1}`,
    fieldtype: "Section Break",
  };

  const newFieldOrder = [...config.field_order];
  newFieldOrder.splice(index, 0, newSection.fieldname);

  return {
    fields: [...config.fields, newSection],
    field_order: newFieldOrder,
  };
};

/**
 * Adds a new section below the specified section.
 * @param {object} config - The current configuration object.
 * @param {object} section - The section to add below.
 * @returns {object} - The updated configuration object.
 */
export const addSectionBelow = (config, section) => {
  const index = config.field_order.indexOf(section.fieldname);
  if (index === -1) return config; // Section not found, return unchanged.

  const newSection = {
    fieldname: generateUniqueFieldname("section"),
    label: `Section Below ${index + 2}`,
    fieldtype: "Section Break",
  };

  const newFieldOrder = [...config.field_order];
  newFieldOrder.splice(index + 1, 0, newSection.fieldname);

  return {
    fields: [...config.fields, newSection],
    field_order: newFieldOrder,
  };
};

/**
 * Adds a new column to the specified section.
 * @param {object} config - The current configuration object.
 * @param {object} section - The section to which the column will be added.
 * @returns {object} - The updated configuration object.
 */
export const addColumn = (config, section) => {
  const sectionIndex = config.fields.findIndex(
    (field) => field.fieldname === section.fieldname
  );
  if (sectionIndex === -1) return config; // Section not found, return unchanged.

  const updatedFields = [...config.fields];
  const targetSection = { ...updatedFields[sectionIndex] };

  // Initialize columns if not already present
  if (!targetSection.columns) targetSection.columns = [];

  const newColumn = {
    fieldname: generateUniqueFieldname("column"),
    fieldtype: "Column Break",
  };
  targetSection.columns.push(newColumn);

  updatedFields[sectionIndex] = targetSection; // Update the section in fields

  return {
    ...config,
    fields: updatedFields,
  };
};

/**
 * Deletes the specified section and its associated columns.
 * @param {object} config - The current configuration object.
 * @param {object} section - The section to delete.
 * @returns {object} - The updated configuration object.
 */
export const deleteSection = (config, section) => {
  const updatedFields = config.fields.filter(
    (field) => field.fieldname !== section.fieldname
  );

  const updatedFieldOrder = config.field_order.filter(
    (fieldname) => fieldname !== section.fieldname
  );

  return {
    fields: updatedFields,
    field_order: updatedFieldOrder,
  };
};
