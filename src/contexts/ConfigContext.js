import React, { createContext, useContext, useState, useEffect } from "react";
import { isEqual } from "lodash";
import { updateConfig } from "@/components/studio/doctype/updateConfig";

// Create Config Context
const ConfigContext = createContext();

export const ConfigProvider = ({
  initialConfig,
  initialAppData,
  children,
  documentData,
}) => {
  const [localConfig, setLocalConfig] = useState(initialConfig);
  const [localAppData, setLocalAppData] = useState(initialAppData);
  const [selectedItem, setSelectedItem] = useState(null);
  const [settings, setSettings] = useState({});
  const [selectedTab, setSelectedTab] = useState(null);
  const [hoveredItem, setHoveredItem] = useState({});
  // Set document data (app, module, doctype) to context
  const [app, setApp] = useState(documentData?.app || "");
  const [module, setModule] = useState(documentData?.module || "");
  const [doctype, setDoctype] = useState(documentData?.doctype || "");

  useEffect(() => {
    const structuredFields = updateConfig(initialConfig);
    if (!isEqual(initialConfig, structuredFields)) {
      setLocalConfig(initialConfig);
    }
  }, [initialConfig]);

  return (
    <ConfigContext.Provider
      value={{
        config: initialConfig,
        localConfig,
        setLocalConfig,
        selectedItem,
        setSelectedItem,
        settings,
        setSettings,
        selectedTab,
        setSelectedTab,
        hoveredItem,
        setHoveredItem,
        app, // Add app to context
        module, // Add module to context
        doctype, // Add doctype to context
        setApp, // Function to update app
        setModule, // Function to update module
        setDoctype, // Function to update doctype
        localAppData,
        setLocalAppData,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

// Custom hook for consuming ConfigContext
export const useConfig = () => useContext(ConfigContext);
