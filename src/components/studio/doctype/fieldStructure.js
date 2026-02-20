export const mapFieldsToStructure = (config) => {
  const structure = [];
  const updatedFields = [...config?.fields]; // To keep track of newly created fields (tabs, sections, columns)
  const updatedFieldOrder = [...config?.field_order]; // To track the updated order of fields
  const generateRandomFieldname = (prefix) =>
    `${prefix}_${Math.random().toString(36).substring(2, 8)}`;

  // Check if the first field is a "Tab Break"
  const firstField = config?.fields.find(
    (f) => f.fieldname === config?.field_order[0]
  );
  if (firstField && firstField.fieldtype !== "Tab Break") {
    // If the first field is not a "Tab Break", add the default "Details" tab
    const detailsTab = {
      label: "Details", // Label for the default tab
      fieldname: generateRandomFieldname("tab"), // Tab fieldname
      fieldtype: "Tab Break", // Specify the fieldtype for tabs
      sections: [
        {
          label: "", // Default section label
          fieldname: generateRandomFieldname("section"), // Default section fieldname
          fieldtype: "Section Break", // Specify the fieldtype for sections
          columns: [
            {
              fieldname: generateRandomFieldname("column"), // Default column fieldname
              label: "", // Default column label
              fieldtype: "Column Break", // Specify the fieldtype for columns
              fields: [], // Array to hold fields in this column
            },
          ],
        },
      ],
    };
    structure.push(detailsTab);
    updatedFields.push(detailsTab); // Add the new tab to fields
    updatedFieldOrder.push(detailsTab.fieldname); // Add the new tab's fieldname to field_order
  }

  let currentTab = structure[0]; // If the default tab is added, this will be "Details"
  let currentSection = currentTab?.sections[0]; // Start with default section if "Details" tab is added
  let currentColumn = currentSection?.columns[0]; // Start with the first column in the default section

  config?.field_order.forEach((fieldName, index) => {
    const field = config?.fields.find((f) => f.fieldname === fieldName);
    if (!field) return;

    switch (field.fieldtype) {
      case "Tab Break":
        // Create a new tab with a default section and column
        const nextFieldTab = config?.fields.find(
          (f) => f.fieldname === config?.field_order[index + 1]
        );
        const shouldAddSection = !(
          nextFieldTab && nextFieldTab.fieldtype === "Section Break"
        );

        currentTab = {
          label: field.label || field.fieldname, // Use label or fieldname as the tab label
          fieldname: field.fieldname || generateRandomFieldname("tab"), // Fieldname for the tab
          fieldtype: "Tab Break", // Specify the fieldtype for tabs
          sections: shouldAddSection
            ? [
                {
                  fieldname: generateRandomFieldname("section"), // Fieldname for this default column
                  label: "", // Default column label
                  fieldtype: "Section Break", // Specify the fieldtype for columns
                  columns: [], // Array to hold fields in this column
                },
              ]
            : [], // If next is a section, skip adding default section
        };
        structure.push(currentTab);
        updatedFields.push(currentTab); // Add the new tab to fields
        updatedFieldOrder.push(currentTab.fieldname); // Add the new tab's fieldname to field_order
        currentSection = currentTab?.sections[0]; // Reset to new default section in the new tab
        currentColumn = currentSection?.columns[0]; // Reset to the first column in the new section
        break;

      case "Section Break":
        // Create a new section within the current tab with a default column
        const nextField = config?.fields.find(
          (f) => f.fieldname === config?.field_order[index + 1]
        );
        const shouldAddColumn = !(
          nextField && nextField.fieldtype === "Column Break"
        );

        // Create a new section within the current tab
        currentSection = {
          label: field.label || "", // Use field's label for the section
          fieldname: field.fieldname || generateRandomFieldname("section"), // Section fieldname
          fieldtype: "Section Break", // Specify the fieldtype for sections
          columns: shouldAddColumn
            ? [
                {
                  fieldname: generateRandomFieldname("column"), // Fieldname for this default column
                  label: "", // Default column label
                  fieldtype: "Column Break", // Specify the fieldtype for columns
                  fields: [], // Array to hold fields in this column
                },
              ]
            : [], // If next is a "Column Break", skip adding a default column
        };
        currentTab.sections.push(currentSection);
        updatedFields.push(currentSection); // Add the new section to fields
        updatedFieldOrder.push(currentSection.fieldname); // Add the new section's fieldname to field_order
        currentColumn = shouldAddColumn ? currentSection.columns[0] : null; // Set currentColumn if a default column was added
        break;

      case "Column Break":
        // Create a new column in the current section
        currentColumn = {
          fieldname: `${field.fieldname}`, // Fieldname for this new column
          label: field.label || "", // Use field label or default to "Unnamed Column"
          fieldtype: "Column Break", // Specify the fieldtype for columns
          fields: [], // Array to hold fields in this column
        };
        currentSection.columns.push(currentColumn);
        updatedFields.push(currentColumn); // Add the new column to fields
        updatedFieldOrder.push(currentColumn.fieldname); // Add the new column's fieldname to field_order
        break;

      default:
        // Add the field to the fields array of the last active column in the current section
        currentColumn?.fields?.push({
          fieldname: field.fieldname,
          label: field.label,
          fieldtype: field.fieldtype,
        });
        break;
    }
  });

  // Remove empty columns, sections, and tabs
  structure.forEach((tab) => {
    tab.sections = tab.sections.filter((section) => {
      // Remove columns that are empty
      section.columns = section.columns.filter(
        (column) => column.fields.length > 0
      );
      // Keep sections that have at least one non-empty column
      return section.columns.length > 0;
    });
  });

  // Return both the structure and the updated config with rearranged field_order
  return {
    structure,
    updatedConfig: {
      ...config,
      fields: updatedFields,
      field_order: updatedFieldOrder, // Updated field_order with new fields (tabs, sections, columns)
    },
  };
};
