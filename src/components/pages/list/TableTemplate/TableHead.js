import React from "react";

const TableHead = ({ updatedFields, data, handleSelectAll, selectedRows }) => {
  return (
    <thead className="bg-white shodow-lg shadow-black sticky top-0 w-full">
      <tr>
        <th
          className="items-start text-left sticky top-0 z-10 shadow"
          style={{ position: "sticky", top: 0 }}
        >
          <input
            type="checkbox"
            onChange={handleSelectAll}
            checked={selectedRows.length === data.length}
          />
        </th>
        {updatedFields?.map((field, index) => (
          <th
            key={index}
            className="px-2 py-3 font-bold text-left uppercase align-middle shadow text-xs border-b-solid tracking-none text-slate-400 opacity-100 sticky top-0 z-10"
          >
            {field.name || field.label}
          </th>
        ))}
        {data[0]?.modified && (
          <th className="px-2 py-3 font-bold text-left uppercase align-middle shadow text-xs border-b-solid tracking-none text-slate-400 opacity-100 sticky top-0 z-10"></th>
        )}
        <th className="px-2 py-3 font-semibold capitalize align-middle shadow tracking-none text-slate-400 opacity-100 sticky top-0 z-10"></th>
        <th className="px-2 py-3 font-semibold capitalize align-middle shadow tracking-none text-slate-400 opacity-100 sticky top-0 z-10"></th>
      </tr>
    </thead>
  );
};

export default TableHead;
