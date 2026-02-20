import React, { useEffect, useState } from "react";
import SampleTable from "./Sample";
import { useConfig } from "@/contexts/ConfigContext";
import Select from "react-select";
import TableActions from "@/components/fields/table/TableActions";

// Helper function to find the closest match from headers
const getBestMatch = (target, choices) => {
  const regex = new RegExp(target, "i"); // Case-insensitive matching
  return choices.find((choice) => regex.test(choice)) || choices[0]; // Return first match or the first option
};

const ImportFieldMapping = ({
  headers,
  displayedData,
  selectedColumns,
  setSelectedColumns,
}) => {
  const { localConfig } = useConfig();
  const [selectedRows, setSelectedRows] = useState([]);
  const [rows, setRows] = useState(
    (localConfig?.fields || []).filter(
      (field) => !field.fieldtype.includes("Break")
    )
  );
  // Initialize rows with fields from config

  // Format options for react-select dropdown
  const formattedOptions = headers.map((header) => ({
    label: header,
    value: header,
    setRows,
  }));

  useEffect(() => {
    if (!rows) return;

    rows.forEach((field) => {
      const closestMatch = getBestMatch(field.fieldname, headers);
      setSelectedColumns((prevState) => ({
        ...prevState,
        [field.fieldname]: closestMatch,
      }));
    });

    setRows((prevRows) => {
      if (
        headers.includes("id") &&
        !prevRows.some((row) => row.fieldname === "id")
      ) {
        return [
          {
            fieldname: "id",
            fieldtype: "Data",
            label: "ID",
            oldfieldname: "id",
            oldfieldtype: "Data",
          },
          ...prevRows,
        ];
      }
      return prevRows;
    });
  }, [headers]); // Removed rows from dependencies to prevent unnecessary reruns

  const handleSelectRow = (fieldname) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(fieldname)) {
        return prevSelectedRows.filter((row) => row !== fieldname);
      } else {
        return [...prevSelectedRows, fieldname];
      }
    });
  };

  const handleDeleteRows = () => {
    // Delete selected rows from the local rows list
    const updatedRows = rows.filter(
      (row) => !selectedRows.includes(row.fieldname)
    );
    setRows(updatedRows);
    setSelectedRows([]); // Clear selected rows after deletion
    // Update selectedColumns state
    const updatedSelectedColumns = { ...selectedColumns };
    selectedRows.forEach((row) => {
      delete updatedSelectedColumns[row];
    });
    setSelectedColumns(updatedSelectedColumns);
  };

  const handleCopyRows = () => {
    const selectedData = rows.filter((field) =>
      selectedRows.includes(field.fieldname)
    );
    setRows((prevRows) => [...prevRows, ...selectedData]);
    setSelectedRows([]); // Clear selected rows after copying
  };

  const handleAddRow = () => {
    // Add a new blank row to the rows list
    const newRow = {
      fieldname: `New Field ${rows.length + 1}`,
      value: `New Value ${rows.length + 1}`,
    };
    setRows((prevRows) => [...prevRows, newRow]);
  };

  // Update selected columns whenever rows change
  useEffect(() => {
    const updatedSelectedColumns = rows.reduce((acc, row) => {
      const selectedValue = selectedColumns[row.fieldname];
      acc[row.fieldname] =
        selectedValue || getBestMatch(row.fieldname, headers);
      return acc;
    }, {});
    setSelectedColumns(updatedSelectedColumns);
  }, [rows, headers]);

  return (
    <>
      <h3 className="text-lg font-semibold mb-4 text-pink-600">
        Select Columns to Import:
      </h3>

      {/* Table for the Field Mapping */}
      <table className="min-w-full table-auto border-separate border-spacing-1">
        <thead className="bg-pink-100 text-sm font-semibold text-purple-600">
          <tr>
            <th className="border flex items-start px-2 py-1">
              {/* Checkbox for Select All */}
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRows(rows.map((row) => row.fieldname));
                  } else {
                    setSelectedRows([]);
                  }
                }}
                checked={selectedRows.length === rows.length}
              />
            </th>
            <th className="border px-2 py-1">Field Name</th>
            <th className="border px-2 py-1">Select Column</th>
          </tr>
        </thead>
        <tbody>
          {/* Row 1: Show Field Names */}
          {rows.map((row, index) => {
            const value = {
              label: selectedColumns[row.fieldname],
              value: selectedColumns[row.fieldname],
            };

            return (
              <tr key={index} className="hover:bg-purple-50 text-sm">
                <td className="border-b px-2 py-1">
                  {/* Checkbox to select individual rows */}
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.fieldname)}
                    onChange={() => handleSelectRow(row.fieldname)}
                  />
                </td>
                <td className="border-b px-2 py-1">
                  {/* Fieldname with an asterisk (*) if it's required */}
                  <span
                    className={`font-semibold ${
                      row.reqd ? "text-red-500" : "text-purple-900"
                    }`}
                  >
                    {row.fieldname}
                    {row.reqd && " *"}
                  </span>
                </td>
                <td className="px-2 py-1">
                  {/* Row 2: Dropdown for selecting closest header match */}
                  <Select
                    options={formattedOptions}
                    value={value || row.fieldname} // Single value for now, update if needed for multi-selection
                    onChange={(selectedOption) => {
                      setSelectedColumns((prevState) => ({
                        ...prevState,
                        [row.fieldname]: selectedOption?.value,
                      }));
                    }}
                    placeholder="Select column"
                    classNamePrefix="custom-select"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        minHeight: "32px",
                        borderColor: "#D1D5DB", // Light gray border
                        boxShadow: "none",
                      }),
                      option: (provided) => ({
                        ...provided,
                        padding: "8px",
                      }),
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Table Actions */}
      <TableActions
        handleAddRow={handleAddRow}
        handleDeleteRows={handleDeleteRows}
        handleCopyRows={handleCopyRows}
        selectedRows={selectedRows}
      />

      <h4 className="text-md font-medium mb-2 text-purple-800 mt-6">
        Sample Data (First 5 Rows):
      </h4>

      {/* Container for the scrollable table */}
      <SampleTable headers={headers} displayedData={displayedData} />
    </>
  );
};

export default ImportFieldMapping;
