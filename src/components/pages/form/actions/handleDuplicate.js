export const handleDuplicate = (props) => {
  const { router, id, form, setForm } = props;

  const removeIdAndRelatedFields = (data) => {
    const fieldsToRemove = [
      // "id",
      "modified",
      "created",
      "created_by",
      "modified_by",
      "_next",
      "_prev",
    ];

    const processValue = (value) => {
      if (Array.isArray(value)) {
        // Process each item in the array
        const processedArray = value
          .map((item) => {
            if (typeof item === "object" && item !== null) {
              return removeIdAndRelatedFields(item); // Recursively clean list objects
            }
            return item; // Leave non-object items as-is
          })
          .filter((item) => item !== null); // Remove `null` items from arrays

        // If the array is empty after processing, return `null` to remove it
        return processedArray.length > 0 ? processedArray : null;
      } else if (typeof value === "object" && value !== null) {
        // Replace nested objects with their `id` field if it exists
        return value.id !== undefined
          ? value.id
          : removeIdAndRelatedFields(value);
      }
      return value; // Return primitives as-is
    };

    // Process the current object
    return Object.fromEntries(
      Object.entries(data)
        .filter(
          ([key, value]) =>
            !fieldsToRemove.includes(key) &&
            value !== null &&
            value !== undefined // Exclude unwanted fields, `null`, and `undefined` values
        )
        .map(([key, value]) => [key, processValue(value)]) // Process each value
        .filter(([, value]) => value !== null) // Remove keys with `null` values after processing
    );
  };

  const cleanedForm = removeIdAndRelatedFields({ ...form, id: undefined });

  setForm(cleanedForm);

  const currentPath = router.asPath;
  const newPath = currentPath.replace(/\/[^/]*$/, "/new");

  router.push(newPath);
};
