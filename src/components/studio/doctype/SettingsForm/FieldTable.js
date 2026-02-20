import React, { useState, useEffect } from "react";
import { useConfig } from "@/contexts/ConfigContext";
import SettingTable from "./fields/SettingTable";

const FieldTable = () => {
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
        label="Fields"
        item={{
          name: "module",
          label: "Fields",
          fieldtype: "Link",
          fieldname: "fields",
          options: "DocField",
          title_field: "name",
        }}
        value={config.fields}
        onChange={(e) => handleInputChange("fields", e)}
        description="This is the default template used for emails."
        ordered={true}
      />
    </div>
  );
};

export default FieldTable;
