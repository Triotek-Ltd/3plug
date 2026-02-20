import { useState, useEffect } from "react";
import { fetchDocumentData } from "./helpers";

export const useTableLogic = ({ value, field, handleInputChange }) => {
  const [tableData, setTableData] = useState(value || []);
  const [configData, setConfigData] = useState([]);
  const [columnsData, setColumnsData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (!field) return;
    const slug = field?.options?.toLowerCase().replace(/ /g, "_");

    const fetchData = async () => {
      try {
        const { columns, configData } = await fetchDocumentData(slug);
        setColumnsData(columns);
        setConfigData(configData?.content);
      } catch (error) {
        console.error("Error fetching document data:", error.message);
      }
    };

    fetchData();
  }, [field]);

  useEffect(() => {
    if (columnsData.length > 0 && tableData.length === 0) {
      setTableData([]);
    }
  }, [columnsData]);

  const handleRowEdit = (index) => {
    setEditRowIndex(index);
    setIsModalOpen(true);
  };

  const handleAddRow = () => {
    const newData = [...tableData, {}];
    setTableData(newData);
    const newIndex = newData.length - 1;
    setSelectedRows([newIndex]);
    setEditRowIndex(newIndex);
    // setIsModalOpen(true);
  };

  const handleDeleteRows = () => {
    const newTableData = tableData.filter(
      (_, index) => !selectedRows.includes(index)
    );
    setTableData(newTableData.length > 0 ? newTableData : [{}]);
    setSelectedRows([]);
  };

  const handleCellChange = (rowIndex, fieldname, newValue) => {
    const updatedData = [...tableData];
    updatedData[rowIndex] = { ...updatedData[rowIndex], [fieldname]: newValue };
    setTableData(updatedData);

    handleInputChange("value", updatedData);
  };

  const handleSelectChange = (newValue) => {
    const updatedData = [...tableData];

    // Add new entries that are not in the current tableData
    newValue.forEach((newEntry) => {
      if (!updatedData.some((entry) => entry.id === newEntry.id)) {
        updatedData.push(newEntry);
      }
    });

    // Remove entries from tableData that are not in newValue
    const filteredData = updatedData.filter((entry) => {
      if (entry.id) {
        return newValue.some((newEntry) => newEntry.id === entry.id);
      }
      return true;
    });

    setTableData(filteredData);

    handleInputChange("value", filteredData);
  };

  const handleDeleteRow = (rowIndex) => {
    const updatedTableData = tableData.filter((_, index) => index !== rowIndex);
    setTableData(updatedTableData.length > 0 ? updatedTableData : [{}]);
  };

  const handleDuplicateRow = (rowIndex) => {
    const row = { ...tableData[rowIndex] };
    delete row.id;
    setTableData([...tableData, row]);
  };

  const handleCopyRows = () => {
    const rowsToCopy = selectedRows.map((index) => ({ ...tableData[index] }));
    setTableData([...tableData, ...rowsToCopy]);
    setSelectedRows([]);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedRows(selectAll ? [] : tableData.map((_, index) => index));
  };

  const handleRowSelect = (rowIndex) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(rowIndex)) {
        return prevSelectedRows.filter((index) => index !== rowIndex);
      } else {
        return [...prevSelectedRows, rowIndex];
      }
    });
  };

  const getFieldDetails = (fieldname) =>
    configData?.fields?.find((field) => field.fieldname === fieldname);

  return {
    tableData,
    configData,
    columnsData,
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
    handleRowSelect, // added here
    handleSelectChange,
  };
};
