export const getLastFieldname = (input) => {
  // Handle a list of sections
  if (Array.isArray(input)) {
    // Iterate in reverse to find the last fieldname
    for (let i = input.length - 1; i >= 0; i--) {
      const fieldname = getLastFieldname(input[i]); // Recursively check each section
      if (fieldname) {
        return fieldname;
      }
    }
    return null; // No fieldname found in the list
  }

  // Handle a section object
  if (input.columns) {
    // Iterate columns in reverse
    for (let i = input.columns.length - 1; i >= 0; i--) {
      const fieldname = getLastFieldname(input.columns[i]); // Recursively check each column
      if (fieldname) {
        return fieldname;
      }
    }

    // Check if the section itself has a fieldname (after checking columns)
    if (input.fieldname) {
      return input.fieldname;
    }

    return null; // No fieldname found in the section
  }

  // Handle a column object
  if (input.fields) {
    // Iterate fields in reverse
    for (let i = input.fields.length - 1; i >= 0; i--) {
      if (input.fields[i].fieldname) {
        return input.fields[i].fieldname;
      }
    }

    // Check if the column itself has a fieldname (after checking fields)
    if (input.fieldname) {
      return input.fieldname;
    }

    return null; // No fieldname found in the column
  }

  // Return null if input is not valid or no fieldname is found
  return null;
};
