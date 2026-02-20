import React, { Suspense, useEffect, useState } from "react";
import Modal from "@/components/core/common/modal/Modal";
import QuickEntryModalSection from "./Section";
import CustomButton from "@/components/core/common/buttons/Custom";
import SecondaryButton from "@/components/core/common/buttons/Secondary";
import { getFieldsForTab } from "@/components/studio/doctype/utils/getFieldsForTab";
import { generateTabList } from "@/components/studio/doctype/utils/generateTabList ";
import { postData } from "@/utils/Api";
import { useRouter } from "next/router";
import { useData } from "@/contexts/DataContext";
import { toUnderscoreLowercase } from "@/utils/textConvert";
import PrimaryButton from "@/components/core/common/buttons/Primary";
import { findDocDetails } from "@/utils/findDocDetails";

const QuickEntryModal = ({
  configData,
  doc,
  initialData = {},
  onClose,
  isOpen,
  onSave,
  redirect = true,
  redirectUrl,
}) => {
  const [editedRowData, setEditedRowData] = useState(initialData);
  const [tabs, setTabs] = useState([]);
  const [tabFields, setTabFields] = useState([]);
  const [selectedTab, setSelectedTab] = useState([]);
  const router = useRouter();
  const { loading, setLoading } = useData();
  const { slug } = router.query;

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
    const updatedRow = { ...editedRowData };
    updatedRow[key] = value;
    setEditedRowData(updatedRow);
  };

  const handleSave = async () => {
    if (onSave) {
      onSave(editedRowData); // Call parent save function
    }
    const response = await saveData(editedRowData);

    onClose(response); // Close the modal after saving
  };

  const fullEdit = () => {
    // router.push(`/app/${toUnderscoreLowercase(doc)}/new`);
    window.open(`/app/${toUnderscoreLowercase(doc)}/new`, "_blank");
  };

  const saveData = async (form) => {
    try {
      setLoading(true);

      const docname = toUnderscoreLowercase(doc);
      const docData = findDocDetails(slug);
      if (!docData) throw new Error("Failed to fetch document details");

      const response = await postData(
        form,
        `${docData?.app_id}/${docname}`,
        true
      );

      if (response.data) {
        const { id: docid } = response.data;
        if (redirect) {
          router.push(redirectUrl || `/app/${docname}/${docid}`);
        } else {
          return response.data;
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="-mt-2">
      <Modal isOpen={isOpen} onClose={onClose} position={"top"}>
        <div className="h-full px-2 py-2 w-[70vw]">
          {/* Tab Navigation */}
          <div className="relative flex items-center px-2 pt-2 text-white rounded-t-xl">
            <ul className="flex pt-2 gap-x-6 list-none bg-transparent">
              <Suspense fallback={<div>Loading Tabs...</div>}>
                {tabs.map((tab) => (
                  <div key={tab.fieldname}>
                    <a
                      onClick={(e) => setSelectedTab(tab)}
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

          {/* Form Sections */}
          <Suspense fallback={<div>Loading Sections...</div>}>
            {tabFields?.map((section, index) => (
              <QuickEntryModalSection
                key={index}
                section={section}
                form={editedRowData}
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
            <div className="flex flex-row space-x-4">
              <PrimaryButton
                onClick={fullEdit}
                text={"Edit Full Form"}
                className={"text-sm px-4 py-2"}
              />
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

export default QuickEntryModal;
