import React, { Suspense, useEffect, useState } from "react";
import Modal from "../../core/common/modal/Modal";
import { getFieldsForTab } from "../../studio/doctype/utils/getFieldsForTab";
import SecondaryButton from "../../core/common/buttons/Secondary";
import CustomButton from "../../core/common/buttons/Custom";
import TableModalSection from "./Section";
import { generateTabList } from "@/components/studio/doctype/utils/generateTabList ";
import PrimaryButton from "@/components/core/common/buttons/Primary";
import { toUnderscoreLowercase } from "@/utils/textConvert";

const TableModal = ({
  configData,
  rowIndex,
  rowData,
  columnsData,
  onClose,
  onSave,
  onChange,
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

  const handleSave = () => {
    onSave(editedRowData);
  };

  return (
    <div className="-mt-2">
      <Modal isOpen={true} onClose={onClose} position={"top"}>
        <div className="h-full px-2 py-2 w-[70vw]">
          <div className="relative flex items-center px-2 pt-2 text-white rounded-t-xl">
            <ul className="flex pt-2 gap-x-6 list-none bg-transparent">
              <Suspense fallback={<div>Loading Tabs...</div>}>
                {tabs.map((tab, index) => (
                  <div key={index}>
                    <a
                      onClick={(e) => {
                        setSelectedTab(tab);
                      }}
                      className={`flex items-center font-medium text-base ${
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
          <Suspense fallback={<div>Loading Sections...</div>}>
            {tabFields?.map((section, index) => (
              <TableModalSection
                key={index}
                section={section}
                form={rowData}
                handleInputChange={handleInputChange}
              />
            ))}
          </Suspense>

          {/* Action Buttons */}
          <div className="flex justify-between items-center space-x-4 mt-4">
            <CustomButton
              onClick={onClose}
              text={"Cancel"}
              className={"text-sm px-4 py-2"}
            />
            <div className="flex justify-end items-center space-x-4">
              {configData?.name && rowData?.id && (
                <PrimaryButton
                  onClick={openFullForm}
                  text={"Edit Full Form"}
                  className={"text-sm px-4 py-2"}
                />
              )}
              <SecondaryButton
                onClick={handleSave}
                text={"Save"}
                className={"text-sm px-4 py-2"}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TableModal;
