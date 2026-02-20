export const extractFiltersAndFields = (tableConfig) => {
  const newFilters = {};
  const fields = [];
  const settings = {}; // Object to hold settings that are not part of fields or field_order

  // Extract filters and fields based on tableConfig
  tableConfig.fields.forEach((field) => {
    // Check if field should be used as a filter
    if (field.in_standard_filter) {
      newFilters[field.fieldname] = ""; // Initialize filter as empty
    }

    // Check if field should be in the list view (table columns)
    if (field.in_list_view) {
      fields.push({
        fieldname: field.fieldname,
        label: field.label,
        fieldtype: field.fieldtype,
        width: field.width,
      });
    }
  });

  // Extract any settings that are not part of fields or field_order
  Object.keys(tableConfig).forEach((key) => {
    if (key !== "fields" && key !== "field_order") {
      settings[key] = tableConfig[key];
    }
  });

  return { filters: newFilters, fields, settings };
};
