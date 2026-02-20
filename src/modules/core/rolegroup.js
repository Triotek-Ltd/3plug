import {
  faCalendarDay,
  faClock,
  faRepeat,
  faCalendarAlt,
  faCalendarWeek,
} from "@fortawesome/free-solid-svg-icons";

const rolegroupFields = [
  {
    name: "Name",
    type: "text",
    id: "name",
    search: false,
    list: true,
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
                id: "permissions",
                name: "Permissions",
                use_list: true,
                icon: {
                  prefix: "fas",
                  iconName: "permissions",
                  icon: [
                    640,
                    512,
                    [],
                    "f0c0",
                    "M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z",
                  ],
                },
                id1: "permissions",
                type: "ManyToManyField",
                doc: "core.Permission",
                list: false,
                fieldlist: "id\nname\ncodename\ncontent_type",
                totalsfields: "",
              },
            ],
            id1: "column_1",
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
export const rolegroupDetailConfig = {
  endpoint: "core/rolegroup",
  fields: fields,
};

// Configurations for ListTable
export const rolegroupListConfig = {
  name: "rolegroups",
  fields: rolegroupFields,
  data: [],
};

// Configurations for NewDoc
export const newRolegroupConfig = {
  endpoint: "core/rolegroup",
  name: "rolegroup",
  fields: fields,
  data: [],
};
