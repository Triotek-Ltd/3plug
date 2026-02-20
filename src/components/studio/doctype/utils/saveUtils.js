import ToastTemplates from "@/components/core/common/toast/ToastTemplates";

export const generateFieldnameFromLabel = (label) => {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove non-alphanumeric characters
    .trim()
    .replace(/\s+/g, "_"); // Replace spaces with underscores
};

export const validateFieldnames = (fields) => {
  const fieldnames = new Set();

  for (const field of fields) {
    if (fieldnames.has(field.fieldname)) {
      throw new Error(
        `Fieldname conflict detected: "${field.fieldname}" is duplicated.`
      );
    }
    fieldnames.add(field.fieldname);
  }
};

export const handleDocSave = (localConfig, form, handleSave) => {
  try {
    // Remove undefined keys from form
    const cleanForm = Object.fromEntries(
      Object.entries(form).filter(([_, value]) => value !== undefined)
    );

    // Merge all properties of localConfig with cleaned form, with form taking precedence
    const updatedConfig = {
      ...localConfig,
      ...cleanForm, // Override properties from cleaned form
    };

    // Deep merge fields array
    updatedConfig.fields = updatedConfig.fields.map((field) => {
      let updatedField = { ...field };

      // Check if the field exists in the form and has been changed
      const matchingField = cleanForm.fields?.find(
        (f) => f.fieldname === field.fieldname
      );

      if (matchingField) {
        updatedField = { ...updatedField, ...matchingField }; // Override with form values
      }

      // Handle new fields that need their fieldname generated from label
      if (updatedField.is_new && updatedField?.label) {
        const newFieldname = generateFieldnameFromLabel(updatedField.label);

        if (
          updatedConfig.fields.some(
            (existingField) =>
              existingField.fieldname === newFieldname &&
              existingField !== updatedField
          )
        ) {
          throw new Error(
            `Fieldname conflict: "${newFieldname}" already exists. Please use a different label.`
          );
        }

        updatedField.fieldname = newFieldname;

        // Update field_order list entry matching the new field
        const fieldOrderIndex = updatedConfig.field_order.indexOf(
          field.fieldname
        );
        if (fieldOrderIndex !== -1) {
          updatedConfig.field_order[fieldOrderIndex] = newFieldname;
        }
      }

      delete updatedField.is_new;
      delete updatedField.prevField;

      return updatedField;
    });

    // Handle field_order merging, ensuring new fieldnames are accounted for
    const fieldnameMap = new Map();
    updatedConfig.field_order = updatedConfig.field_order.map((fieldname) => {
      if (fieldnameMap.has(fieldname)) {
        return fieldnameMap.get(fieldname);
      }
      return fieldname;
    });

    // Validate fieldnames
    validateFieldnames(updatedConfig.fields);

    // Save the updated configuration
    handleSave(updatedConfig);
  } catch (error) {
    console.error(error.message);
    // Assuming ToastTemplates is a global toast utility function for error handling
    ToastTemplates.error(error.message);
  }
};
