import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { timeAgo } from "@/utils/DateFormat";

const DataTable = ({
  data,
  onDelete,
  linkResponse,
  readOnly,
  columns: passedColumns,
  field,
}) => {
  const getColumnHeaders = () => {
    const fieldList = field?.fieldlist?.split("\n") || [];
    // Include default 'id' field
    const fieldsToInclude = ["id", ...fieldList];

    const allKeys = new Set(fieldsToInclude);

    // Format the keys into column headers
    return Array.from(allKeys).map((key) => ({
      label: key.includes(":")
        ? key.split(":")[0]
        : key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()), // Format label
      key,
      formula: key.includes(":") ? key.split(":")[1] : null, // Extract formula if exists
    }));
  };

  const columns = getColumnHeaders();

  const calculateFormula = (item, formula) => {
    if (!formula) return "-";

    try {
      const [operand1, operand2] = formula.split("*");
      const value1 = parseFloat(item[operand1.trim()]);
      const value2 = parseFloat(item[operand2.trim()]);

      if (!isNaN(value1) && !isNaN(value2)) {
        return value1 * value2;
      } else if (!isNaN(value1)) {
        return value1;
      } else if (!isNaN(value2)) {
        return value2;
      } else {
        return "-";
      }
    } catch (error) {
      console.error("Error calculating formula:", error);
      return "-";
    }
  };

  const calculateTotals = () => {
    const totals = {};

    columns.forEach((col) => {
      if (
        field?.totalsfields?.includes(col.key) ||
        field?.totalsfields?.includes(col.label)
      ) {
        totals[col.key] = data?.reduce((sum, item) => {
          const value = col.formula
            ? calculateFormula(item, col.formula)
            : parseFloat(item[col.key]);
          return !isNaN(value) ? sum + value : sum;
        }, 0);
      } else {
        totals[col.key] = "-";
      }
    });

    return totals;
  };

  const totalsRow = calculateTotals();

  const [showComponents, setShowComponents] = useState(false);

  useEffect(() => {
    // Set a timeout to delay the rendering of components
    const timer = setTimeout(() => {
      setShowComponents(true);
    }, 500); // 2000 milliseconds = 2 seconds

    // Cleanup the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showComponents && (
        <div className="border border-slate-300 w-full rounded-lg p-4 bg-white shadow-sm my-4 overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-fuchsia-50 border-b">
                {columns?.map((col) => (
                  <th
                    key={col.key}
                    className="py-2 px-4 text-left text-purple-900"
                  >
                    {col.label}
                  </th>
                ))}
                {!readOnly && (
                  <th className="py-2 px-4 text-left text-purple-900">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-slate-50" : "bg-pink-50"
                  } hover:bg-pink-100`}
                >
                  {columns?.map((col) => (
                    <td key={col.key} className="py-2 px-4 text-slate-700">
                      {col.key === "id" ? (
                        <a
                          href={`/${linkResponse?.data?.app}/${
                            linkResponse?.data?.id
                          }/${item[col.key]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-500 hover:underline"
                        >
                          {item[col.key]}
                        </a>
                      ) : col.key === "created_at" ||
                        col.key === "modified_at" ? (
                        timeAgo(new Date(item[col.key]))
                      ) : col.formula ? (
                        calculateFormula(item, col.formula)
                      ) : item[col.key] !== undefined ? (
                        item[col.key]
                      ) : (
                        "N/A"
                      )}
                    </td>
                  ))}
                  {!readOnly && (
                    <td className="py-2 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="text-red-600 hover:text-red-800"
                        disabled={readOnly}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-200 border-t">
                {columns?.map((col) => (
                  <td
                    key={col.key}
                    className="py-2 px-4 text-slate-700 font-semibold"
                  >
                    {totalsRow[col.key]}
                  </td>
                ))}
                {!readOnly && <td className="py-2 px-4 text-right">-</td>}
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </>
  );
};

export default DataTable;
