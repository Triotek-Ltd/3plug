import React, { useState } from "react";
import FilterDropdown from "./FilterDropdown";
import FilterSelect from "./FilterSelect";
import FilterText from "./FilterText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import LinkField from "@/components/fields/LinkField";
import Sort from "./Sort";

const matchOptions = [
  { value: "equals", label: "Equals" },
  { value: "__icontains", label: "Contains" },
  { value: "__starts_with", label: "Starts With" },
  { value: "__ends_with", label: "Ends With" },
];

const Filters = ({
  filters,
  config,
  onFilterChange,
  handleClearFilters,
  applyFilters,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filterList, setFilterList] = useState([]);
  const [sortField, setSortField] = useState(""); // Sort field state
  const [sortOrder, setSortOrder] = useState("desc"); // Sort order state (asc or desc)

  const handleAddFilter = (filter) => {
    setFilterList((prev) => [...prev, filter]);
    onFilterChange(filter.field, filter.matchType, filter.value);
  };

  const handleRemoveFilter = (index) => {
    const newFilterList = filterList.filter((_, i) => i !== index);
    setFilterList(newFilterList);
    // Update the filters state accordingly
  };

  const handleFilterChange = (name, type, value) => {
    onFilterChange(name, type, value);
  };

  const handleApplyFilters = () => {
    applyFilters(filterList);
  };

  const handleClearAllFilters = () => {
    setFilterList([]);
    handleClearFilters();
  };

  const handleSortFieldChange = (field) => {
    setSortField(field);
    onFilterChange("_sort_field", "equals", field.value);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    onFilterChange("_sort_order", "equals", order);
  };

  // Ensure 'id' filter is always present
  const defaultIdFilter = {
    id: { type: "text", value: "", matchType: "__icontains" },
    // search: { type: "text", value: "", matchType: "__icontains" },
  };
  const combinedFilters = { ...defaultIdFilter, ...filters };

  const getFieldComponent = (filterKey, filter) => {
    const fieldConfig = config.fields.find(
      (f) => f.fieldname === filterKey || f.id === filterKey
    );

    if (!fieldConfig) {
      return (
        <FilterText
          handleChange={(value) =>
            handleFilterChange(filterKey, "__icontains", value)
          }
          placeholder={filterKey}
          name={filterKey}
          value={filter.value}
        />
      );
    }

    switch (fieldConfig.fieldtype) {
      case "Link":
        return (
          <div className="py-[0.4rem] px-2 border rounded">
            <LinkField
              field={fieldConfig}
              value={filter.value}
              placeholder={fieldConfig.label}
              onChange={(e) => handleFilterChange(filterKey, "equals", e)}
            />
          </div>
        );
      case "Select":
        return (
          <FilterSelect
            placeholder={filterKey}
            name={filterKey}
            handleChange={(value) =>
              handleFilterChange(filterKey, "value", value)
            }
            options={fieldConfig.options}
            value={filter.value}
            isMulti
          />
        );
      default:
        return (
          <FilterText
            placeholder={fieldConfig.label}
            name={filterKey}
            handleChange={(value) =>
              handleFilterChange(filterKey, "__icontains", value)
            }
            matchOptions={matchOptions}
            matchType={filter.matchType}
            value={filter.value}
          />
        );
    }
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-9 gap-x-2 gap-y-2 px-4">
        {/* Filters */}
        <div className="col-span-1 md:col-span-6 lg:col-span-6 xl:col-span-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-2 w-full">
          {Object?.keys(combinedFilters)?.map((filterKey) => {
            const filter = combinedFilters[filterKey];
            return (
              <div className="flex flex-col text-[12px]" key={filterKey}>
                {getFieldComponent(filterKey, filter)}
              </div>
            );
          })}
        </div>

        {/* Clear Filters Button always at the end (spans all columns) */}
        <div className="flex w-full items-start justify-end space-x-2 col-span-3">
          <div className="col-span-1 flex justify-end h-fit w-full text-[13px] text-gray-700 font-medium">
            {/* Filter Button */}
            <div className="flex justify-end w-full">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="py-[0.4rem] px-2 bg-gray-100 w-full hover:bg-gray-400 rounded-l-md flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faFilter} />
                &nbsp; Filter
              </button>
              <button
                onClick={handleClearAllFilters}
                className="py-[0.4rem] px-4 bg-gray-100 hover:bg-gray-400 rounded-r-md border-l-[1px] border-gray-400"
              >
                X
              </button>
            </div>
          </div>
          <div className="flex w-full items-start justify-end col-span-2">
            {/* Include the Sort component here */}
            <Sort
              fields={Object.keys(combinedFilters)}
              sortField={sortField}
              sortOrder={sortOrder}
              onSortFieldChange={handleSortFieldChange}
              onSortOrderChange={handleSortOrderChange}
              config={config}
            />
          </div>

          {/* Filter Dropdown */}
          {showDropdown && (
            <FilterDropdown
              fields={Object.keys(combinedFilters)}
              filters={filterList}
              onAddFilter={handleAddFilter}
              onClose={() => setShowDropdown(false)}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearAllFilters}
              config={config}
              filterList={filterList}
              setFilterList={setFilterList}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;
