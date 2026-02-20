// DropArea.jsx
import React, { useEffect, useMemo, useState } from "react";
import DraggableTab from "./DraggableTab";
import Section from "./Section";
import PrimaryButton from "@/components/core/common/buttons/Primary";
import { addTab } from "@/components/studio/AddFields";
import PrimaryButton1 from "@/components/core/common/buttons/Primary1";
import { mapFieldsToStructure } from "./fieldStructure";
import { generateTabStructure } from "./utils/generateTabStructure";
import { addFieldToConfig } from "./utils/addFieldToConfig";

const DropArea = ({
  config,
  moveItem,
  handleFocus,
  handleBlur,
  handleInputChange,
  selectedFieldId,
  setLocalConfig,
}) => {
  const [selectedTab, setSelectedTab] = useState(null);
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    const uniqueTabs = generateTabStructure(config);
    setTabs(uniqueTabs);
    if (selectedTab == null) {
      setSelectedTab(uniqueTabs[0]?.label);
    }
  }, [config]);

  const handleTabClick = (tabName) => setSelectedTab(tabName);

  const activeTabContent = tabs.find((tab) => tab.label === selectedTab);

  return (
    <div style={{ backgroundColor: "white" }}>
      <div className="relative flex items-center p-2">
        <ul className="flex py-2 gap-x-2 list-none bg-transparent">
          {tabs.map((tab) => (
            <DraggableTab
              key={tab.fieldname}
              tab={tab}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              handleFocus={handleFocus}
            />
          ))}
          <div
            onClick={() => {
              const lastField =
                config.field_order[config.field_order.length - 1];
              const newConfig = addFieldToConfig(config, lastField, "Tab");

              setLocalConfig({ ...newConfig });
            }}
            className="flex items-center"
          >
            <PrimaryButton1 text="+" className="px-4 py-1" />
          </div>
        </ul>
      </div>
      <div>
        {activeTabContent?.sections.map((section) => (
          <Section
            key={section.fieldname}
            section={section}
            tabId={selectedTab}
            moveItem={moveItem}
            selectedFieldId={selectedFieldId}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            handleInputChange={handleInputChange}
          />
        ))}
      </div>
    </div>
  );
};

export default DropArea;
