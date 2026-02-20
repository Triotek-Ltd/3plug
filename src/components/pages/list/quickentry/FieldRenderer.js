import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTextWidth,
  faCode,
  faFileAlt,
  faCalendar,
  faClock,
  faDollarSign,
  faPercentage,
  faPhone,
  faFileUpload,
  faImage,
  faCheckSquare,
  faPaintBrush,
  faLink,
  faMapMarkerAlt,
  faSignature,
  faEye,
  faTable,
  faHtml5,
  faStar,
  faExclamationCircle,
  faFileCode,
  faHeading,
  faFileImage,
  faSearch,
  faListUl,
} from "@fortawesome/free-solid-svg-icons";

import TextField from "@/components/fields/TextField";
import SelectField from "@/components/fields/SelectField";
import DateField from "@/components/fields/DateField";
import ButtonField from "@/components/fields/ButtonField";
import CheckField from "@/components/fields/CheckField";
import ReadOnlyField from "@/components/fields/ReadOnlyField";
import AttachField from "@/components/fields/AttachField";
import DataField from "@/components/fields/DataField";
import LinkField from "@/components/fields/LinkField";
import TableField from "@/components/fields/TableField";
import HtmlField from "@/components/fields/HtmlField";
import GeolocationField from "@/components/fields/GeolocationField";
import TextAreaField from "@/components/fields/TextAreaField";
import DatetimeField from "@/components/fields/DatetimeField";
import TimeField from "@/components/fields/TimeField";
import ColorField from "@/components/fields/ColorField"; // Assuming you have a ColorField component
import SignatureField from "@/components/fields/SignatureField"; // Assuming you have a SignatureField component
import JsonField from "@/components/fields/JsonField";

