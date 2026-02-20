/**
 * Utility function to delete fields from config
 * @param {Object} config - The configuration object
 * @param {Array|string} fieldnames - Fieldname(s) to delete (string or array of strings)
 * @returns {Object} - Updated config
 */
export const deleteFieldsFromConfig = (config, fieldnames) => {
  // Ensure fieldnames is an array for consistent processing
  const fieldsToDelete = Array.isArray(fieldnames) ? fieldnames : [fieldnames];

  // Filter out fields from the config.fields array
  config.fields = config.fields.filter(
    (field) => !fieldsToDelete.includes(field.fieldname)
  );

  // Filter out fieldnames from the config.field_order array
  config.field_order = config.field_order.filter(
    (fieldname) => !fieldsToDelete.includes(fieldname)
  );

  return config;
};
