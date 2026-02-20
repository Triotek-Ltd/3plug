import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import DataTableView from "@/components/pages/detail/DataTableView";
import LinkView from "@/components/pages/detail/LinkView";
import MultiSelectView from "@/components/pages/detail/MultiSelectView";
import {
  faCheck,
  faTimes,
  faDownload,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate, formatDateTime } from "@/utils/DateFormat";

const fieldTypes = {
  AddressField: "textarea",
  BarcodeField: "barcode",
  BooleanField: "checkbox",
  CharField: "text",
  DateField: "date",
  DateTimeField: "datetime",
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

const renderField = (field, data) => {
  const fieldType = fieldTypes[field.type] || "text";
  const baseStyle = "w-full";

  const fileUrl =
    typeof data[field.id] === "string" && data[field.id].includes("/media")
      ? data[field.id]
          .replace("/media", "/apis/media")
          .replace("http://masafa", "https://masafa")
      : data[field.id];

  const renderDownloadIcon = (url, altText) => {
    const handleDownload = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok.");

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = altText;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    };

    return (
      <div className="absolute top-2 left-2 flex flex-row gap-x-4 p-2 bg-opacity-80 bg-slate-100 rounded-lg backdrop-blur-xl">
        <a href={url} download className="text-green-500 hover:text-green-700">
          <FontAwesomeIcon icon={faEye} size="lg" />
        </a>
        <button
          onClick={handleDownload}
          className="text-blue-500 hover:text-blue-700"
          aria-label={`${altText} ${url?.split("/")[-1]}`}
        >
          <FontAwesomeIcon icon={faDownload} size="lg" />
        </button>
      </div>
    );
  };

  switch (fieldType) {
    case "textarea":
      return <div className={`${baseStyle} h-fit`}>{data[field.id]}</div>;
    case "date":
      return (
        <div className={`${baseStyle} h-fit`}>{formatDate(data[field.id])}</div>
      );
    case "datetime":
      return (
        <div className={`${baseStyle} h-fit`}>
          {formatDateTime(data[field.id])}
        </div>
      );
    case "checkbox":
      return (
        <div className="form-checkbox h-5 w-5 text-green-600">
          {data[field.id] ? (
            <FontAwesomeIcon icon={faCheck} />
          ) : (
            <FontAwesomeIcon icon={faTimes} />
          )}
        </div>
      );
    case "link":
      return <LinkView field={field} data={data} />;
    case "multiselect":
      return <MultiSelectView field={field} data={data} />;
    case "image":
      return (
        <div className="relative flex flex-row items-start">
          <img
            src={fileUrl}
            alt="image"
            className="w-full shadow-soft-sm rounded-xl"
          />
          {renderDownloadIcon(fileUrl, `${data.id} - ${field.id}`)}
        </div>
      );
    case "barcode":
      return (
        <div className="relative flex flex-row items-start">
          <img
            src={fileUrl}
            alt="barcode"
            className="w-fit h-fit shadow-soft-sm rounded-xl"
          />
          {renderDownloadIcon(fileUrl, `${data.id} - ${field.id}`)}
        </div>
      );
    case "file":
      return (
        <div className="relative flex flex-row items-start">
          <a
            href={fileUrl}
            download
            className="text-blue-500 hover:text-blue-700"
          >
            {data[field.id]}
          </a>
          {renderDownloadIcon(fileUrl, `${data.id} - ${field.id}`)}
        </div>
      );
    case "table":
      return (
        <DataTableView fieldData={data} list={data[field.id]} field={field} />
      );
    default:
      return (
        <div className={`${baseStyle} text-gray-900`}>
          {data[field.id] || data[field.id1]}
        </div>
      );
  }
};

const evaluateDisplayOn = (displayOn, data) => {
  try {
    const [key, expectedValue] = displayOn
      .split("==")
      .map((str) => str.trim().replace(/"/g, ""));
    const actualValue = data[key]?.toString().trim();

    return actualValue === expectedValue;
  } catch (error) {
    return false;
  }
};

const DocumentFieldList = ({ fields, data }) => {
  const [selectedTab, setSelectedTab] = useState(fields[0].id);

  const handleTabClick = (tabId) => {
    setSelectedTab(tabId);
  };

  const renderFields = (fields) => {
    return fields?.map((field, index) => {
      if (field.display_on && !evaluateDisplayOn(field.display_on, data)) {
        return null;
      }

      return (
        <div key={index} className="w-full mb-2 flex flex-col">
          <p className="mb-1 font-sans text-sm font-semibold leading-normal">
            {field.name}
          </p>
          <div className="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-md bg-clip-border">
            <div className="flex-auto p-3">
              <div className="flex flex-row justify-between -mx-3">
                <div className="flex-none w-full max-w-full px-2">
                  <div>
                    <h5 className="mb-0 font-bold">
                      {renderField(field, data)}
                    </h5>
                  </div>
                </div>
                <div className="-ml-12 px-2 text-right flex justify-end">
                  <div className="flex items-center justify-center w-6 h-6 text-center rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500">
                    <FontAwesomeIcon
                      icon={field.icon}
                      className="h-4 w-4 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  const renderColumns = (columns) => {
    return columns?.map((column, index) => (
      <div key={index} className="w-full">
        {renderFields(column.fields)}
      </div>
    ));
  };

  const renderSections = (sections) => {
    return sections?.map((section, index) => (
      <div key={index} className="w-full flex flex-row gap-x-4 mb-2">
        {renderColumns(section.columns)}
      </div>
    ));
  };

  const renderTabs = () => {
    return (
      <div className="flex">
        {fields?.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`px-2 py-2 m-1 text-xs rounded ${
              selectedTab === tab.id
                ? "inline-block px-4 py-2 font-bold text-center text-white uppercase align-middle transition-all bg-transparent rounded-lg cursor-pointer leading-pro text-xs ease-soft-in shadow-soft-md bg-150 bg-gradient-to-tl from-gray-900 to-slate-800 hover:shadow-soft-xs active:opacity-85 hover:scale-102 tracking-tight-soft bg-x-25"
                : "inline-block px-4 py-2 font-bold text-center text-gray-900 uppercase align-middle transition-all bg-transparent rounded-lg cursor-pointer leading-pro text-xs ease-soft-in shadow-soft-md bg-150 bg-gradient-to-tl from-gray-200 to-slate-200 hover:shadow-soft-xs active:opacity-85 hover:scale-102 tracking-tight-soft bg-x-25"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="py-4">
      {renderTabs()}
      <div className="grid grid-cols-1 gap-2 m-2">
        {fields?.map((tab) => (
          <div
            key={tab.id}
            className={`transition-opacity duration-300 ${
              tab.id === selectedTab ? "opacity-100" : "hidden"
            }`}
          >
            {tab?.sections?.map((section) => (
              <div
                key={section.id}
                className="shadow-lg shadow-slate-300 rounded-md px-4 pt-6"
              >
                <h3 className="text-xl font-semibold mb-2">{section.name}</h3>
                {renderSections([section])}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentFieldList;