const FieldRenderer = ({
  fieldtype,
  item,
  value,
  handleInputChange,
  placeholder,
  label,
  minimal = false,
}) => {
  const fieldTypeMapping = {
    Text: { type: "text", icon: faTextWidth },
    Data: { type: "text", icon: faFileAlt },
    "Small Text": { type: "textarea", icon: faTextWidth },
    "Long Text": { type: "textarea", icon: faFileAlt },
    Password: { type: "password", icon: faEye },
    "HTML Editor": { type: "textarea", icon: faHtml5 },
    "Markdown Editor": { type: "textarea", icon: faCode },
    "Text Editor": { type: "textarea", icon: faFileCode },
    Code: { type: "textarea", icon: faCode },
    Select: { type: "select", icon: faListUl },
    Autocomplete: { type: "autocomplete", icon: faSearch },
    "Table MultiSelect": { type: "multiselect", icon: faTable },
    Date: { type: "date", icon: faCalendar },
    Datetime: { type: "datetime-local", icon: faClock },
    Time: { type: "time", icon: faClock },
    Duration: { type: "duration", icon: faClock },
    Int: { type: "number", icon: faFileAlt },
    Float: { type: "number", icon: faFileAlt },
    Currency: { type: "number", icon: faDollarSign },
    Percent: { type: "number", icon: faPercentage },
    Rating: { type: "rating", icon: faStar },
    Attach: { type: "file", icon: faFileUpload },
    "Attach Image": { type: "image", icon: faFileImage },
    Check: { type: "checkbox", icon: faCheckSquare },
    Color: { type: "color", icon: faPaintBrush },
    Link: { type: "link", icon: faLink },
    "Dynamic Link": { type: "link", icon: faLink },
    Geolocation: { type: "geolocation", icon: faMapMarkerAlt },
    Signature: { type: "signature", icon: faSignature },
    "Read Only": { type: "text", icon: faEye },
    Button: { type: "button", icon: faCheckSquare },
    Barcode: { type: "barcode", icon: faFileAlt },
    Icon: { type: "icon", icon: faPaintBrush },
    Heading: { type: "heading", icon: faHeading },
    HTML: { type: "html", icon: faHtml5 },
    Image: { type: "image", icon: faImage },
    JSON: { type: "json", icon: faFileAlt },
    Table: { type: "table", icon: faTable },
    Phone: { type: "tel", icon: faPhone }, // Added Phone as per the list
  };

  const fieldInfo = fieldTypeMapping[fieldtype] || {
    type: "unsupported",
    icon: faExclamationCircle,
  };
  const { type: generalType, icon } = fieldInfo;

  // Render label with field if applicable
  const renderLabel = () => {
    if (minimal || !label) return null;
    if (generalType === "checkbox" || generalType === "table") {
      return (
        <div
          className={`mb-1 ${
            generalType === "table" ? "mb-1" : "flex items-center"
          }`}
        >
          {label}
        </div>
      );
    }
    return (
      <div className="text-xs -mt-2 px-1 mx-1 bg-white rounded-md mb- w-fit text-gray-700">
        {label}
      </div>
    );
  };

  const renderIcon = () => {
    if (minimal) return null;
    return (
      <div className="px-1 text-right flex justify-end">
        <div className="flex items-center justify-center w-5 h-5 text-center rounded-md bg-gradient-to-tl from-purple-700 to-pink-500">
          <FontAwesomeIcon icon={icon} className="h-3 w-3 text-white" />
        </div>
      </div>
    );
  };

  switch (generalType) {
    case "text":
    case "number":
    case "password":
      return (
        <>
          <div className="text-right flex justify-between w-full">
            <TextField
              field={item}
              type={generalType}
              value={value}
              onChange={(e) => handleInputChange(item, e.target.value)}
              // placeholder={placeholder}
            />
          </div>
        </>
      );
    case "textarea":
      return (
        <>
          <div className="text-right flex justify-between w-full">
            <TextAreaField
              field={item}
              value={value}
              onChange={(e) => handleInputChange(item, e.target.value)}
              rows={4}
              // placeholder={placeholder}
            />
          </div>
        </>
      );
    case "select":
      return (
        <>
          <div className="text-right flex justify-between w-full">
            <SelectField
              field={item}
              value={value}
              onChange={(e) => handleInputChange(item, e.target.value)}
              options={item.options ? item.options.split("\n") : []}
              multiple={false}
              // placeholder={placeholder}
            />
          </div>
        </>
      );
    case "autocomplete":
      return (
        <>
          <div className="text-right flex justify-between w-full">
            <SelectField
              field={item}
              value={value}
              onChange={(e) => handleInputChange(item, e.target.value)}
              options={item.options ? item.options.split("\n") : []}
              autocomplete={true}
              // placeholder={placeholder}
            />
          </div>
        </>
      );
    case "multiselect":
      return (
        <>
          <div className="text-right flex justify-between w-full">
            <SelectField
              field={item}
              value={value}
              onChange={(items) => handleInputChange(item, items)}
              options={item.options ? item.options.split("\n") : []}
              multiple={true}
              // placeholder={placeholder}
            />
          </div>
        </>
      );
    case "date":
      return (
        <>
          <div className="text-right flex justify-between w-full">
            <DateField
              field={item}
              value={value}
              onChange={(e) => {
                handleInputChange(item, e);
              }}
              // placeholder={placeholder}
            />
          </div>
        </>
      );
    case "datetime-local":
      return (
        <>
          <div className="text-right flex justify-between w-full">
            <DatetimeField
              field={item}
              value={value}
              onChange={(e) => {
                handleInputChange(item, e);
              }}
              // placeholder={placeholder}
            />
          </div>
        </>
      );
    case "time":
      return (
        <>
          <div className="text-right flex justify-between w-full">
            <TimeField
              field={item}
              value={value}
              onChange={(e) => {
                handleInputChange(item, e);
              }}
              // placeholder={placeholder}
            />
          </div>
        </>
      );
    case "file":
    case "image":
      return (
        <>
          <div className="text-right flex justify-between w-full">
            <AttachField
              field={item}
              onChange={(e) => handleInputChange(item, e.target.files[0])}
              // placeholder={placeholder}
            />
          </div>
        </>
      );
    case "checkbox":
      return (
        <div className="flex items-center -my-1">
          <CheckField
            field={item}
            checked={value}
            onChange={(e) => handleInputChange(item, e.target.checked)}
          />
          <span className="ml-2">{label}</span>
        </div>
      );
    case "button":
      return (
        <>
          <ButtonField
            field={item}
            label={item.label}
            onClick={() => handleInputChange(item, null)}
          />
        </>
      );
    case "readonly":
      return (
        <>
          <div className="text-right flex justify-between w-full">
            <ReadOnlyField
              field={item}
              value={value}
              // placeholder={placeholder}
            />
          </div>
        </>
      );
    case "link":
      return (
        <>
          <div className="text-right flex justify-between w-full">
            <LinkField
              field={item}
              value={value}
              onChange={(e) => handleInputChange(item, e)}
            />
          </div>
        </>
      );
    case "geolocation":
      return (
        <>
          <div className="text-right flex justify-between w-full">
            <GeolocationField
              field={item}
              value={value}
              onChange={(location) => handleInputChange(item, location)}
            />
          </div>
        </>
      );
    case "html":
      return (
        <>
          <div className="text-right flex justify-between w-full">
            <HtmlField
              field={item}
              value={value}
              onChange={(content) => handleInputChange(item, content)}
            />
          </div>
        </>
      );
    case "table":
      return (
        <>
          <TableField
            field={item}
            value={value}
            handleInputChange={(items) => handleInputChange(item, items)}
            options={item.options ? item.options.split("\n") : []}
            multiple={true}
          />
        </>
      );
    case "color":
      return (
        <>
          <div className="text-right flex justify-between w-full">
            <ColorField
              field={item}
              value={value}
              onChange={(color) => handleInputChange(item, color)}
              // placeholder={placeholder}
            />
          </div>
        </>
      );
    case "json":
      return (
        <>
          <div className="text-right flex justify-between w-full">
            <JsonField
              value={value}
              onChange={(json) => handleInputChange(item, json)}
            />
          </div>
        </>
      );
    case "signature":
      return (
        <>
          <div className="text-right flex justify-between w-full">
            <SignatureField
              field={item}
              value={value}
              onChange={(signature) => handleInputChange(item, signature)}
            />
          </div>
        </>
      );
    case "unsupported":
    default:
      return (
        <>
          <div className="text-red-500">
            Unsupported field type: {fieldtype}
          </div>
        </>
      );
  }
};

export default FieldRenderer;
