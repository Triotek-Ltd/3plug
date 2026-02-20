export const handleInputChange = (
  field,
  value,
  selectedItem,
  setSelectedItem,
  localConfig,
  setLocalConfig
) => {
  if (!selectedItem || !localConfig) return;

  const updatedSelectedItem = { ...selectedItem, [field]: value };

  // Update the fields array in localConfig
  const updatedFields = localConfig.fields.map((field) =>
    field.fieldname === selectedItem.fieldname ? updatedSelectedItem : field
  );

  // Update the field_order if the fieldname has changed
  let updatedFieldOrder = [...localConfig.field_order];
  if (field === "fieldname") {
    const oldFieldNameIndex = updatedFieldOrder.indexOf(selectedItem.fieldname);
    if (oldFieldNameIndex !== -1) {
      updatedFieldOrder[oldFieldNameIndex] = value; // Update with the new fieldname
    }
  }

  // Update the selectedItem in the state
  setSelectedItem(updatedSelectedItem);
  // Update the localConfig and apply changes
  setLocalConfig({
    ...localConfig,
    fields: updatedFields,
    field_order: updatedFieldOrder,
  });
};
