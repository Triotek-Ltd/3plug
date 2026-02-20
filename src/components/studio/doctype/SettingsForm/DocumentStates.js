import React, { useState, useEffect } from "react";
import { useConfig } from "@/contexts/ConfigContext";
import SettingTable from "./fields/SettingTable";

const DocumentStates = () => {
  const { localConfig, setLocalConfig } = useConfig();
  const [config, setConfig] = useState(localConfig);

  // Update the localConfig from the context whenever it changes
  useEffect(() => {
    setConfig(localConfig);
  }, [localConfig]);

  // Handler to update the value when an input is changed
  const handleInputChange = (name, value) => {
    setConfig((prevConfig) => {
      const updatedConfig = { ...prevConfig, [name]: value };
      setLocalConfig(updatedConfig); // Assuming setLocalConfig updates the context
      return updatedConfig;
    });
  };

  return (
    <div className="grid grid-cols-1 p-4 gap-4 h-fit">
      {/* Default Email Template */}
      <SettingTable
        label="States"
        item={{
          name: "module",
          label: "States",
          fieldtype: "Link",
          fieldname: "states",
          options: "DocType State",
          title_field: "title",
        }}
        value={config.states}
        onChange={(e) => handleInputChange("states", e)}
        description="This is the default template used for emails."
      />
    </div>
  );
};

export default DocumentStates;
