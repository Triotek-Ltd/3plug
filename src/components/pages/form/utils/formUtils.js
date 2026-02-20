// utils/formUtils.js
export const validateRequiredFields = (form, localConfig) => {
  const missingFields = [];
  localConfig?.field_order.forEach((fieldName) => {
    const field = Object.values(localConfig?.fields || {}).find(
      (f) => f.fieldname === fieldName
    );

    if (
      field?.reqd &&
      (!form[fieldName] || form[fieldName].toString().trim() === "")
    ) {
      missingFields.push(field.label || fieldName);
    }
  });

  return missingFields;
};

export const cleanData = (data) => {
  if (data instanceof Date) return data;

  if (Array.isArray(data)) {
    return data
      .map(cleanData)
      .filter(
        (item) =>
          item !== null &&
          item !== undefined &&
          item !== "" &&
          (typeof item !== "object" || Object.keys(item).length > 0)
      );
  }

  if (typeof data === "object" && data !== null) {
    return Object.fromEntries(
      Object.entries(data)
        .map(([key, value]) => [key, cleanData(value)])
        .filter(
          ([_, value]) =>
            value !== null &&
            value !== undefined &&
            value !== "" &&
            (typeof value !== "object" || Object.keys(value).length > 0)
        )
    );
  }

  return data;
};
