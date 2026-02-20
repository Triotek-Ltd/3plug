import React, { useEffect, useState, lazy, Suspense } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import dynamic from "next/dynamic";

// Lazy-load components and utility functions
const DraggableTab = lazy(() => import("./DraggableTab"));
const Section = dynamic(() => import("./section"), { ssr: false });
const PrimaryButton1 = lazy(() =>
  import("@/components/core/common/buttons/Primary1")
);

import { generateTabList } from "./utils/generateTabList ";
import { getFieldsForTab } from "./utils/getFieldsForTab";

import { useConfig } from "@/contexts/ConfigContext";
import CustomButton from "@/components/core/common/buttons/Custom";
import { addFieldToConfig } from "./utils/addFieldToConfig";

const Canvas = () => {
  const [tabs, setTabs] = useState([]);
  const [tabFields, setTabFields] = useState([]);
  const {
    localConfig,
    setLocalConfig,
    setSelectedItem,
    selectedTab,
    setSelectedTab,
  } = useConfig();

  useEffect(() => {
    // Recompute tabs whenever `localConfig` changes
    const fetchTabs = async () => {
      const uniqueTabs = generateTabList(localConfig) || [];
      setTabs(uniqueTabs);

      // Default to the first tab if none is selected
      if (!selectedTab && uniqueTabs.length > 0) {
        setSelectedTab(uniqueTabs[0]);
      }
    };
    fetchTabs();
  }, [localConfig]);

  useEffect(() => {
    // Update tabFields when the selected tab changes
    const fetchFields = async () => {
      const sectionFields = getFieldsForTab(localConfig, selectedTab);
      setTabFields(sectionFields);
    };
    fetchFields();
  }, [selectedTab, localConfig]);

  const handleFocus = (id) => {
    setSelectedItem(id);
  };

  const handleBlur = () => {
    setSelectedItem(null);
  };

  const handleAddTab = async () => {
    // Add a new Tab field to the config
    const lastField =
      localConfig.field_order[localConfig.field_order.length - 1];
    const newConfig = await addFieldToConfig(localConfig, lastField, "Tab");
    setLocalConfig({ ...newConfig }); // Trigger context update
  };

  return (
    <div className="w-full bg-[#f9f3fd] rounded-md shadow-lg p-2">
      <DndProvider backend={HTML5Backend}>
        <div style={{ backgroundColor: "white" }}>
          <div className="relative flex items-center px-2 pt-2">
            <ul className="flex py-2 gap-x-4 list-none bg-transparent">
              <Suspense fallback={<div>Loading Tabs...</div>}>
                {tabs.map((tab) => (
                  <DraggableTab
                    key={tab.fieldname}
                    tab={tab}
                    handleFocus={handleFocus}
                  />
                ))}
              </Suspense>
              <div onClick={handleAddTab} className="flex items-center">
                <Suspense fallback={<div>+</div>}>
                  <CustomButton text="+" className="px-4" />
                </Suspense>
              </div>
            </ul>
          </div>
          <div>
            <Suspense fallback={<div>Loading Sections...</div>}>
              {tabFields?.map((section, index) => (
                <Section
                  key={index}
                  section={section}
                  handleFocus={handleFocus}
                  handleBlur={handleBlur}
                />
              ))}
            </Suspense>
          </div>
        </div>
      </DndProvider>
    </div>
  );
};

export default Canvas;
