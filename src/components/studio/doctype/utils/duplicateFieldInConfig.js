import { generateUniqueName } from "./addFieldToConfig";

// Utility function to duplicate a field
export const duplicateFieldInConfig = (config, fieldnameToDuplicate) => {
  // Find the field to duplicate
  const fieldToDuplicate = config.fields.find(
    (field) => field.fieldname === fieldnameToDuplicate
  );

  if (!fieldToDuplicate) {
    throw new Error(
      `Field with fieldname "${fieldnameToDuplicate}" not found.`
    );
  }

  // Generate a unique fieldname for the duplicate
  const newFieldname = generateUniqueName(
    fieldToDuplicate.fieldtype.toLowerCase(),
    config.fields
  );

  // Create the duplicate field
  const duplicatedField = {
    ...fieldToDuplicate,
    fieldname: newFieldname, // Assign a unique fieldname
    label: `${fieldToDuplicate.label} Copy`, // Append "Copy" to the label
    is_new: true, // Mark as new
  };

  // Add the duplicated field to the fields array
  config.fields.push(duplicatedField);

  // Find the position of the original field in the field order
  const originalIndex = config.field_order.indexOf(fieldnameToDuplicate);

  if (originalIndex !== -1) {
    // Insert the new field after the original in field order
    config.field_order.splice(originalIndex + 1, 0, newFieldname);
  } else {
    // If the original field is not found in the order, add the duplicate at the end
    config.field_order.push(newFieldname);
  }

  return config;
};
