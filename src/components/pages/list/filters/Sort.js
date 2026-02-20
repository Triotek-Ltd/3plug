import React from "react";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

const Sort = ({
  fields,
  sortField,
  sortOrder,
  onSortFieldChange,
  onSortOrderChange,
  config,
}) => {
  const handleSortFieldChange = (selectedOption) => {
    onSortFieldChange(selectedOption);
  };

  const handleSortOrderToggle = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    onSortOrderChange(newOrder);
  };
  const availableFields = [
    ...config?.fields
      ?.filter((field) => !field?.fieldtype?.includes("Break"))
      ?.map((field) => ({
        value: field.fieldname,
        label: field.label,
        fieldtype: field.fieldtype,
      })),
    { value: "modified", label: "Modified", fieldtype: "Date" },
    { value: "created", label: "Created", fieldtype: "Date" },
  ].sort((a, b) => a?.label?.localeCompare(b.label));

  return (
    <div className="flex items-center w-full space-x-2">
      {/* Dropdown for selecting the field to sort by */}
      <Select
        options={availableFields}
        value={sortField || null}
        onChange={handleSortFieldChange}
        placeholder="Select Sort Field"
        className="w-full text-xs focus:outline-none focus:ring-0"
        classNamePrefix="custom-select"
      />

      {/* Button to toggle between ascending and descending order */}
      <button
        onClick={handleSortOrderToggle}
        className="flex items-center p-2 border rounded"
      >
        <FontAwesomeIcon
          icon={sortOrder === "asc" ? faArrowUp : faArrowDown}
          className={sortOrder === "asc" ? "text-green-500" : "text-red-500"}
        />
      </button>
    </div>
  );
};

export default Sort;
