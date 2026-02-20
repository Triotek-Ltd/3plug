import React from "react";
import Select from "react-select";
import LinkField from "@/components/fields/LinkField";

export const RenderValueInput = (
  filter,
  index,
  config,
  availableFields,
  handleFilterChange
) => {
  const field = availableFields.find((f) => f.value === filter.field);
  const item = config.fields.find((f) => f.fieldname === filter.field);
  const matchOptions = [
    // Basic Lookups
    { value: "equals", label: "Equals" },
    { value: "__iexact", label: "Case-Insensitive Equals" },

    // Contains and Similar
    { value: "__icontains", label: "Contains" },
    { value: "__contains", label: "Case-Sensitive Contains" },

    // Start and End
    { value: "__startswith", label: "Starts With" },
    { value: "__istartswith", label: "Case-Insensitive Starts With" },
    { value: "__endswith", label: "Ends With" },
    { value: "__iendswith", label: "Case-Insensitive Ends With" },

    // Numeric Comparisons
    { value: "__gt", label: "Greater Than" },
    { value: "__gte", label: "Greater Than or Equal To" },
    { value: "__lt", label: "Less Than" },
    { value: "__lte", label: "Less Than or Equal To" },

    // Range
    { value: "__range", label: "In Range" },

    // Null Values
    { value: "__isnull", label: "Is Null" },

    // Membership
    { value: "__in", label: "In" },
    { value: "__not_in", label: "Not In" }, // Not directly supported in Django ORM; simulated with ~Q

    // Pattern Matching
    { value: "__regex", label: "Matches Regex" },
    { value: "__iregex", label: "Case-Insensitive Regex" },

    // Date/Time Lookups
    { value: "__date", label: "Date Equals" },
    { value: "__year", label: "Year Equals" },
    { value: "__month", label: "Month Equals" },
    { value: "__day", label: "Day Equals" },
    { value: "__week", label: "Week Equals" },
    { value: "__week_day", label: "Week Day Equals" },
    { value: "__quarter", label: "Quarter Equals" },
    { value: "__time", label: "Time Equals" },
    { value: "__hour", label: "Hour Equals" },
    { value: "__minute", label: "Minute Equals" },
    { value: "__second", label: "Second Equals" },

    // Fuzzy Lookups (Postgres-specific)
    { value: "__trigram_similar", label: "Trigram Similar" },

    // GIS-Specific Lookups
    { value: "__dwithin", label: "Within Distance" },
    { value: "__distance_lt", label: "Distance Less Than" },
    { value: "__distance_lte", label: "Distance Less Than or Equal To" },
    { value: "__distance_gt", label: "Distance Greater Than" },
    { value: "__distance_gte", label: "Distance Greater Than or Equal To" },

    // Negations
    { value: "__not_equals", label: "Not Equals" }, // Simulated with ~Q in Django
    { value: "__is_set", label: "Is" }, // Simulated with a custom implementation
  ];

  // if (!field) return null;

  const renderValueInput = () => {
    switch (filter?.matchOption) {
      case "equals":
      case "__iexact":
      case "__not_equals": {
        switch (field?.fieldtype) {
          case "Link":
            return (
              <div className="py-1 px-2 border rounded w-48">
                <LinkField
                  field={item}
                  value={filter.value}
                  onChange={(e) => handleFilterChange(index, "value", e)}
                />
              </div>
            );
          case "Table":
          case "TableMultiselect":
            return (
              <Select
                options={item.options || []}
                value={
                  item.options?.filter((option) =>
                    filter.value.includes(option.value)
                  ) || null
                }
                onChange={(selected) =>
                  handleFilterChange(
                    index,
                    "value",
                    selected ? selected.map((s) => s.value) : []
                  )
                }
                placeholder="Select Values"
                isMulti
                isClearable
                className="w-48"
              />
            );
          default:
            return (
              <input
                type="text"
                value={filter.value}
                onChange={(e) =>
                  handleFilterChange(index, "value", e.target.value)
                }
                placeholder="Value"
                className="py-1 px-2 border rounded w-48"
              />
            );
        }
      }
      case "__icontains":
      case "__contains":
      case "__istartswith":
      case "__iendswith":
        return (
          <input
            type="text"
            value={filter.value}
            onChange={(e) => handleFilterChange(index, "value", e.target.value)}
            placeholder="Enter text"
            className="py-1 px-2 border rounded w-48"
          />
        );
      case "__gt":
      case "__gte":
      case "__lt":
      case "__lte":
        return (
          <input
            type="number"
            value={filter.value}
            onChange={(e) => handleFilterChange(index, "value", e.target.value)}
            placeholder="Enter number"
            className="py-1 px-2 border rounded w-48"
          />
        );
      case "__is_set":
        return (
          <Select
            options={[
              { value: 1, label: "Set" },
              { value: 0, label: "Not Set" },
            ]}
            value={
              [
                { value: 1, label: "Set" },
                { value: 0, label: "Not Set" },
              ].find((option) => option.value === filter.value) || null
            }
            onChange={(selected) =>
              handleFilterChange(index, "value", selected.value)
            }
            placeholder="Select Option"
            className="w-48"
          />
        );
      case "__range":
        return (
          <div className="flex flex-col w-48">
            <input
              type="text"
              value={filter.value}
              onChange={(e) =>
                handleFilterChange(index, "value", e.target.value)
              }
              placeholder="Enter range (e.g., 1-10)"
              className="py-1 px-2 border rounded"
            />
            <small className="text-gray-500">Format: start,end</small>
          </div>
        );
      case "__in":
      case "__not_in":
        return (
          <div className="flex flex-col w-48">
            <input
              type="text"
              value={filter.value}
              onChange={(e) =>
                handleFilterChange(index, "value", e.target.value)
              }
              placeholder="Enter comma-separated values"
              className="py-1 px-2 border rounded"
            />
            <small className="text-gray-500">Separate values with commas</small>
          </div>
        );
      case "__regex":
      case "__iregex":
        return (
          <input
            type="text"
            value={filter.value}
            onChange={(e) => handleFilterChange(index, "value", e.target.value)}
            placeholder="Enter regex pattern"
            className="py-1 px-2 border rounded w-48"
          />
        );
      case "__isnull":
        return (
          <Select
            options={[
              { value: true, label: "True" },
              { value: false, label: "False" },
            ]}
            value={
              [
                { value: true, label: "True" },
                { value: false, label: "False" },
              ].find((option) => option.value === filter.value) || null
            }
            onChange={(selected) =>
              handleFilterChange(index, "value", selected.value)
            }
            placeholder="Select True/False"
            className="w-48"
          />
        );
      case "__date":
      case "__year":
      case "__month":
      case "__day":
      case "__time":
        return (
          <input
            type="date"
            value={filter.value}
            onChange={(e) => handleFilterChange(index, "value", e.target.value)}
            placeholder="Select Date"
            className="py-1 px-2 border rounded w-48"
          />
        );
      default:
        return (
          <input
            type="text"
            value={filter.value}
            onChange={(e) => handleFilterChange(index, "value", e.target.value)}
            placeholder="Value"
            className="py-1 px-2 border rounded w-48"
          />
        );
    }
  };

  return (
    <div className="flex space-x-2 items-center">
      <Select
        options={matchOptions}
        value={
          matchOptions.find((m) => m.value === filter.matchOption) ||
          matchOptions[0]
        }
        onChange={(selected) =>
          handleFilterChange(index, "matchOption", selected.value)
        }
        placeholder="Match Option"
        className="w-60"
      />
      {renderValueInput()}
    </div>
  );
};
