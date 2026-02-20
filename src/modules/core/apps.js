import {
  faBox,
  faInfoCircle,
  faNewspaper,
  faStoreSlash,
  faCog, // Icon for settings (license and platform configuration)
  faEnvelope, // Icon for email
  faLink, // Icon for URL
  faCopyright, // Icon for license
  faDesktop, // Icon for platforms (e.g., Web, Android, iOS)
  faUser, // Icon for publisher
  faImage, // Icon for image upload (app icon)
} from "@fortawesome/free-solid-svg-icons";

// Common fields configuration
const commonFields = [
  {
    name: "ID",
    type: "text",
    id: "id",
    icon: faBox,
    bgColor: "green",
  },
  {
    name: "Status",
    type: "select",
    id: "status",
    icon: faStoreSlash,
    in_list_view: true,
    options: [
      {
        label: "Active",
        value: "Active",
        style: "from-green-600 to-lime-400",
      },
      {
        label: "Disabled",
        value: "Disabled",
        style: "from-slate-600 to-slate-300",
      },
    ],
  },
  {
    name: "Name",
    type: "text",
    in_list_view: true,
    id: "name",
    icon: faNewspaper,
  },
  {
    name: "Description",
    type: "textarea",
    id: "description",
    required: false,
    icon: faInfoCircle,
  },
  {
    name: "License",
    type: "select",
    id: "license",
    in_list_view: true,
    icon: faCopyright, // Icon for license
    options: [
      { label: "MIT", value: "MIT" },
      { label: "GPL-3.0", value: "GPL-3.0" },
      { label: "Apache-2.0", value: "Apache-2.0" },
      { label: "BSD", value: "BSD" },
      { label: "Custom", value: "Custom" }, // Option for custom license
    ],
  },
  {
    name: "Supported Platforms",
    type: "multiselect", // Multi-select for platforms
    id: "supported_platforms",
    icon: faDesktop, // Icon for platforms
    options: [
      { label: "Web", value: "Web" },
      { label: "Android", value: "Android" },
      { label: "iOS", value: "iOS" },
      { label: "Windows", value: "Windows" },
      { label: "Linux", value: "Linux" },
      { label: "MacOS", value: "MacOS" },
      { label: "Custom", value: "Custom" }, // Option to add custom platform
    ],
  },
  {
    name: "Publisher",
    type: "text",
    id: "publisher",
    icon: faUser, // Icon for publisher
    required: false,
  },
  {
    name: "Email",
    type: "email",
    id: "email",
    icon: faEnvelope, // Icon for email
    required: false,
  },
  {
    name: "App URL",
    type: "url",
    id: "app_url",
    icon: faLink, // Icon for app URL
    required: false,
  },
  {
    name: "Version",
    type: "text",
    id: "version",
    icon: faCog, // Icon for version
    required: true, // Version is now a required field
    default: "0.0.1",
    description: "Enter the version of your app", // Additional info for the field
  },
  {
    name: "App Icon", // Field for app icon upload
    type: "file", // Type 'file' for image upload
    id: "app_icon", // ID for the field
    icon: faImage, // Icon for app icon upload
    required: false,
    description: "Upload an icon for your app", // Additional info for the field
  },
];

// Filters for ListTable
export const appFilters = {
  status: {
    type: "select",
    options: [
      { value: "", label: "All" },
      { value: "Active", label: "Active" },
      { value: "Disabled", label: "Disabled" },
    ],
  },
  name: {
    type: "text",
  },
  id: {
    type: "text",
  },
};

// Configurations for DocDetail
export const appDetailConfig = {
  endpoint: "apps",
  fields: commonFields.filter((field) => field.name !== "ID"),
};

// Configurations for ListTable
export const appListConfig = {
  name: "Apps",
  fields: commonFields,
  data: [],
};

// Configurations for NewDoc (creating a new app)
export const newAppConfig = {
  endpoint: "apps",
  name: "App",
  fields: commonFields.filter((field) => field.name !== "ID"),
  data: [],
};
