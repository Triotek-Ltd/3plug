import React, { useState, useEffect } from "react";
import { useConfig } from "@/contexts/ConfigContext";
import SettingTable from "./fields/SettingTable";
import SettingLink from "./fields/SettingLink";
import Checkbox from "./fields/Checkbox";
import { useData } from "@/contexts/DataContext";

const PermissionSettings = () => {
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
        label="Permissions"
        item={{
          name: "module",
          label: "Permissions",
          fieldtype: "Link",
          fieldname: "permissions",
          options: "DocPerm",
          title_field: "name",
        }}
        value={config.permissions}
        onChange={(e) => handleInputChange("permissions", e)}
        description="This is the default template used for emails."
      />
      <SettingLink
        label="Restrict To Domain"
        item={{
          name: "module",
          label: "Restrict To Domain",
          fieldtype: "Link",
          options: "Domain",
          title_field: "name",
        }}
        value={config.restrict_to_domain}
        onChange={(e) => handleInputChange("restrict_to_domain", e)}
        description="This is the default template used for emails."
      />
      <Checkbox
        label="User Cannot Search"
        checked={config.cannot_search || false}
        onChange={(e) => handleInputChange("cannot_search", e.target.checked)}
        description="This will hide the sidebar, menu, and comments in the view."
      />
      <Checkbox
        label="User Cannot Create"
        checked={config.read_only || false}
        onChange={(e) => handleInputChange("read_only", e.target.checked)}
        description="This will hide the sidebar, menu, and comments in the view."
      />
    </div>
  );
};

export default PermissionSettings;
