export const getFirstFieldname = (input) => {
  // Handle a list of sections
  if (Array.isArray(input)) {
    for (const section of input) {
      const fieldname = getFirstFieldname(section); // Recursively check each section
      if (fieldname) {
        return fieldname;
      }
    }
    return null; // No fieldname found in the list
  }

  // Handle a section object
  if (input?.columns) {
    // Check if the section itself has a fieldname
    if (input?.fieldname) {
      return input.fieldname;
    }

    // Check columns for fieldname
    for (const column of input.columns) {
      const fieldname = getFirstFieldname(column); // Recursively check each column
      if (fieldname) {
        return fieldname;
      }
    }
    return null; // No fieldname found in the section
  }

  // Handle a column object
  if (input?.fields) {
    // Check if the column has a fieldname
    if (input?.fieldname) {
      return input?.fieldname;
    }

    // Check fields within the column for fieldname
    for (const field of input?.fields) {
      if (field.fieldname) {
        return field.fieldname;
      }
    }
    return null; // No fieldname found in the column
  }

  // Return null if input is not valid or no fieldname is found
  return null;
};
