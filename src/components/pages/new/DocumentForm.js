import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LinkSelect from "@/components/pages/new/LinkSelect";

import {
  faFont,
  faHashtag,
  faCalendarAlt,
  faClock,
  faEnvelope,
  faPhone,
  faUser,
  faLock,
  faLink,
  faAddressCard,
  faFile,
  faImage,
  faToggleOn,
  faGlobe,
  faBarcode,
  faFileUpload,
  faFingerprint,
  faKey,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import DocLink from "@/components/pages/new/DocLink";
import ChildTable from "@/components/pages/new/ChildTable";
import MultiSelect from "@/components/pages/new/MultiSelect";
import { useData } from "@/contexts/DataContext";
import { useRouter } from "next/router";

const fieldIcons = {
  TextField: faFont,
  CharField: faFont,
  NumberField: faHashtag,
  FloatField: faHashtag,
  DecimalField: faHashtag,
  BooleanField: faToggleOn,
  DateField: faCalendarAlt,
  DateTimeField: faCalendarAlt,
  TimeField: faClock,
  EmailField: faEnvelope,
  URLField: faLink,
  SlugField: faBarcode,
  UUIDField: faFingerprint,
  IPAddressField: faGlobe,
  FileField: faFileUpload,
  ImageField: faImage,
  PasswordField: faLock,
  PhoneField: faPhone,
  NameField: faUser,
  AddressField: faAddressCard,
  ForeignKey: faKey,
  OneToOneField: faKey,
  ManyToManyField: faUsers,
};

const fieldTypes = {
  AddressField: "textarea",
  BooleanField: "checkbox",
  CharField: "text",
  DateField: "date",
  DateTimeField: "datetime-local",
  DecimalField: "number",
  EmailField: "email",
  FileField: "file",
  FloatField: "number",
  ForeignKey: "link",
  ImageField: "file",
  IPAddressField: "text",
  ManyToManyField: "table",
  NameField: "text",
  NumberField: "number",
  OneToOneField: "link",
  PasswordField: "password",
  PhoneField: "tel",
  SelectField: "select",
  MultiSelectField: "multiselect",
  SmallTextField: "text",
  SlugField: "text",
  TextareaField: "textarea",
  TimeField: "time",
  URLField: "url",
  UUIDField: "text",
};

const DocumentForm = forwardRef(
  ({ config, initialData = [], onSubmit, type = "new" }, ref) => {
    const { data, setData, setForm, form } = useData();
    const [formData, setFormData] = useState({});
    const [activeTab, setActiveTab] = useState(config.fields[0]?.id || "");
    const formRef = useRef(null);
    const router = useRouter();

    if (type !== "new") {
      useEffect(() => {
        const initialFormData = {};
        config.fields.forEach((tab) => {
          tab.sections.forEach((section) => {
            section.columns.forEach((column) => {
              column.fields.forEach((field) => {
                initialFormData[field.id1] = {
                  type: fieldTypes[field.type] || "text",
                  value: initialData?.[field.id1] || "",
                  key: field.id1,
                };
              });
            });
          });
        });
        setFormData(initialFormData);
      }, [initialData]);
    } else {
      useEffect(() => {
        const initialFormData = {};
        config.fields.forEach((tab) => {
          tab.sections.forEach((section) => {
            section.columns.forEach((column) => {
              column.fields.forEach((field) => {
                let initialValue = initialData?.[field.id1] || "";

                // Handle default current date and datetime
                if (!initialValue) {
                  if (field.type === "DateField") {
                    initialValue = new Date().toISOString().split("T")[0]; // Default to current date
                    initialFormData[field.id1] = {
                      type: fieldTypes[field.type] || "text",
                      value: initialValue,
                      key: field.id1,
                    };
                  } else if (field.type === "DateTimeField") {
                    initialValue = new Date().toISOString(); // Default to current datetime
                    initialFormData[field.id1] = {
                      type: fieldTypes[field.type] || "text",
                      value: initialValue,
                      key: field.id1,
                    };
                  }
                }
              });
            });
          });
        });

        setFormData({ ...initialFormData });
      }, []);
    }

    useEffect(() => {
      const query = router.query;
      if (query && Object.keys(query).length > 0) {
        Object.keys(query)?.forEach((q) => {
          config.fields.forEach((tab) => {
            tab.sections.forEach((section) => {
              section.columns.forEach((column) => {
                column.fields.forEach((field) => {
                  if (field.id == q) {
                    handleInputChange(q, query[q], field.type);
                  }
                });
              });
            });
          });
        });
      }
    }, [router.query]);

    const handleInputChange = (name, value, type) => {
      let convertedValue = value;
      switch (type) {
        case "number":
        case "float":
        case "decimal":
          convertedValue = parseFloat(value);
          break;
        case "date":
          convertedValue = value
            ? new Date(value).toISOString().split("T")[0]
            : "";
          break;
        case "datetime-local":
          convertedValue = value ? new Date(value).toISOString() : "";
          break;
        case "time":
          convertedValue = value;
          break;
        default:
          convertedValue = value;
      }

      setFormData((prevFormData) => {
        const newFormData = {
          ...prevFormData,
          [name]: {
            ...prevFormData[name],
            value: convertedValue,
          },
        };

        config.fields.forEach((tab) => {
          tab.sections.forEach((section) => {
            section.columns.forEach((column) => {
              column.fields.forEach((field) => {
                if (
                  field.display_on &&
                  !evaluateDisplayOn(field.display_on, newFormData)
                ) {
                  newFormData[field.id1] = {
                    ...newFormData[field.id1],
                    hidden: true,
                  };
                } else {
                  newFormData[field.id1] = {
                    ...newFormData[field.id1],
                    hidden: false,
                  };
                }
                if (
                  field.required_on &&
                  evaluateDisplayOn(field.required_on, newFormData)
                ) {
                  newFormData[field.id1] = {
                    ...newFormData[field.id1],
                    required: true,
                  };
                }
              });
            });
          });
        });

        return newFormData;
      });
    };

    useEffect(() => {
      setForm(formData);
    }, [formData]);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (onSubmit) {
        onSubmit(formData);
      }
    };

    useImperativeHandle(ref, () => ({
      submit: () => {
        formRef.current?.requestSubmit();
      },
    }));

    const evaluateDisplayOn = (displayOn, data) => {
      try {
        const [key, expectedValue] = displayOn
          ?.split("==")
          ?.map((str) => str.trim().replace(/"/g, ""));
        const actualValue = data[key]?.value.toString().trim();

        return actualValue === expectedValue;
      } catch (error) {
        return false;
      }
    };
    const renderFields = (fields) => {
      return fields?.map((field) => {
        const fieldType = fieldTypes[field.type] || "text";
        if (
          field.display_on &&
          !evaluateDisplayOn(field.display_on, formData)
        ) {
          return null;
        }
        if (
          (field.readonly && fieldType != "table") ||
          formData[field.id1]?.hidden
        ) {
          return null;
        }
        const icon = fieldIcons[field.type] || faFont;
        const commonProps = {
          id: field.id1,
          name: field.id1,
          className:
            "shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5",
          placeholder: field.name,
          required: field.required,
          readOnly: field.readonly,
          hidden: field.hidden,
          onChange: (e) => {
            handleInputChange(e.target.name, e.target.value, fieldType);
          },
          value: formData[field.id1]?.value,
        };

        const fieldConfig = {
          textarea: (
            <textarea
              {...commonProps}
              rows="2"
              className={`${commonProps.className} p-4 h-40`}
            />
          ),
          checkbox: (
            <></>
            // <CustomCheckbox
            //   checked={formData[field.id1]?.value}
            //   onChange={(e) => {
            //     handleInputChange(field.id1, e, fieldType);
            //   }}
            //   borderColor="#d1d5db"
            //   checkmarkColor="green"
            //   size={28}
            //   className="mr-2"
            // />
          ),
          select: (
            <select
              {...commonProps}
              className={`${commonProps.className} p-2 -mb-[4px]`}
            >
              <option key="" value="">
                Select {field.name}
              </option>
              {field?.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ),
          multiselect: (
            <MultiSelect
              name={field.id1}
              options={field.options}
              handleChange={handleInputChange}
              placeholder={`Select ${field.name}`}
              value={formData[field.id1]?.value || []}
              readOnly={field.readonly}
              hidden={field.hidden}
              isNew={type == "new"}
            />
          ),
          linkselect: (
            <LinkSelect
              name={field.id1}
              field={field}
              handleChange={handleInputChange}
              endpoint={field.endpoint}
              placeholder={`Select ${field.name}`}
              readOnly={field.readonly}
              hidden={field.hidden}
              isNew={type == "new"}
            />
          ),
          link: (
            <DocLink
              name={field.id1}
              handleChange={(e) => {
                handleInputChange(field.id1, e.value.id, "text");
              }}
              doc={field.doc}
              placeholder={`Select ${field.name}`}
              readOnly={field.readonly}
              hidden={field.hidden}
              field={field}
              isNew={type == "new"}
            />
          ),
          table: (
            <ChildTable
              name={field.id1}
              handleChange={(e) => {
                handleInputChange(field.id1, e, "list");
              }}
              doc={field.doc}
              field={field}
              initialData={data}
              placeholder={`Select ${field.name}`}
              readOnly={field.readonly}
              hidden={field.hidden}
              type={type}
              isNew={type == "new"}
            />
          ),
          default: <input type={fieldType} {...commonProps} />,
          file: <input type="file" {...commonProps} />,
        };

        return (
          <div key={field.id1} className="col-span-6 sm:col-span-3">
            <label
              htmlFor={field.id1}
              className="text-sm font-medium text-gray-900 block mb-2"
            >
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-6 h-6 text-center rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500">
                  <FontAwesomeIcon icon={icon} className="h-4 w-4 text-white" />
                </div>
                <span>{field.name}</span>
                {field.required ||
                  (evaluateDisplayOn(field.required_on, formData) && (
                    <span className="text-red-600">*</span>
                  ))}
              </div>
            </label>
            {fieldConfig[fieldType] || fieldConfig.default}
          </div>
        );
      });
    };

    const renderColumns = (columns) => {
      return columns?.map((column, index) => (
        <div key={index} className="w-full h-fit grid grid-cols-1 gap-4">
          {renderFields(column.fields)}
        </div>
      ));
    };

    const renderSections = (sections) => {
      return sections?.map((section) => (
        <>
          <h3 className="text-xl font-semibold mb-2">{section.name}</h3>
          <div key={section.id} className="w-full flex flex-row gap-x-2 mb-2">
            {renderColumns(section.columns)}
          </div>
        </>
      ));
    };

    const renderTabs = () => {
      return (
        <div className="flex overflow-x-auto whitespace-nowrap">
          {config?.fields?.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 m-2 text-xs rounded ${
                activeTab === tab.id
                  ? "bg-gradient-to-tl from-gray-900 to-slate-800 text-white"
                  : "bg-gradient-to-tl from-gray-200 to-slate-200 text-gray-900"
              } font-bold text-center uppercase cursor-pointer transition-transform transform hover:scale-105`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      );
    };

    return (
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="py-4 mx-4 space-y-2"
      >
        {renderTabs()}
        <div className="bg-white border border-4 my-8 rounded-lg shadow relative">
          {config?.fields
            ?.filter((tab) => tab.id === activeTab)
            ?.map((tab) =>
              tab?.sections?.map((section) => (
                <div
                  key={section.id}
                  className="shadow-sm shadow-slate-300 rounded-md px-4 py-6"
                >
                  {renderSections([section])}
                </div>
              ))
            )}
        </div>
      </form>
    );
  }
);

export default DocumentForm;
