export const generateTabList = (config) => {
  const tabs = [];
  const generateRandomFieldname = (prefix) =>
    `${prefix}_${Math.random().toString(36).substring(2, 8)}`;

  const firstField = config?.fields?.find(
    (f) => f.fieldname === config?.field_order[0]
  );

  // Add a default "Details" tab if the first field isn't a "Tab Break"
  if (firstField && firstField.fieldtype !== "Tab Break") {
    tabs.push({
      label: "Details",
      fieldname: generateRandomFieldname("tab"),
      fieldtype: "Tab Break",
      odd: true,
    });
  }

  // Add "Tab Break" fields in the order they appear in `field_order`
  config?.field_order?.forEach((fieldName) => {
    const field = config?.fields?.find((f) => f.fieldname === fieldName);

    if (field && field.fieldtype === "Tab Break") {
      tabs.push({
        label: field.label || field.fieldname,
        fieldname: field.fieldname,
        fieldtype: "Tab Break",
      });
    }
  });

  // Ensure a default "Details" tab is returned if no tabs were added
  if (tabs.length === 0) {
    tabs.push({
      label: "Details",
      fieldname: generateRandomFieldname("tab"),
      fieldtype: "Tab Break",
      odd: true,
    });
  }

  return tabs;
};
