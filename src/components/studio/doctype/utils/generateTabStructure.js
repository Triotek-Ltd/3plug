export const generateTabStructure = (config) => {
  const structure = [];
  const generateRandomFieldname = (prefix) =>
    `${prefix}_${Math.random().toString(36).substring(2, 8)}`;

  // Add a default "Details" tab if the first field isn't a "Tab Break"
  const firstField =
    config?.fields && config?.field_order
      ? config?.fields.find((f) => f.fieldname === config?.field_order[0])
      : null;
  if (firstField && firstField.fieldtype !== "Tab Break") {
    const detailsTab = {
      label: "Details",
      fieldname: generateRandomFieldname("tab"),
      fieldtype: "Tab Break",
      sections: [
        {
          label: "",
          fieldname: generateRandomFieldname("section"),
          fieldtype: "Section Break",
          columns: [
            {
              fieldname: generateRandomFieldname("column"),
              label: "",
              fieldtype: "Column Break",
              fields: [],
            },
          ],
        },
      ],
    };
    structure.push(detailsTab);
  }

  let currentTab = structure[0];
  let currentSection = currentTab?.sections[0];
  let currentColumn = currentSection?.columns[0];

  config?.field_order?.forEach((fieldName, index) => {
    const field = config?.fields?.find((f) => f.fieldname === fieldName);
    if (!field) return;

    switch (field.fieldtype) {
      case "Tab Break":
        const nextFieldTab = config?.fields.find(
          (f) => f.fieldname === config?.field_order[index + 1]
        );
        const shouldAddSection = !(
          nextFieldTab && nextFieldTab.fieldtype === "Section Break"
        );

        currentTab = {
          label: field.label || field.fieldname,
          fieldname: field.fieldname || generateRandomFieldname("tab"),
          fieldtype: "Tab Break",
          sections: shouldAddSection
            ? [
                {
                  fieldname: generateRandomFieldname("section"),
                  label: "",
                  fieldtype: "Section Break",
                  columns: [],
                },
              ]
            : [],
        };
        structure.push(currentTab);
        currentSection = currentTab.sections[0];
        currentColumn = currentSection?.columns[0];
        break;

      case "Section Break":
        const nextField = config?.fields.find(
          (f) => f.fieldname === config?.field_order[index + 1]
        );
        const shouldAddColumn = !(
          nextField && nextField.fieldtype === "Column Break"
        );

        currentSection = {
          label: field.label || "",
          fieldname: field.fieldname || generateRandomFieldname("section"),
          fieldtype: "Section Break",
          columns: shouldAddColumn
            ? [
                {
                  fieldname: generateRandomFieldname("column"),
                  label: "",
                  fieldtype: "Column Break",
                  fields: [],
                },
              ]
            : [],
        };
        currentTab.sections.push(currentSection);
        currentColumn = shouldAddColumn ? currentSection.columns[0] : null;
        break;

      case "Column Break":
        currentColumn = {
          fieldname: `${field.fieldname}`,
          label: field.label || "",
          fieldtype: "Column Break",
          fields: [],
        };
        currentSection.columns.push(currentColumn);
        break;

      default:
        currentColumn?.fields.push({
          fieldname: field.fieldname,
          label: field.label,
          fieldtype: field.fieldtype,
        });
        break;
    }
  });

  // Remove empty columns and sections
  structure.forEach((tab) => {
    tab.sections = tab.sections.filter((section) => {
      section.columns = section.columns.filter(
        (column) => column.fields.length > 0
      );
      return section.columns.length > 0;
    });
  });

  return structure;
};
