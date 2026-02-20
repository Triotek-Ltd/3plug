import React from "react";

const SampleTable = ({ headers, displayedData }) => {
  return (
    <div className="overflow-auto py-2">
      <table className="min-w-full table-auto border-collapse border border-gray-300 mb-4">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="border border-gray-300 px-4 py-2 text-left"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? "bg-gray-100" : ""}
            >
              {headers.map((header, headerIndex) => (
                <td
                  key={headerIndex}
                  className="border border-gray-300 px-4 py-1 text-xs"
                >
                  {row[header]} {/* Display the corresponding value */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SampleTable;
