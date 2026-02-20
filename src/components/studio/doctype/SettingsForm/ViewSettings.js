import React, { useState, useEffect } from "react";
import { useConfig } from "@/contexts/ConfigContext";
import Checkbox from "./fields/Checkbox";
import TextInput from "./fields/TextInput";
import Select from "./fields/Select"; // Import Select if you plan to use a dropdown

const ViewSettings = () => {
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
        {/* Title Field */}
        <TextInput
          label="Title Field"
          value={config.title_field || ""}
          onChange={(e) => handleInputChange("title_field", e.target.value)}
        />

        {/* Show Title in Link Fields */}
        <Checkbox
          label="Show Title in Link Fields"
          checked={config.show_title_field_in_link || false}
          onChange={(e) =>
            handleInputChange("show_title_field_in_link", e.target.checked)
          }
          description="This will show the title in linked fields."
        />

        {/* Translate Link Fields */}
        <Checkbox
          label="Translate Link Fields"
          checked={config.translated_doctype || false}
          onChange={(e) =>
            handleInputChange("translated_doctype", e.target.checked)
          }
          description="This will enable translation for link fields."
        />

        {/* Search Fields */}
        <TextInput
          label="Search Fields"
          value={config.search_fields || ""}
          onChange={(e) => handleInputChange("search_fields", e.target.value)}
        />

        {/* Default Print Format */}
        <TextInput
          label="Default Print Format"
          value={config.default_print_format || ""}
          onChange={(e) =>
            handleInputChange("default_print_format", e.target.value)
          }
        />

        {/* Default Sort Field */}
        <TextInput
          label="Default Sort Field"
          value={config.sort_field || "modified"}
          onChange={(e) => handleInputChange("sort_field", e.target.value)}
        />

        {/* Default Sort Order */}
        <Select
          label="Default Sort Order"
          value={config.sort_order || "ASC"}
          onChange={(e) => handleInputChange("sort_order", e.target.value)}
          options={[
            { label: "Ascending (ASC)", value: "ASC" },
            { label: "Descending (DESC)", value: "DESC" },
          ]}
        />

        {/* Default View */}
        <Select
          label="Default View"
          value={config.default_view}
          onChange={(e) => handleInputChange("default_view", e.target.value)}
          options={[
            { label: "", value: "" },
            { label: "List", value: "List" },
            { label: "Report", value: "Report" },
            { label: "Dashboard", value: "Dashboard" },
            { label: "Kanban", value: "Kanban" },
          ]}
          description="This will set the default view for the document."
        />

        {/* Force Re-route to Default View */}
        <Checkbox
          label="Force Re-route to Default View"
          checked={config.force_re_route_to_default_view || false}
          onChange={(e) =>
            handleInputChange(
              "force_re_route_to_default_view",
              e.target.checked
            )
          }
          description="This will force a re-route to the default view if enabled."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 h-fit">
        {/* Show in Module Section */}
        <Select
          label="Show in Module Section"
          value={config.document_type || ""}
          onChange={(e) => handleInputChange("document_type", e.target.value)}
          options={[
            { label: "", value: "" },
            { label: "Document", value: "Document" },
            { label: "Setup", value: "Setup" },
            { label: "System", value: "System" },
            { label: "Other", value: "Other" },
          ]}
        />

        {/* Icon */}
        <TextInput
          label="Icon"
          value={config.icon || "fa fa-envelope"}
          onChange={(e) => handleInputChange("icon", e.target.value)}
        />

        {/* Color */}
        <TextInput
          label="Color"
          value={config.color || ""}
          onChange={(e) => handleInputChange("color", e.target.value)}
        />

        {/* Show Preview Popup */}
        <Checkbox
          label="Show Preview Popup"
          checked={config.show_preview_popup || false}
          onChange={(e) =>
            handleInputChange("show_preview_popup", e.target.checked)
          }
          description="This will enable the preview popup feature."
        />

        {/* Make 'name' searchable in Global Search */}
        <Checkbox
          label="Make 'name' searchable in Global Search"
          checked={config.name_searchable || false}
          onChange={(e) =>
            handleInputChange("name_searchable", e.target.checked)
          }
          description="This will make the 'name' field searchable in global search."
        />

        {/* Make APIs Public */}
        <Checkbox
          label="Make APIs Public"
          checked={config.is_public || false}
          onChange={(e) => handleInputChange("is_public", e.target.checked)}
          description="Enable to make this DocType's APIs publicly accessible."
        />
      </div>
    </div>
  );
};

export default ViewSettings;
