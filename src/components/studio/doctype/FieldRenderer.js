import React from "react";
import TextField from "@/components/fields/TextField";
import SelectField from "@/components/fields/SelectField";
import LinkField from "@/components/fields/LinkField";
import AttachField from "@/components/fields/AttachField";
import AttachImageField from "@/components/fields/AttachImageField";
import AutocompleteField from "@/components/fields/AutocompleteField";
import BarcodeField from "@/components/fields/BarcodeField";
import ButtonField from "@/components/fields/ButtonField";
import CheckField from "@/components/fields/CheckField";
import ColorField from "@/components/fields/ColorField";
import CurrencyField from "@/components/fields/CurrencyField";
import DataField from "@/components/fields/DataField";
import DateField from "@/components/fields/DateField";
import DatetimeField from "@/components/fields/DatetimeField";
import DurationField from "@/components/fields/DurationField";
import DynamicLinkField from "@/components/fields/DynamicLinkField";
import FloatField from "@/components/fields/FloatField";
import GeolocationField from "@/components/fields/GeolocationField";
import HeadingField from "@/components/fields/HeadingField";
import HtmlField from "@/components/fields/HtmlField";
import IconField from "@/components/fields/IconField";
import ImageField from "@/components/fields/ImageField";
import IntField from "@/components/fields/IntField";
import JsonField from "@/components/fields/JsonField";
import LongTextField from "@/components/fields/LongTextField";
import PasswordField from "@/components/fields/PasswordField";
import PercentField from "@/components/fields/PercentField";
import PhoneField from "@/components/fields/PhoneField";
import RatingField from "@/components/fields/RatingField";
import ReadOnlyField from "@/components/fields/ReadOnlyField";
import SignatureField from "@/components/fields/SignatureField";
import SmallTextField from "@/components/fields/SmallTextField";
import TableField from "@/components/fields/TableField";
import TableMultiSelectField from "@/components/fields/TableMultiSelectField";
import TextEditorField from "@/components/fields/TextEditorField";
import TimeField from "@/components/fields/TimeField";

