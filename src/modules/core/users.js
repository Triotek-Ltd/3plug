import {
  faUser,
  faEnvelope,
  faLock,
  faAddressCard,
  faIdBadge,
} from "@fortawesome/free-solid-svg-icons";

// Common fields configuration for User
const userFields = [
  {
    name: "Username",
    type: "text",
    id: "username",
    icon: faUser,
    search: false,
    list: true,
    required: true,
    filter: true,
    bgColor: "blue",
  },
  {
    name: "Password",
    type: "password",
    id: "password",
    icon: faLock,
    required: false,
    bgColor: "blue",
  },
  {
    name: "First Name",
    type: "text",
    id: "first_name",
    search: false,
    list: true,
    required: true,
    filter: true,
    icon: faAddressCard,
    bgColor: "green",
  },
  {
    name: "Last Name",
    type: "text",
    id: "last_name",
    search: false,
    list: true,
    required: true,
    filter: true,
    icon: faAddressCard,
    bgColor: "green",
  },
  {
    name: "Phone",
    type: "tel",
    id: "phone",
    search: false,
    list: true,
    required: true,
    filter: true,
    icon: faLock,
    required: true,
    bgColor: "red",
  },
  {
    name: "Email",
    type: "email",
    id: "email",
    search: false,
    list: true,
    required: false,
    filter: true,
    icon: faEnvelope,
    required: true,
    bgColor: "purple",
  },
  {
    name: "Role",
    type: "select",
    id: "role",
    search: false,
    list: true,
    required: true,
    filter: true,
    icon: faIdBadge,
    options: ["Admin", "Staff", "Customer"],
  },
];

// Filters for ListTable
export const userFilters = {
  username: {
    type: "text",
  },
  email: {
    type: "text",
  },
};

// Configurations for DocDetail (User Detail)
export const userDetailConfig = {
  endpoint: "users",
  fields: userFields.filter((field) => field.name !== "Nn"), // Assuming password isn't displayed in details
}; // Configurations for DocDetail (User Detail)

// Configurations for ListTable (User List)
export const userListConfig = {
  name: "Users",
  fields: userFields.filter((field) => field.name !== "Password"), // Password typically wouldn't be shown in a list
  data: [],
};

// New Configuration: userDocFields
const userDocFields = [
  {
    type: "tab",
    sections: [
      {
        id: "section_1",
        name: "User Information",
        type: "section",
        columns: [
          {
            id: "column_1",
            name: "User Details",
            type: "column",
            fields: userFields
              .filter((_, index) => index % 2 == 0)
              .map((field) => ({
                id: field.id,
                id1: field.id,
                name: field.name,
                icon: field.icon,
                type:
                  field.type === "table"
                    ? "ManyToManyField"
                    : field.type === "select"
                    ? "SelectField"
                    : field.type === "password"
                    ? "PasswordField"
                    : "CharField", // Adjust field type for select
                required: field.required || false,
                bgColor: field.bgColor || "",
                options: field.options || null, // Include options for select fields
              })),
          },
          {
            id: "column_11",
            id1: "column_11",
            name: "User Details",
            type: "column",
            fields: userFields
              .filter((_, index) => index % 2 !== 0)
              .map((field) => ({
                id: field.id,
                id1: field.id,
                name: field.name,
                icon: field.icon,
                type:
                  field.type === "table"
                    ? "ManyToManyField"
                    : field.type === "select"
                    ? "SelectField"
                    : field.type === "password"
                    ? "PasswordField"
                    : "CharField", // Adjust field type for select
                required: field.required || false,
                bgColor: field.bgColor || "",
                options: field.options || null, // Include options for select fields
              })),
          },
        ],
      },

      {
        id: "section_2",
        name: "",
        type: "section",
        columns: [
          {
            id: "column_1",
            name: "Column 1",
            type: "column",
            fields: [
              {
                id: "groups",
                name: "Groups",
                use_list: true,
                icon: {
                  prefix: "fas",
                  iconName: "users",
                  icon: [
                    640,
                    512,
                    [],
                    "f0c0",
                    "M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z",
                  ],
                },
                id1: "groups",
                type: "ManyToManyField",
                doc: "core.Rolegroup",
                fieldlist: "id\nname",
              },
            ],
            id1: "column_1",
            columns: [],
            sections: [],
          },
        ],
        id1: "section_2",
        sections: [],
        fields: [],
      },
    ],

    id: "details",
    name: "Details",
  },
];

export const userDocumentDetailConfig = {
  endpoint: "users",
  fields: userDocFields, // Assuming password isn't displayed in details
};

// Configurations for NewDoc (Create New User)
export const newUserConfig = {
  endpoint: "users",
  name: "User",
  fields: userDocFields,
  data: [],
};
