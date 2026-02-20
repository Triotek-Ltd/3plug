import React, { useState } from "react";
import Select from "react-select";

const parseOptions = (optionsString) => {
  return optionsString
    .trim()
    .split("\n")
    .map((option) => ({
      label: option,
      value: option,
    }));
};

const FilterSelect = ({
  name,
  handleChange,
  options,
  placeholder = "Select",
}) => {
  const [selected, setSelected] = useState(null);

  const parsedOptions =
    typeof options === "string" ? parseOptions(options) : options;

  const handleSelectionChange = (selectedOption) => {
    setSelected(selectedOption);
    handleChange(selectedOption?.value);
  };

  return (
    <Select
      value={selected}
      onChange={handleSelectionChange}
      options={parsedOptions}
      isSearchable
      placeholder={placeholder}
      classNamePrefix="custom-select" // Use a prefix for styling
    />
  );
};

export default FilterSelect;
