import React, { useEffect, useState } from "react";
import Filters from "../filters";
import { deleteSelectedRows, uploadData } from "@/utils/tableUtils";
import { useRouter } from "next/router";
import TableBody from "./TableBody";
import QuickEntryModalWrapper from "./QuickEntryModalWrapper";
import TableHeader from "./TableHeader";
import TableHead from "./TableHead";
import { useConfig } from "@/contexts/ConfigContext";
import { useModal } from "@/contexts/ModalContext";
import ExportModal from "@/components/core/common/modal/ExportModal";
import ImportDataModal from "@/components/core/common/modal/ImportDataModal";
import { useData } from "@/contexts/DataContext";
import ToastTemplates from "@/components/core/common/toast/ToastTemplates";
import PrintModal from "@/components/functions/print/PrintModal";

const TableTemplate = ({
  tableConfig,
  data,
  filters,
  activeFilters,
  handleFilterChange,
  handleClearFilters,
  applyFilters,
  refresh,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const [form, setForm] = useState([]);
  const [isQuickEntryModalOpen, setIsQuickEntryModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const { openModal } = useModal();
  const { setLoading } = useData();

  const { localAppData } = useConfig();

  const endpoint = localAppData?.endpoint;
  const router = useRouter();

  const { asPath, pathname } = router;

  // Extract the path without query params by splitting asPath on '?' and taking the first part
  const currentPathWithoutParams = asPath.split("?")[0];

  // Construct the new path by appending '/new' to the clean path
  const newPath = `${currentPathWithoutParams}/new`;

  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
      setSelectedRowsData([]);
    } else {
      setSelectedRows(data.map((item) => item.id)); // Select all
      setSelectedRowsData(data.map((item) => item)); // Select all
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
      setSelectedRowsData(selectedRowsData.filter((row) => row.id !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
      setSelectedRowsData([
        ...selectedRowsData,
        data.find((row) => row.id === id),
      ]);
    }
  };

  const onEdit = (item) => {
    // Implement edit logic here
  };

  const onDeleteCallback = (item) => {
    // Implement edit logic here
  };

  const handlePrint = () => {
    const filteredData = data.filter((item) => selectedRows.includes(item.id));
    setForm(filteredData);
    setIsPrintModalOpen(true);
  };

  const handleExcelExport = () => {
    // exportToExcel(selectedRowsData, tableConfig.name || "DataExport");
    setIsExportModalOpen(true);
  };

  // Assuming `deleteSelectedRows` is a function that deletes the selected rows
  const handleDelete = async () => {
    try {
      await deleteSelectedRows(
        tableConfig,
        endpoint,
        selectedRows,
        openModal,
        setLoading,
        refresh
      );
    } catch (error) {
      console.error("Error deleting selected rows:", error);
      ToastTemplates.error(
        "An error occurred while deleting the selected rows."
      );
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  const handleAddButtonClick = () => {
    if (tableConfig.quick_entry) {
      // Open Quick Entry Modal
      setIsQuickEntryModalOpen(true);
    } else {
      // Navigate to Add Page
      router.push(newPath);
    }
  };
  const fields =
    tableConfig?.fields?.filter(
      (field) => field.in_list_view || field.in_list_view === 1
    ) || [];

  // if (!fields.length) {
  //   return <></>;
  // }
  const firstField = { id: "id", fieldname: "id", name: "ID", type: "text" };
  const updatedFields = fields?.some(
    (field) => field.id === "id" || field.fieldname === "id"
  )
    ? fields
    : [
        firstField,
        ...fields.filter(
          (field) => field.id !== "id" && field.fieldname !== "id"
        ),
      ];

  return (
    <>
      <QuickEntryModalWrapper
        isOpen={isQuickEntryModalOpen}
        onClose={() => setIsQuickEntryModalOpen(false)}
        doc={tableConfig?.name}
        configData={tableConfig}
      />
      <div className="flex flex-wrap bg-white">
        <TableHeader
          title={tableConfig?.name}
          onPrint={handlePrint}
          onImport={() => setIsImportModalOpen(true)}
          onExport={handleExcelExport}
          onDelete={handleDelete}
          tableConfig={tableConfig}
          handleAddButtonClick={handleAddButtonClick}
          refresh={refresh}
        />
        <div className="flex-none w-full max-w-full bg-white">
          <Filters
            filters={activeFilters}
            onFilterChange={handleFilterChange}
            handleClearFilters={handleClearFilters}
            config={tableConfig}
            applyFilters={applyFilters}
          />
          <div className="relative flex flex-col min-w-0 break-words bg-white border-0 border-transparent border-solid shadow-soft-xl rounded-md bg-clip-border">
            {/* <TableHeader title={tableConfig?.name} /> */}

            <div className="flex-auto px-0 pt-0 text-[13px] bg-white">
              <div className="px-4 mt-2 overflow-auto max-h-[66vh] min-h-[66vh]">
                <table className="items-center w-full mb-1 align-top border-gray-200 text-slate-500">
                  <TableHead
                    updatedFields={updatedFields}
                    data={data}
                    handleSelectAll={handleSelectAll}
                    selectedRows={selectedRows}
                  />
                  {data && (
                    <TableBody
                      data={data}
                      updatedFields={updatedFields}
                      selectedRows={selectedRows}
                      handleSelectRow={handleSelectRow}
                      currentPathWithoutParams={currentPathWithoutParams}
                      onEdit={onEdit}
                      onDeleteCallback={onDeleteCallback}
                      endpoint={endpoint}
                      setLoading={setLoading}
                      refresh={refresh}
                    />
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
        {isExportModalOpen && (
          <ExportModal
            data={selectedRowsData}
            fields={tableConfig?.fields?.filter(
              (field) => !field?.fieldtype?.includes("Break")
            )}
            fileName={tableConfig.name || "User Data"}
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
          />
        )}
        {/* Import Data Modal */}
        {isImportModalOpen && (
          <ImportDataModal
            isOpen={isImportModalOpen}
            onRequestClose={() => setIsImportModalOpen(false)}
            onSendData={(data) => uploadData(tableConfig, endpoint, data)}
          />
        )}
        {/* {isPrintModalOpen && (
          <PrintModal
            isOpen={isPrintModalOpen}
            onClose={() => setIsPrintModalOpen(false)}
            form={form}
          />
        )} */}
      </div>
    </>
  );
};

export default TableTemplate;