const FieldRenderer = ({ fieldtype, item, handleInputChange }) => {
  switch (fieldtype) {
    case "Text":
      return (
        <TextField
          value={item.label}
          onChange={(e) =>
            handleInputChange("label", e.target.value, item, "field")
          }
          preview={true}
        />
      );
    case "Select":
      return (
        <SelectField
          value={item.options}
          onChange={(e) =>
            handleInputChange("options", e.target.value, item, "field")
          }
          options={item.options ? item.options.split("\n") : []}
          preview={true}
        />
      );
    case "Link":
      return (
        <LinkField
          value={item.options}
          onChange={(e) =>
            handleInputChange("options", e.target.value, item, "field")
          }
          preview={true}
        />
      );
    case "Attach":
      return (
        <AttachField
          onChange={(e) => handleInputChange("file", e.target.files[0], item)}
          preview={true}
        />
      );
    case "Attach Image":
      return (
        <AttachImageField
          onChange={(e) => handleInputChange("image", e.target.files[0], item)}
          preview={true}
        />
      );
    case "Autocomplete":
      return (
        <AutocompleteField
          value={item.label}
          onChange={(e) =>
            handleInputChange("label", e.target.value, item, "field")
          }
          options={item.options ? item.options.split("\n") : []}
          preview={true}
        />
      );
    case "Barcode":
      return (
        <BarcodeField
          value={item.label}
          onChange={(e) =>
            handleInputChange("label", e.target.value, item, "field")
          }
          preview={true}
        />
      );
    case "Button":
      return (
        <ButtonField
          label={item.label}
          onClick={() => handleInputChange("action", null, item)}
          preview={true}
        />
      );
    case "Check":
      return (
        <CheckField
          checked={item.checked}
          onChange={(e) => handleInputChange("checked", e.target.checked, item)}
          preview={true}
        />
      );
    case "Color":
      return (
        <ColorField
          value={item.label}
          onChange={(e) => handleInputChange("label", e.target.value, item)}
          preview={true}
        />
      );
    case "Currency":
      return (
        <CurrencyField
          value={item.label}
          onChange={(e) => handleInputChange("label", e.target.value, item)}
          preview={true}
        />
      );
    case "Data":
      return (
        <DataField
          value={item.label}
          onChange={(e) => handleInputChange("label", e.target.value, item)}
          preview={true}
        />
      );
    case "Date":
      return (
        <DateField
          value={item.label}
          onChange={(e) => handleInputChange("label", e.target.value, item)}
          preview={true}
        />
      );
    case "Datetime":
      return (
        <DatetimeField
          value={item.label}
          onChange={(e) => handleInputChange("label", e.target.value, item)}
          preview={true}
        />
      );
    case "Duration":
      return (
        <DurationField
          value={item.label}
          onChange={(e) => handleInputChange("label", e.target.value, item)}
          preview={true}
        />
      );
    case "Dynamic Link":
      return (
        <DynamicLinkField
          value={item.label}
          onChange={(e) => handleInputChange("label", e.target.value, item)}
          preview={true}
        />
      );
    case "Float":
      return (
        <FloatField
          value={item.label}
          onChange={(e) => handleInputChange("label", e.target.value, item)}
          preview={true}
        />
      );
    case "Geolocation":
      return (
        <GeolocationField
          latitude={item.latitude}
          longitude={item.longitude}
          onLatitudeChange={(e) =>
            handleInputChange("latitude", e.target.value, item)
          }
          onLongitudeChange={(e) =>
            handleInputChange("longitude", e.target.value, item)
          }
          preview={true}
        />
      );
    case "Heading":
      return <HeadingField text={item.label} preview={true} />;
    case "HTML":
      return <HtmlField html={item.htmlContent} preview={true} />;
    case "Icon":
      return (
        <IconField
          icon={item.icon}
          onChange={(icon) => handleInputChange("icon", icon, item)}
          preview={true}
        />
      );
    case "Image":
      return (
        <ImageField
          value={item.image}
          onChange={(e) => handleInputChange("image", e.target.files[0], item)}
          preview={true}
        />
      );
    case "Int":
      return (
        <IntField
          value={item.label}
          onChange={(e) => handleInputChange("label", e.target.value, item)}
          preview={true}
        />
      );
    case "JSON":
      return (
        <JsonField
          value={item.json}
          onChange={(e) => handleInputChange("json", e.target.value, item)}
          preview={true}
        />
      );
    case "Long Text":
      return (
        <LongTextField
          value={item.label}
          onChange={(e) => handleInputChange("label", e.target.value, item)}
          preview={true}
        />
      );
    case "Password":
      return (
        <PasswordField
          value={item.label}
          onChange={(e) => handleInputChange("label", e.target.value, item)}
          preview={true}
        />
      );
    case "Percent":
      return (
        <PercentField
          value={item.label}
          onChange={(e) => handleInputChange("label", e.target.value, item)}
          preview={true}
        />
      );
    case "Phone":
      return (
        <PhoneField
          value={item.label}
          onChange={(e) => handleInputChange("label", e.target.value, item)}
          preview={true}
        />
      );
    case "Rating":
      return (
        <RatingField
          value={item.rating}
          onChange={(rating) => handleInputChange("rating", rating, item)}
          preview={true}
        />
      );
    case "Read Only":
      return <ReadOnlyField value={item.label} preview={true} />;
    case "Signature":
      return (
        <SignatureField
          value={item.signature}
          onChange={(e) => handleInputChange("signature", e.target.value, item)}
          preview={true}
        />
      );
    case "Small Text":
      return (
        <SmallTextField
          value={item.label}
          onChange={(e) => handleInputChange("label", e.target.value, item)}
          preview={true}
        />
      );
    case "Table":
      return (
        <TableField
          data={item.data}
          onChange={(data) => handleInputChange("data", data, item)}
          preview={true}
        />
      );
    case "Table MultiSelect":
      return (
        <TableMultiSelectField
          selectedItems={item.selectedItems}
          onChange={(items) => handleInputChange("selectedItems", items, item)}
          preview={true}
        />
      );
    case "Text Editor":
      return (
        <TextEditorField
          content={item.content}
          onChange={(content) => handleInputChange("content", content, item)}
          preview={true}
        />
      );
    case "Time":
      return (
        <TimeField
          value={item.label}
          onChange={(e) => handleInputChange("label", e.target.value, item)}
          preview={true}
        />
      );
    default:
      return null;
  }
};

export default FieldRenderer;
