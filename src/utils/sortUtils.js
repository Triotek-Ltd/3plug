// sortUtils.js

// Utility function to sort data based on a field and order (asc/desc)
export const applySorting = (data, sortField, sortOrder) => {
  if (!sortField || !data || data.length === 0) return data;

  // Sorting logic for ascending and descending order
  const sortedData = [...data].sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];

    if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return sortedData;
};
