import React from "react";
import { useConfig } from "@/contexts/ConfigContext";

const Tab = ({ tab, handleFocus, setShowLogs }) => {
  const { selectedTab, setSelectedTab } = useConfig();

  const handleSectionClick = (e) => {
    preventPropagation(e);
    handleFocus(tab);
  };

  const preventPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div>
      <a
        onClick={(e) => {
          handleSectionClick(e);
          setSelectedTab(tab);
          setShowLogs(false);
        }}
        className={`flex items-center font-medium text-base  cursor-pointer ${
          selectedTab.fieldname === tab.fieldname
            ? "border-b-[1px] border-slate-800  text-purple-700 "
            : "text-slate-900"
        }`}
      >
        {tab.label}
      </a>
    </div>
  );
};

export default Tab;
