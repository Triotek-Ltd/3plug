import {
  faCalendarDay,
  faClock,
  faRepeat,
  faCalendarAlt,
  faCalendarWeek,
} from "@fortawesome/free-solid-svg-icons";

const permissionFields = [
  {
    name: "Name",
    type: "text",
    id: "name",
    required: true,
    filter: true,
    icon: faCalendarDay,
    bgColor: "purple",
  },
  {
    name: "Code Name",
    type: "text",
    id: "codename",
    required: true,
    filter: true,
    icon: faCalendarDay,
    bgColor: "purple",
  },
  {
    name: "Content Type",
    type: "text",
    id: "content_type",
    required: true,
    filter: true,
    icon: faCalendarDay,
    bgColor: "purple",
  },
];

export const fields = [
  {
    type: "tab",
    sections: [
      {
        id: "section_1",
        name: "",
        type: "section",
        columns: [
          {
            id: "column_1",
            name: "Column 1",
            type: "column",
            fields: [
              {
                id: "name",
                name: "Name",
                icon: {
                  prefix: "fas",
                  iconName: "font",
                  icon: [
                    448,
                    512,
                    [],
                    "f031",
                    "M254 52.8C249.3 40.3 237.3 32 224 32s-25.3 8.3-30 20.8L57.8 416 32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-1.8 0 18-48 159.6 0 18 48-1.8 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-25.8 0L254 52.8zM279.8 304l-111.6 0L224 155.1 279.8 304z",
                  ],
                },
                id1: "name",
                type: "CharField",
              },
              {
                id: "content_type",
                name: "Content Type",
                icon: {
                  prefix: "fas",
                  iconName: "font",
                  icon: [
                    448,
                    512,
                    [],
                    "f031",
                    "M254 52.8C249.3 40.3 237.3 32 224 32s-25.3 8.3-30 20.8L57.8 416 32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-1.8 0 18-48 159.6 0 18 48-1.8 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-25.8 0L254 52.8zM279.8 304l-111.6 0L224 155.1 279.8 304z",
                  ],
                },
                id1: "content_type",
                type: "CharField",
              },
            ],
            id1: "column_1",
          },
          {
            id: "column_2",
            name: "Column 2",
            type: "column",
            fields: [
              {
                id: "codename",
                name: "Code Name",
                icon: {
                  prefix: "fas",
                  iconName: "font",
                  icon: [
                    448,
                    512,
                    [],
                    "f031",
                    "M254 52.8C249.3 40.3 237.3 32 224 32s-25.3 8.3-30 20.8L57.8 416 32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-1.8 0 18-48 159.6 0 18 48-1.8 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-25.8 0L254 52.8zM279.8 304l-111.6 0L224 155.1 279.8 304z",
                  ],
                },
                id1: "codename",
                type: "CharField",
              },
            ],
            id1: "column_2",
          },
        ],
        id1: "section_1",
        sections: [],
        fields: [],
      },
    ],
    id: "details",
    id1: "details",
    name: "Details",
  },
];

// Configurations for DocDetail
export const permissionDetailConfig = {
  endpoint: "core/permission",
  fields: fields,
};

// Configurations for ListTable
export const permissionListConfig = {
  name: "permissions",
  fields: permissionFields,
  data: [],
};

// Configurations for NewDoc
export const newPermissionConfig = {
  endpoint: "core/permission",
  name: "permission",
  fields: fields,
  data: [],
};
