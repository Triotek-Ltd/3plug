import React, { useState, useEffect } from "react";
import { useConfig } from "@/contexts/ConfigContext";
import Checkbox from "./fields/Checkbox";
import TextInput from "./fields/TextInput";
import SettingLink from "./fields/SettingLink";

const EmailSettings = () => {
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
    <div className="p-4 grid grid-cols-2 gap-x-6">
      <div className="grid grid-cols-1 gap-4 h-fit">
        {/* Default Email Template */}
        <SettingLink
          label="Default Email Template"
          item={{
            name: "module",
            label: "Default Email Template",
            fieldtype: "Link",
            options: "Email Template",
            title_field: "name",
          }}
          value={config.default_email_template}
          onChange={(e) => handleInputChange("default_email_template", e)}
          description="This is the default template used for emails."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 h-fit">
        {/* Allow document creation via Email */}
        <Checkbox
          label="Allow document creation via Email"
          checked={config.email_append_to || false}
          onChange={(e) =>
            handleInputChange("email_append_to", e.target.checked)
          }
          description="This will allow the creation of documents via email."
        />

        {config?.email_append_to && (
          <>
            {/* Sender Email Field */}
            <TextInput
              label="Sender Email Field"
              value={config.sender_field || ""}
              onChange={(e) =>
                handleInputChange("sender_field", e.target.value)
              }
              description="Specify the field used for the sender's email address."
            />

            {/* Sender Name Field */}
            <TextInput
              label="Sender Name Field"
              value={config.sender_name_field || ""}
              onChange={(e) =>
                handleInputChange("sender_name_field", e.target.value)
              }
              description="Specify the field used for the sender's name."
            />

            {/* Subject Field */}
            <TextInput
              label="Subject Field"
              value={config.subject_field || ""}
              onChange={(e) =>
                handleInputChange("subject_field", e.target.value)
              }
              description="Specify the field used for the subject of the email."
            />
          </>
        )}
      </div>
    </div>
  );
};

export default EmailSettings;
