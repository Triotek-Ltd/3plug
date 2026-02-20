import React, { useState, useEffect } from "react";
import { useConfig } from "@/contexts/ConfigContext";
import Checkbox from "./fields/Checkbox";
import TextInput from "./fields/TextInput";

const WebViewSettings = () => {
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
    <div className="grid grid-cols-1 gap-6 p-4">
      {/* Has Web View */}
      <Checkbox
        label="Has Web View"
        checked={config.has_web_view || false}
        onChange={(e) => handleInputChange("has_web_view", e.target.checked)}
        description="Enables the ability to view this content via a web view."
      />

      {/* Allow Guest to View */}
      <Checkbox
        label="Allow Guest to View"
        checked={config.allow_guest_to_view || false}
        onChange={(e) =>
          handleInputChange("allow_guest_to_view", e.target.checked)
        }
        description="Allow guests to view the content without authentication."
      />

      {/* Index Web Pages for Search */}
      <Checkbox
        label="Index Web Pages for Search"
        checked={config.index_web_pages_for_search || false}
        onChange={(e) =>
          handleInputChange("index_web_pages_for_search", e.target.checked)
        }
        description="This will index the web pages for search engines."
      />

      {/* Route */}
      <TextInput
        label="Route"
        value={config.route || ""}
        onChange={(e) => handleInputChange("route", e.target.value)}
        description="Specify the route for the web view."
      />

      {/* Is Published Field */}
      <TextInput
        label="Is Published Field"
        value={config.is_published_field || ""}
        onChange={(e) =>
          handleInputChange("is_published_field", e.target.value)
        }
        description="Specify the field that indicates if the content is published."
      />

      {/* Website Search Field */}
      <TextInput
        label="Website Search Field"
        value={config.website_search_field || ""}
        onChange={(e) =>
          handleInputChange("website_search_field", e.target.value)
        }
        description="Specify the field used for website search."
      />
    </div>
  );
};

export default WebViewSettings;
