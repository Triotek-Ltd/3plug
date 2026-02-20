import React, { useState, useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import { useTableLogic } from "./table/useTableLogic";
import TableModal from "./table/TableModal";
import TableActions from "./table/TableActions";
import Table from "./table";
import LinkSelectField from "./LinkSelectField";

const TableField = ({
  value = [],
  field,
  readOnly,
  preview,
  hidden,
  handleInputChange,
  ordered = false,
}) => {
  const {
    tableData,
    columnsData,
    configData,
    selectedRows,
    editRowIndex,
    isModalOpen,
    selectAll,
    setIsModalOpen,
    handleAddRow,
    handleDeleteRows,
    handleRowEdit,
    handleSelectAll,
    handleCopyRows,
    handleCellChange,
    handleDeleteRow,
    handleDuplicateRow,
    getFieldDetails,
    handleRowSelect,
    handleSelectChange,
  } = useTableLogic({ value, field, handleInputChange });

  const { setForm } = useData();

  const [optionValue, setOptionValue] = useState(
    tableData
      ? tableData?.map((option) => ({
          value: option?.id,
          label: option?.id,
          fullData: option,
        }))
      : null
  );

  useEffect(() => {
    setForm((prevState) => ({
      ...prevState,
      [field?.fieldname]: tableData.filter(
        (row) => !Object.values(row).every((v) => !v)
      ),
    }));
  }, [tableData, field?.fieldname, setForm]);

  if (hidden) return null;

  return (
    <div className="flex flex-col space-y-2 w-full">
      {!readOnly && !field?.hide_select && (
        <div
          className={`relative flex flex-col w-full break-words rounded-md font-bold text-[14px]`}
        >
          <LinkSelectField
            field={field}
            value={optionValue}
            onValueChange={(e) => setOptionValue(e)}
            onChange={handleSelectChange}
          />
        </div>
      )}
      <Table
        columnsData={columnsData}
        tableData={readOnly ? value : tableData}
        selectedRows={selectedRows}
        handleCellChange={handleCellChange}
        handleDeleteRow={handleDeleteRow}
        handleDuplicateRow={handleDuplicateRow}
        handleRowEdit={handleRowEdit}
        handleSelectAll={handleSelectAll}
        selectAll={selectAll}
        readOnly={readOnly}
        preview={preview}
        configData={configData}
        getFieldDetails={getFieldDetails}
        handleRowSelect={handleRowSelect}
        ordered={ordered}
        field={field}
      />

      {!readOnly && !preview && (
        <TableActions
          handleAddRow={handleAddRow}
          handleDeleteRows={handleDeleteRows}
          handleCopyRows={handleCopyRows}
          selectedRows={selectedRows}
          field={field}
        />
      )}

      {isModalOpen && editRowIndex !== null && (
        <TableModal
          rowIndex={editRowIndex}
          configData={configData}
          rowData={tableData[editRowIndex]}
          columnsData={columnsData}
          onClose={() => setIsModalOpen(false)}
          onSave={() => setIsModalOpen(false)}
          onChange={(field, value) => {
            handleCellChange(editRowIndex, field, value);
          }}
        />
      )}
    </div>
  );
};

export default TableField;
