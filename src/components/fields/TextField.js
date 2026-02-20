const DataField = ({
  value = "", // Default to empty string if value is null or undefined
  onChange,
  readOnly,
  preview,
  placeholder,
  hidden,
  type,
  required = false,
}) => {
  return (
    <input
      type={type || "text"}
      value={preview ? "" : value || ""} // Ensure value is never null or undefined
      readOnly={readOnly} // Make input readOnly in both readOnly and preview mode
      disabled={readOnly || preview}
      onChange={onChange}
      placeholder={placeholder}
      hidden={hidden}
      required={required}
      className="px-1 w-full focus:outline-none focus:ring-0 focus:border-none"
    />
  );
};

export default DataField;
