import { exportToExcel } from "@/utils/excelUtils";
import React, { useState } from "react";
import Modal from "./Modal";
import CustomButton from "../buttons/Custom";
import SecondaryButton from "../buttons/Secondary";

const ExportModal = ({ data, fields, fileName, isOpen, onClose }) => {
  const [selectedFields, setSelectedFields] = useState([]);

  const handleFieldChange = (field) => {
    setSelectedFields((prevState) =>
      prevState.includes(field)
        ? prevState.filter((item) => item !== field)
        : [...prevState, field]
    );
  };

  const handleExport = () => {
    // Filter the data based on selected fields
    const filteredData = data.map((item) =>
      selectedFields.reduce((obj, field) => {
        if (item[field] !== undefined) {
          obj[field] = item[field];
        }
        return obj;
      }, {})
    );

    // Call the export function
    exportToExcel(filteredData, fileName);

    // Close the modal after exporting
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} position="top" className="!pt-20">
      <div className="max-w-5xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Select Fields to Export
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-4">
          {fields?.map((field) => (
            <li key={field.fieldname} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedFields.includes(field.fieldname)}
                onChange={() => handleFieldChange(field.fieldname)}
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">{field.label}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-end items-center space-x-4 mt-4 text-gray-100">
          <CustomButton
            onClick={onClose}
            text={"Cancel"}
            className={"!text-lg !px-6"}
          />
          <SecondaryButton
            onClick={handleExport}
            text={"Export"}
            className={"!text-base !py-2 !px-6"}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;
