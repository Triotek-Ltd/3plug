import React, { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { snakeCase } from "lodash";
import Modal from "./Modal";
import CustomButton from "../buttons/Custom";
import SecondaryButton from "../buttons/Secondary";
import { useData } from "@/contexts/DataContext";
import { useRouter } from "next/router";
import SampleTable from "./imports/Sample";
import ImportFieldMapping from "./imports/ImportFieldMapping";

const ImportDataModal = ({ isOpen, onRequestClose, onSendData }) => {
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]); // Full data set
  const [displayedData, setDisplayedData] = useState([]); // First 5 rows for preview
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [importErrors, setImportErrors] = useState([]);
  const router = useRouter();

  const { setLoading } = useData();

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    readFile(uploadedFile);
  };

  const readFile = (uploadedFile) => {
    if (!uploadedFile) {
      console.error("No file uploaded.");
      return;
    }

    const fileType = uploadedFile.name.split(".").pop().toLowerCase();
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileResult = event?.target?.result;

      if (!fileResult) {
        console.error("Failed to read file data.");
        return;
      }

      if (fileType === "csv") {
        const csvData = Papa.parse(fileResult, { header: false }); // Do not use first row as header
        processFileData(csvData.data, false); // Pass false to indicate no headers
      } else if (["xls", "xlsx"].includes(fileType)) {
        const workbook = XLSX.read(fileResult, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
        });
        processFileData(sheet, true); // Pass true to indicate headers should be used
      } else if (fileType === "txt") {
        const txtData = fileResult.split("\n").map((row) => row.split("\t"));
        processFileData(txtData, false); // Handle as no headers for txt files
      }
    };

    if (fileType === "csv" || fileType === "txt") {
      reader.readAsText(uploadedFile);
    } else if (["xls", "xlsx"].includes(fileType)) {
      reader.readAsBinaryString(uploadedFile);
    } else {
      console.error("Unsupported file type.");
    }
  };

  const processFileData = (rawData, useHeaders) => {
    if (rawData.length > 0) {
      // Use the first row as headers
      const headerRow = rawData[0].map((header) => snakeCase(header)); // Extract the first row as headers
      const rows = rawData.slice(1).map((row) => {
        return row.reduce((acc, value, index) => {
          acc[headerRow[index]] = value; // Map remaining rows to objects using header keys
          return acc;
        }, {});
      });

      setHeaders(headerRow);
      setData(rows); // Store the complete data set as objects
      // console.log(rows);

      setDisplayedData(rows.slice(0, 5)); // Display only the first 5 rows for preview
    } else {
      console.error("File data is empty.");
    }
  };

  const handleColumnSelection = (fieldname, selectedHeader) => {
    setSelectedColumns((prevSelectedColumns) => ({
      ...prevSelectedColumns,
      [fieldname]: selectedHeader,
    }));
  };

  const handleColumnDelete = (fieldname) => {
    setSelectedColumns((prevSelectedColumns) => {
      const updatedSelectedColumns = { ...prevSelectedColumns };

      // Remove the field from selected columns
      delete updatedSelectedColumns[fieldname];

      return updatedSelectedColumns;
    });
  };

  const handleSendData = async () => {
    setLoading(true);

    const filteredData = data.map((row) => {
      const filteredRow = {};

      // Iterate over selectedColumns to replace values accordingly
      Object.keys(selectedColumns).forEach((field) => {
        const targetField = field; // This is the key in the selectedColumns object (e.g., "name")
        const mappedColumn = selectedColumns[field]; // This is the value, representing the mapped column (e.g., "name", "stock_uom_id")

        // Check if the mapped column exists in the row and use it
        if (row[mappedColumn] !== undefined) {
          filteredRow[targetField] = row[mappedColumn];
        } else {
          filteredRow[targetField] = null; // Or you can leave it as undefined, depending on your requirements
        }
      });

      return filteredRow;
    });

    const res = await onSendData(filteredData);
    if (res) {
      if (res?.data?.errors) {
        setImportErrors(res.data.errors); // Capture errors from response
      } else if (res?.error) {
        setImportErrors(res.error);
        onRequestClose();
      } else {
        onRequestClose();
        router.reload();
      }
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onRequestClose}
      position="top"
      className="!pt-10"
    >
      <div className="grid !w-[70vw] !min-h-[50vh]">
        <h2 className="text-xl font-semibold mb-6">Import Data</h2>
        {importErrors.length > 0 && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Errors occurred:</strong>
            <ul className="list-inside text-left">
              {importErrors.map((error, index) => (
                <li key={index} className="break-words text-gray-800">
                  <strong className="text-red-600">
                    {index + 1}. {error.error}
                  </strong>
                  :{" "}
                  {JSON.stringify(error.data).split(" ").slice(0, 5).join(" ")}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="border-4 grid grid-cols-1 items-center justify-center border-dashed p-6 mb-4 rounded-lg transition-all duration-200">
          <FiUploadCloud className="mx-auto text-5xl text-gray-400 mb-4" />
          <label className="w-full flex items-center justify-center">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden" // Hide the default file input
            />
            <span className="block w-1/2 text-center bg-purple-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-purple-600 transition-all duration-200">
              {file ? file.name : "Select File"}
            </span>
          </label>
        </div>
        {headers.length > 0 && (
          <ImportFieldMapping
            headers={headers}
            displayedData={displayedData}
            selectedColumns={selectedColumns}
            handleColumnSelection={handleColumnSelection}
            setSelectedColumns={setSelectedColumns}
          />
        )}

        <div className="flex justify-end items-center space-x-4 mt-4 text-gray-100">
          <CustomButton
            onClick={onRequestClose}
            text={"Cancel"}
            className={"!text-base !px-6"}
          />
          <SecondaryButton
            onClick={handleSendData}
            text={"Import Data"}
            className={"!text-base !py-1 !px-6"}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ImportDataModal;
