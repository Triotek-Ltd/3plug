import React, { useState, useEffect } from "react";
import { useConfig } from "@/contexts/ConfigContext";
import SettingTable from "./fields/SettingTable";

const LinkedDocuments = () => {
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
        label="Links"
        item={{
          name: "module",
          label: "Links",
          fieldtype: "Link",
          fieldname: "links",
          options: "DocType Link",
          title_field: "name",
        }}
        value={config.links}
        onChange={(e) => handleInputChange("links", e)}
        description="This is the default template used for emails."
      />
    </div>
  );
};

export default LinkedDocuments;
