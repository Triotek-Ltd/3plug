import React from "react";
import Select from "react-select";

const SelectField = ({
  value = "",
  onChange,
  readOnly,
  preview,
  hidden,
  options,
  placeholder,
}) => {
  if (hidden) return null;

  // Convert string options to { label, value } format
  const formattedOptions = options?.map((opt) => ({ label: opt, value: opt }));

  // Convert selected value to the expected format for react-select
  const selectedValue =
    formattedOptions.find((opt) => opt.value === value) || null;

  return (
    <div className="relative flex flex-col w-full text-[14px]">
      <Select
        isMulti={false}
        options={formattedOptions}
        value={selectedValue}
        onChange={(selected) => onChange(selected?.value)}
        placeholder={placeholder || "Select option"}
        classNamePrefix="custom-select"
        isDisabled={readOnly || preview}
        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: "transparent",
            border: "transparent",
            borderRadius: "0px",
            boxShadow: "transparent",
            minHeight: "unset",
            padding: "0px",
            outline: state.isFocused ? "1px solid white" : "none", // Focus outline
          }),
          dropdownIndicator: (base) => ({ ...base, padding: "0px" }),
          clearIndicator: (base) => ({ ...base, padding: "0px" }),
          valueContainer: (base) => ({ ...base, padding: "0px 0px" }),
        }}
      />
    </div>
  );
};

export default SelectField;
