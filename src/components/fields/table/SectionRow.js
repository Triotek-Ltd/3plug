import React, { Suspense, useEffect, useState } from "react";
import Modal from "../../core/common/modal/Modal";
import { getFieldsForTab } from "../../studio/doctype/utils/getFieldsForTab";
import SecondaryButton from "../../core/common/buttons/Secondary";
import CustomButton from "../../core/common/buttons/Custom";
import TableModalSection from "./Section";
import { generateTabList } from "@/components/studio/doctype/utils/generateTabList ";
import PrimaryButton from "@/components/core/common/buttons/Primary";
import { toUnderscoreLowercase } from "@/utils/textConvert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const SectionRow = ({
  configData,
  rowData,
  onChange,
  readOnly,
  rowIndex,
  handleRowEdit,
  handleDeleteRow,
  handleDuplicateRow,
}) => {
  const [editedRowData, setEditedRowData] = useState(rowData);

  const [tabs, setTabs] = useState([]);
  const [tabFields, setTabFields] = useState([]);

  const [selectedTab, setSelectedTab] = useState([]);

  useEffect(() => {
    // Recompute tabs whenever `configData` changes
    const fetchTabs = async () => {
      const uniqueTabs = generateTabList(configData) || [];
      setTabs(uniqueTabs);

      // Default to the first tab if none is selected
      if (uniqueTabs.length > 0) {
        setSelectedTab(uniqueTabs[0]);
      }
    };
    fetchTabs();
  }, [configData]);

  useEffect(() => {
    // Update tabFields when the selected tab changes
    const fetchFields = async () => {
      const sectionFields = getFieldsForTab(configData, selectedTab);
      setTabFields(sectionFields);
    };
    fetchFields();
  }, [selectedTab, configData]);

  const handleInputChange = (key, value) => {
    onChange(key, value);
  };

  const openForm = () => {
    handleRowEdit(rowIndex);
  };

  const openFullForm = () => {
    if (configData?.name && rowData?.id) {
      window.open(
        `/app/${toUnderscoreLowercase(configData?.name)}/${rowData?.id}`,
        "_blank"
      );
    }
  };

  return (
    <div className="w-full border border-gray-400">
      <div className="h-full px-2 w-full bg-white rounded-xl">
        {tabs?.length > 1 && (
          <div className="relative flex items-center px-2 pt-2 text-white rounded-t-xl">
            <ul className="flex pt-2 gap-x-6 list-none bg-transparent">
              <Suspense fallback={<div>Loading Tabs...</div>}>
                {tabs?.map((tab, index) => (
                  <div key={index}>
                    <a
                      onClick={(e) => {
                        setSelectedTab(tab);
                      }}
                      className={`flex items-center font-medium text-base cursor-pointer ${
                        selectedTab.fieldname === tab.fieldname
                          ? "border-b-[1px] border-slate-800  text-purple-700"
                          : "text-slate-900"
                      }`}
                    >
                      {tab.label}
                    </a>
                  </div>
                ))}
              </Suspense>
            </ul>
          </div>
        )}
        <div className="relative flex flex-col w-full justify-between h-full pb-1">
          <Suspense fallback={<div>Loading Sections...</div>}>
            {tabFields?.map((section, index) => (
              <TableModalSection
                key={index}
                section={section}
                form={rowData}
                handleInputChange={handleInputChange}
                openFullForm={openFullForm}
              />
            ))}

            <td
              className={`text-lg flex space-x-4 ${readOnly ? "hidden" : ""}`}
            >
              <button
                className="text-blue-500 text-[14px]"
                onClick={() => openFullForm()}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                className="text-green-500 text-[14px]"
                onClick={() => handleDuplicateRow(rowIndex)}
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
              <button
                className="text-red-500 text-[14px]"
                onClick={() => handleDeleteRow(rowIndex)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </td>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default SectionRow;
