import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import CustomButton from "@/components/core/common/buttons/Custom";
import PrimaryButton from "@/components/core/common/buttons/Primary";
import SecondaryButton from "@/components/core/common/buttons/Secondary";
import { RenderValueInput } from "./RenderOptions";

const FilterDropdown = ({
  config,
  filters,
  onAddFilter,
  onClose,
  onApplyFilters,
  onClearFilters,
  filterList,
  setFilterList,
}) => {
  const dropdownRef = useRef(null);

  const availableFields = config.fields
    .filter((field) => !field.fieldtype.includes("Break"))
    .map((field) => ({
      value: field.fieldname,
      label: field.label,
      fieldtype: field.fieldtype,
    }));

  const getUnusedFields = () => {
    const usedFields = filterList.map((filter) => filter.field);
    return availableFields.filter((field) => !usedFields.includes(field.value));
  };

  const handleAddFilterRow = () => {
    setFilterList([
      ...filterList,
      { field: "", matchOption: "equals", value: "" },
    ]);
  };

  const handleRemoveFilterRow = (index) => {
    const newFilterList = filterList.filter((_, i) => i !== index);
    setFilterList(newFilterList);
  };

  const handleFilterChange = (index, key, value) => {
    const newFilterList = filterList.map((filter, i) =>
      i === index ? { ...filter, [key]: value } : filter
    );

    setFilterList(newFilterList);
  };

  const handleApplyFilters = () => {
    onApplyFilters();
    onClose();
  };

  const handleClearFilters = () => {
    setFilterList([{ field: "", matchOption: "equals", value: "" }]);
    onClearFilters();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, onClose]);

  useEffect(() => {
    setFilterList(
      filters.length > 0
        ? filters
        : [{ field: "", matchOption: "equals", value: "" }]
    );
  }, [filters]);

  return (
    <div
      ref={dropdownRef}
      className="absolute bg-gray-100 shadow-lg p-2 text-sm rounded-md border-[1px] shadow-md shadow-gray-600 mt-12 z-10"
    >
      <div className="flex flex-col space-y-2">
        {filterList.map((filter, index) => (
          <div key={index} className="flex space-x-2 items-center">
            <Select
              options={getUnusedFields()}
              value={
                availableFields.find((f) => f.value === filter.field) || null
              }
              onChange={(selected) =>
                handleFilterChange(
                  index,
                  "field",
                  selected ? selected.value : ""
                )
              }
              placeholder="Select Field"
              isClearable
              className="w-48"
            />

            {RenderValueInput(
              filter,
              index,
              config,
              availableFields,
              handleFilterChange
            )}
            <CustomButton
              text="X"
              onClick={() => handleRemoveFilterRow(index)}
            />
          </div>
        ))}
        <div className="flex justify-between mt-2 border-t-[1px] border-gray-400 pt-3">
          <PrimaryButton text="Add Filter" onClick={handleAddFilterRow} />
          <div className="flex justify-end space-x-2">
            <CustomButton text="Clear Filters" onClick={handleClearFilters} />
            <SecondaryButton
              text="Apply Filters"
              onClick={handleApplyFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterDropdown;
