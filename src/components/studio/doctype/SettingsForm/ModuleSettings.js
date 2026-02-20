import React, { useState, useEffect } from "react";
import { useConfig } from "@/contexts/ConfigContext";
import LinkField from "@/components/fields/LinkField";
import { toUnderscoreLowercase } from "@/utils/textConvert";
import Checkbox from "./fields/Checkbox";

const ModuleSettings = () => {
  const { localConfig, setLocalConfig } = useConfig(); // Assume setLocalConfig is available
  const [config, setConfig] = useState(localConfig); // Local state for config

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

  const item = {
    name: "module",
    label: "Module",
    fieldtype: "Link",
    options: "Module",
    title_field: "name",
  };

  const print = {
    name: "print_format",
    label: "Print Format",
    fieldtype: "Link",
    options: "Print Format",
    title_field: "name",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 p-4 border-b border-gray-100">
      {/* Module */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">Module</label>
        <div className="p-1 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out">
          <LinkField
            field={item}
            value={toUnderscoreLowercase(config?.module) || ""}
            onChange={(e) => handleInputChange("module", e)}
          />
        </div>
      </div>
      {/* Print */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">
          Default Print Format
        </label>
        <div className="p-1 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out">
          <LinkField
            field={print}
            value={toUnderscoreLowercase(config?.default_print_format) || ""}
            onChange={(e) => handleInputChange("default_print_format", e)}
          />
        </div>
      </div>

      {/* Is Submittable */}
      <Checkbox
        label="Is Submittable"
        checked={config.is_submittable || false}
        onChange={(e) => handleInputChange("is_submittable", e.target.checked)}
        description="Once submitted, submittable documents cannot be changed. They can only be Cancelled and Amended."
      />

      {/* Is Child Table */}
      <Checkbox
        label="Is Child Table"
        checked={config.istable || false}
        onChange={(e) => handleInputChange("istable", e.target.checked)}
        description="Child Tables are shown as a Grid in other DocTypes."
      />

      {config?.istable && (
        <Checkbox
          label="Edidatble Grid"
          checked={config.editable_grid || false}
          onChange={(e) => handleInputChange("editable_grid", e.target.checked)}
          description="Child Tables are shown as a Grid in other DocTypes."
        />
      )}
      {/* Is Single */}
      <Checkbox
        label="Is Single"
        checked={config.issingle || false}
        onChange={(e) => handleInputChange("issingle", e.target.checked)}
        description="Single Types have only one record with no tables associated. Values are stored in tabSingles."
      />

      {/* Is Tree */}
      <Checkbox
        label="Is Tree"
        checked={config.is_tree || false}
        onChange={(e) => handleInputChange("is_tree", e.target.checked)}
        description="Tree structures are implemented using Nested Set."
      />

      {/* Is Calendar and Gantt */}
      <Checkbox
        label="Is Calendar and Gantt"
        checked={config.is_calendar_and_gantt || false}
        onChange={(e) =>
          handleInputChange("is_calendar_and_gantt", e.target.checked)
        }
        description="Enables Calendar and Gantt views."
      />

      {/* Quick Entry */}
      <Checkbox
        label="Quick Entry"
        checked={config.quick_entry || false}
        onChange={(e) => handleInputChange("quick_entry", e.target.checked)}
        description="Open a dialog with mandatory fields to create a new record quickly."
      />

      {/* Track Changes */}
      <Checkbox
        label="Track Changes"
        checked={config.track_changes || false}
        onChange={(e) => handleInputChange("track_changes", e.target.checked)}
        description="If enabled, changes to the document are tracked and shown in the timeline."
      />

      {/* Track Seen */}
      <Checkbox
        label="Track Seen"
        checked={config.track_seen || false}
        onChange={(e) => handleInputChange("track_seen", e.target.checked)}
        description="If enabled, the document is marked as seen, the first time a user opens it."
      />

      {/* Track Views */}
      <Checkbox
        label="Track Views"
        checked={config.track_views || false}
        onChange={(e) => handleInputChange("track_views", e.target.checked)}
        description="If enabled, document views are tracked, this can happen multiple times."
      />

      {/* Custom? */}
      <Checkbox
        label="Custom?"
        checked={config.custom || false}
        onChange={(e) => handleInputChange("custom", e.target.checked)}
      />

      {/* Beta */}
      <Checkbox
        label="Beta"
        checked={config.beta || false}
        onChange={(e) => handleInputChange("beta", e.target.checked)}
      />

      {/* Is Virtual */}
      <Checkbox
        label="Is Virtual"
        checked={config.is_virtual || false}
        onChange={(e) => handleInputChange("is_virtual", e.target.checked)}
      />
    </div>
  );
};

export default ModuleSettings;
