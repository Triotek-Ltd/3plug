import {
  faBox,
  faInfoCircle,
  faNewspaper,
  faStoreSlash,
} from "@fortawesome/free-solid-svg-icons";

const commonFields = [
  {
    name: "ID",
    type: "text",
    fieldtype: "Data",
    fieldname: "id",
    label: "ID",
    id: "id",
    options: "",
    endpoint: "",
    icon: faBox,
    bgColor: "green",
    required: true,
    in_list_view: true,
  },
  {
    name: "Module",
    type: "linkselect",
    fieldtype: "Link",
    fieldname: "module",
    label: "Module",
    id: "module",
    options: "Modules",
    endpoint: "modules",
    icon: faBox,
    bgColor: "green",
    required: true,
    in_list_view: true,
  },
  {
    name: "Status",
    type: "select",
    fieldtype: "Select",
    fieldname: "status",
    label: "Status",
    id: "status",
    options: "\nActive\nDisabled",
    icon: faStoreSlash,
    bgColor: "blue",
    required: true,
    in_list_view: true,
  },
  {
    name: "Name",
    type: "text",
    fieldtype: "Data",
    fieldname: "name",
    label: "Name",
    id: "name",
    options: "",
    endpoint: "",
    icon: faNewspaper,
    bgColor: "purple",
    required: true,
    in_list_view: true,
  },
  {
    name: "Description",
    type: "textarea",
    fieldtype: "Text",
    fieldname: "description",
    label: "Description",
    id: "description",
    options: "",
    endpoint: "",
    icon: faInfoCircle,
    bgColor: "orange",
    required: false,
    in_list_view: true,
  },
];

// Filters for ListTable
export const documentFilters = {
  id: {
    type: "text",
    fieldtype: "Data",
    fieldname: "id",
    label: "ID",
  },
  name: {
    type: "text",
    fieldtype: "Data",
    fieldname: "name",
    label: "Name",
  },
  module: {
    type: "text",
    fieldtype: "Data",
    fieldname: "module",
    label: "Module",
  },
  status: {
    type: "select",
    fieldtype: "Select",
    fieldname: "status",
    label: "Status",
    options: "\nActive\nDisabled",
  },
};

// Configurations for DocDetail
export const documentDetailConfig = {
  endpoint: "documents",
  name: "document_detail",
  customize: true,
  isList: false,
  fields: commonFields.filter((field) => field.name !== "ID"),
};

// Configurations for ListTable
export const documentListConfig = {
  name: "documents",
  customize: true,
  isList: true,
  fields: commonFields,
  data: [],
};

// Configurations for NewDoc
export const newdocumentConfig = {
  endpoint: "documents",
  name: "new_document",
  customize: true,
  isList: true,
  fields: commonFields.filter((field) => field.name !== "ID"),
  data: [],
};
