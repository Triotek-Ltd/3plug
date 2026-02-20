// GeneralSettings.js
import React from "react";
import {
  faTag,
  faIdBadge,
  faList,
  faBold,
  faColumns,
  faLink,
  faExclamation,
  faEyeSlash,
  faLock,
  faUserShield,
  faSearch,
  faClipboard,
  faClipboardCheck,
  faRuler,
  faPuzzlePiece,
  faFilter,
  faChartBar,
  faFile,
  faGlobe,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import {
  TextInput,
  CheckboxInput,
  TextareaInput,
  SelectInput,
  NumberInput,
} from "./InputComponents";
import fields from "@/data/fields";
import { useConfig } from "@/contexts/ConfigContext";
import { handleInputChange } from "../utils/handleInputChange";
import LinkSelect from "@/components/pages/new/LinkSelect";

const GeneralSettings = () => {
  const fieldOptions = fields.map((field) => ({
    value: field.name,
    label: field.name,
  }));

  const { selectedItem, setSelectedItem, localConfig, setLocalConfig } =
    useConfig();

  const handleChange = (field, value) => {
    handleInputChange(
      field,
      value,
      selectedItem,
      setSelectedItem,
      localConfig,
      setLocalConfig
    );
  };

  return (
    <div className="p-3 bg-white grid gap-4">
      {/* Field Type */}
      <SelectInput
        icon={faList}
        label="Field Type"
        value={selectedItem?.fieldtype}
        onChange={(e) => handleChange("fieldtype", e.value)}
        options={fieldOptions}
      />

      {/* General Attributes */}
      <TextInput
        icon={faTag}
        label="Label"
        value={selectedItem?.label}
        onChange={(e) => handleChange("label", e.target.value)}
        placeholder="Enter label"
      />
      <TextInput
        icon={faIdBadge}
        label="Field Name"
        value={selectedItem?.fieldname}
        onChange={(e) => handleChange("fieldname", e.target.value)}
        placeholder="Enter field name"
      />

      {/* Conditional Attributes */}
      {["Link", "Table MultiSelect", "Table", "Connection"].includes(
        selectedItem?.fieldtype
      ) && (
        <>
          <LinkSelect
            icon={faLink}
            label="Options"
            value={selectedItem?.options}
            handleChange={(_, e) => handleChange("options", e)}
            placeholder="Enter target Doctype"
            name="options"
            endpoint="document"
            field={{
              name: "Document",
              label: "Options",
              filter_on: "doctype",
              title_field: "name",
              search_fields: ["name", "id", "module", "app"],
            }}
          />
          <CheckboxInput
            key={"unique"}
            label="Is Section?"
            value={selectedItem?.is_section}
            onChange={(e) => handleChange("is_section", e.target.checked)}
          />
          <NumberInput
            icon={faRuler}
            label="Columns"
            value={selectedItem?.columns}
            onChange={(e) => handleChange("columns", e.target.value)}
            placeholder="Enter number of columns"
          />
        </>
      )}

      {["Connection"].includes(selectedItem?.fieldtype) && (
        <TextInput
          icon={faFilter}
          label="Linked Field"
          value={selectedItem?.linked_field}
          onChange={(e) => handleChange("linked_field", e.target.value)}
          placeholder="Enter the linked field"
        />
      )}
      {["Currency", "Float"].includes(selectedItem?.fieldtype) && (
        <NumberInput
          icon={faRuler}
          label="Precision"
          value={selectedItem?.precision || 2}
          onChange={(e) => handleChange("precision", e.target.value)}
          placeholder="Enter precision"
        />
      )}
      {["Select", "QR Code", "Barcode"].includes(selectedItem?.fieldtype) && (
        <TextareaInput
          icon={faList}
          label="Options"
          value={selectedItem?.options}
          onChange={(e) => handleChange("options", e.target.value)}
          placeholder="Enter options separated by newline"
        />
      )}
      <TextareaInput
        icon={faClipboard}
        label="Description"
        value={selectedItem?.description}
        onChange={(e) => handleChange("description", e.target.value)}
        placeholder="Enter description"
      />
      {/* Default Value */}
      <TextareaInput
        icon={faExclamation}
        label="Default Value"
        value={selectedItem?.default}
        onChange={(e) => handleChange("default", e.target.value)}
        placeholder="Enter default value"
      />
      <TextareaInput
        icon={faClipboardCheck}
        label="Depends On"
        value={selectedItem?.depends_on}
        onChange={(e) => handleChange("depends_on", e.target.value)}
        placeholder="Enter dependency"
      />

      <TextareaInput
        icon={faList}
        label="Filter Format"
        value={selectedItem?.filter_format}
        onChange={(e) => handleChange("filter_format", e.target.value)}
        description="Enter Expression format for filtering the value. Use eval() function to evaluate the expression"
      />
      <TextareaInput
        icon={faList}
        label="Format"
        value={selectedItem?.format}
        onChange={(e) => handleChange("format", e.target.value)}
        description="Enter Expression format for generating the value eg. format:EXAMPLE-{MM}morewords{fieldname1}-{fieldname2}-{#####} "
      />

      <LinkSelect
        icon={faLink}
        label="Fetch From"
        value={selectedItem?.fetch_from}
        handleChange={(_, e) => handleChange("fetch_from", e)}
        placeholder="Enter target Doctype"
        name="options"
        endpoint="document"
        field={{
          name: "Document",
          label: "Options",
          filter_on: "doctype",
          title_field: "name",
          search_fields: ["name", "id", "module", "app"],
        }}
      />
      <SelectInput
        // icon={faList}
        label=""
        value={selectedItem?.fieldtype}
        onChange={(e) => handleChange("fetch_from_field", e.value)}
        options={fieldOptions}
      />

      {["Attach", "Attach Image"].includes(selectedItem?.fieldtype) && (
        <TextInput
          icon={faPuzzlePiece}
          label="Allowed File Types"
          value={selectedItem?.allowed_file_types}
          onChange={(e) => handleChange("allowed_file_types", e.target.value)}
          placeholder="Enter allowed file types (comma-separated)"
        />
      )}
      {["Table"].includes(selectedItem?.fieldtype) && (
        <TextInput
          icon={faColumns}
          label="Child Table Doctype"
          value={selectedItem?.options}
          onChange={(e) => handleChange("options", e.target.value)}
          placeholder="Enter child Doctype name"
        />
      )}
      {["Data"].includes(selectedItem?.fieldtype) && (
        <SelectInput
          icon={faFilter}
          label="Input Type"
          value={selectedItem?.input_type}
          onChange={(e) => handleChange("input_type", e.value)}
          options={[
            { label: "Email", value: "email" },
            { label: "Phone", value: "phone" },
            { label: "URL", value: "url" },
          ]}
        />
      )}
      {["Check"].includes(selectedItem?.fieldtype) && (
        <TextInput
          icon={faChartBar}
          label="Check Value"
          value={selectedItem?.check_value}
          onChange={(e) => handleChange("check_value", e.target.value)}
          placeholder="Enter check value"
        />
      )}

      {/* Layout and Display */}
      <TextInput
        icon={faColumns}
        label="Columns"
        value={selectedItem?.columns}
        onChange={(e) => handleChange("columns", e.target.value)}
        placeholder="Enter number of columns"
      />
      <TextInput
        icon={faEyeSlash}
        label="Max Height"
        value={selectedItem?.max_height}
        onChange={(e) => handleChange("max_height", e.target.value)}
        placeholder="Enter max height"
      />
      <TextInput
        icon={faClipboard}
        label="Placeholder"
        value={selectedItem?.placeholder}
        onChange={(e) => handleChange("placeholder", e.target.value)}
        placeholder="Enter placeholder"
      />
      <TextareaInput
        icon={faClipboardCheck}
        label="Mandatory Depends On"
        value={selectedItem?.mandatory_depends_on}
        onChange={(e) => handleChange("mandatory_depends_on", e.target.value)}
        placeholder="Enter mandatory condition"
      />

      {/* Checkbox Inputs */}
      {[
        {
          label: "Allow in Quick Entry",
          value: "allow_in_quick_entry",
          description: "Enable to allow this field in quick entry forms.",
        },
        {
          label: "Allow on Submit",
          value: "allow_on_submit",
          description:
            "Enable to allow editing this field even after submission.",
        },
        {
          label: "Mandatory",
          value: "reqd",
          description: "Enable to make this field mandatory.",
        },
        {
          label: "Hide Select",
          value: "hide_select",
          description: "Enable to hide the select option for this field.",
        },
        {
          label: "Bold",
          value: "bold",
          description: "Enable to display this field's label in bold.",
        },
        {
          label: "Hidden",
          value: "hidden",
          description: "Enable to hide this field in forms.",
        },
        {
          label: "Ignore User Permissions",
          value: "ignore_user_permissions",
          description: "Enable to bypass user permissions for this field.",
        },
        {
          label: "In Filter",
          value: "in_filter",
          description: "Enable to include this field in filter options.",
        },
        {
          label: "In Global Search",
          value: "in_global_search",
          description: "Enable to include this field in global search results.",
        },
        {
          label: "In List View",
          value: "in_list_view",
          description: "Enable to display this field in list views.",
        },
        {
          label: "In Standard Filter",
          value: "in_standard_filter",
          description: "Enable to include this field in standard filters.",
        },
        {
          label: "Read Only",
          value: "read_only",
          description: "Enable to make this field read-only.",
        },
        {
          label: "Show on Timeline",
          value: "show_on_timeline",
          description: "Enable to display this field on the timeline.",
        },
        {
          label: "Translatable",
          value: "translatable",
          description: "Enable to allow translations for this field.",
        },
        {
          label: "Unique",
          value: "unique",
          description: "Enable to enforce unique values for this field.",
        },
        {
          label: "Collapsible",
          value: "collapsible",
          description: "Enable to make this field collapsible in forms.",
        },
        {
          label: "No Copy",
          value: "no_copy",
          description: "Enable to prevent copying this field's value.",
        },
        {
          label: "Public in List",
          value: "public_in_list",
          description: "Enable to show this field in public list views.",
        },
        {
          label: "Public in Detail",
          value: "public_in_detail",
          description: "Enable to show this field in public detail views.",
        },
      ].map((checkbox) => (
        <div key={checkbox.value}>
          <CheckboxInput
            label={checkbox.label}
            value={selectedItem ? selectedItem[checkbox.value] : null}
            onChange={(e) => handleChange(checkbox.value, e.target.checked)}
          />
          {checkbox.description && (
            <div className="text-[11px] text-blue-800 pl-6 italic">
              {checkbox.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GeneralSettings;
