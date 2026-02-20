import React, { useState, useEffect } from "react";
import { useConfig } from "@/contexts/ConfigContext";
import Checkbox from "./fields/Checkbox";
import TextInput from "./fields/TextInput";

const FormSettings = () => {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
      {/* Image Field */}
      <TextInput
        label={"Image Field"}
        description="Must be of type 'Attach Image'"
        value={config.image_field || ""}
        onChange={(e) => handleInputChange("image_field", e.target.value)}
      />

      {/* Hide Sidebar, Menu, and Comments */}
      <Checkbox
        label="Hide Sidebar, Menu, and Comments"
        checked={config.hide_toolbar || false}
        onChange={(e) => handleInputChange("hide_toolbar", e.target.checked)}
        description="This will hide the sidebar, menu, and comments in the view."
      />
      {/* Timeline Field */}
      <TextInput
        label="Timeline Field"
        description="Comments and Communications will be associated with this linked document"
        value={config.timeline_field || ""}
        onChange={(e) => handleInputChange("timeline_field", e.target.value)}
      />

      {/* Hide Copy */}
      <Checkbox
        label="Hide Copy"
        checked={config.allow_copy || false}
        onChange={(e) => handleInputChange("allow_copy", e.target.checked)}
        description="This will prevent copying of the document."
      />

      {/* Max Attachments */}
      <TextInput
        label="Max Attachments"
        value={config.max_attachments || 0}
        onChange={(e) => handleInputChange("max_attachments", e.target.value)}
      />

      {/* Allow Import (via Data Import Tool) */}
      <Checkbox
        label="Allow Import (via Data Import Tool)"
        checked={config.allow_import || false}
        onChange={(e) => handleInputChange("allow_import", e.target.checked)}
        description="This will allow importing data via the data import tool."
      />

      {/* Allow events in timeline */}
      <Checkbox
        label="Allow events in timeline"
        checked={config.allow_events_in_timeline || false}
        onChange={(e) =>
          handleInputChange("allow_events_in_timeline", e.target.checked)
        }
        description="This will enable events in the timeline."
      />

      {/* Allow Auto Repeat */}
      <Checkbox
        label="Allow Auto Repeat"
        checked={config.allow_auto_repeat || false}
        onChange={(e) =>
          handleInputChange("allow_auto_repeat", e.target.checked)
        }
        description="This will allow auto-repeat functionality for certain actions."
      />

      {/* Make Attachments Public by Default */}
      <Checkbox
        label="Make Attachments Public by Default"
        checked={config.make_attachments_public || false}
        onChange={(e) =>
          handleInputChange("make_attachments_public", e.target.checked)
        }
        description="This will make attachments public by default for all users."
      />
    </div>
  );
};

export default FormSettings;
