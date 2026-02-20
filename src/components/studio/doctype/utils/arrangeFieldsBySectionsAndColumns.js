export const arrangeFieldsIntoSectionsAndColumns = (
  fields,
  tabBreak = null
) => {
  // Helper function to generate random ID
  const generateRandomId = (prefix) =>
    `${prefix}_${Math.random().toString(36).substring(2, 8)}`;

  const sections = [];
  let currentSection = null;
  let currentColumn = null;
  let prevField = tabBreak?.fieldname;
  // If no fields are provided, return a default section with a default column
  const id = generateRandomId("section");

  if (!fields || fields.length === 0) {
    return [
      {
        label: "",
        fieldname: "",
        id,
        prevField,
        fieldtype: "Section Break",
        columns: [
          {
            label: "",
            fieldname: "",
            id: generateRandomId("column"),
            prevField: id,
            fieldtype: "Column Break",
            fields: [],
          },
        ],
      },
    ];
  }

  fields.forEach((field) => {
    switch (field.fieldtype) {
      case "Section Break":
        // If the Section Break field exists, copy it as is
        currentSection = {
          ...field,
          prevField,
          columns: [],
        };
        sections.push(currentSection);

        // Create a default column for this section if no columns exist
        currentColumn = {
          label: "",
          fieldname: "",
          id: generateRandomId("column"),
          fieldtype: "Column Break",
          prevField: field.fieldname,
          fields: [],
        };
        currentSection.columns.push(currentColumn);
        break;

      case "Column Break":
        // If the Column Break field exists, copy it as is
        if (currentSection) {
          currentColumn = {
            ...field,
            prevField,
            fields: [],
          };
          currentSection.columns.push(currentColumn);
        }
        break;

      default:
        // If no section exists, create the default section
        const id = generateRandomId("section");
        if (!currentSection) {
          currentSection = {
            label: "",
            fieldname: "",
            id,
            prevField,
            fieldtype: "Section Break", // Default fieldtype for section breaks
            columns: [],
          };
          sections.push(currentSection);

          // Create a default column in the default section
          currentColumn = {
            label: "",
            fieldname: "",
            id: generateRandomId("column"),
            prevField: id,
            fieldtype: "Column Break", // Default fieldtype for column breaks
            fields: [],
          };
          currentSection.columns.push(currentColumn);
        }

        // Add the field to the current column
        if (currentColumn) {
          currentColumn.fields.push({
            ...field,
            prevField,
            fieldname: field.fieldname || generateRandomId("field"), // Use fieldname if available or generate new ID
          });
        }
        break;
    }

    prevField = field?.fieldname;
  });

  // Remove empty columns but preserve sections
  const filteredSections = sections.map((section) => {
    // Filter columns: remove those without fields unless they have fieldname or is_new
    const filteredColumns = section.columns.filter(
      (column) => column.fields.length > 0 || column.fieldname || column.is_new
    );

    // Always preserve sections with `is_new: true`, even if empty
    return section.is_new
      ? section
      : {
          ...section,
          columns: filteredColumns,
        };
  });

  // If no sections are left after filtering, create a default section and column
  if (filteredSections.length === 0) {
    return [
      {
        label: "",
        fieldname: "",
        id: generateRandomId("section"), // Generate a random ID for the section
        fieldtype: "Section Break",
        columns: [
          {
            label: "",
            fieldname: "",
            id: generateRandomId("column"), // Generate a random ID for the column
            fieldtype: "Column Break",
            fields: [],
          },
        ],
      },
    ];
  }

  return filteredSections;
};
