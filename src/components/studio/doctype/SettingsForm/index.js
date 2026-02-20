import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import ModuleSettings from "./ModuleSettings";
import NamingSettings from "./NamingSettings";
import AdditionalSettings from "./AdditionalSettings";
import PermissionSettings from "./PermissionSettings";
import WebViewSettings from "./WebViewSettings";
import FormSettings from "./FormSettings";
import { View } from "@react-pdf/renderer";
import ViewSettings from "./ViewSettings";
import EmailSettings from "./EmailSettings";
import ActionsSettings from "./ActionsSettings";
import LinkedDocuments from "./LinkedDocuments";
import DocumentStates from "./DocumentStates";
import Field from "../../Field";
import FieldTable from "./FieldTable";

const SettingsForm = () => {
  const sections = [
    {
      Component: ModuleSettings,
      key: "ModuleSettings",
      title: "",
    },
    { Component: NamingSettings, key: "NamingSettings", title: "Naming" },
    {
      Component: FormSettings,
      key: "FormSettings",
      title: "Form Settings",
      collapsible: true,
    },
    {
      Component: ViewSettings,
      key: "ViewSettings",
      title: "View Settings",
      collapsible: true,
    },
    {
      Component: EmailSettings,
      key: "EmailSettings",
      title: "Email Settings",
      collapsible: true,
    },
    {
      Component: PermissionSettings,
      key: "PermissionSettings",
      title: "Permission Rules",
    },
    {
      Component: ActionsSettings,
      key: "ActionsSettings",
      title: "Actions",
      collapsible: true,
    },
    {
      Component: LinkedDocuments,
      key: "LinkedDocuments",
      title: "Linked Documents",
      collapsible: true,
    },
    {
      Component: DocumentStates,
      key: "DocumentStates",
      title: "Document States",
      collapsible: true,
    },
    {
      Component: WebViewSettings,
      key: "WebViewSettings",
      title: "WebView Settings",
    },
    {
      Component: FieldTable,
      key: "FieldTable",
      title: "Fields",
      collapsible: true,
    },
  ];

  const [collapsedSections, setCollapsedSections] = useState(
    sections.reduce((acc, section) => {
      if (section.collapsible) {
        acc[section.key] = true;
      }
      return acc;
    }, {})
  );

  const toggleCollapse = (key) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  return (
    <div className="h-full overflow-y-auto bg-gray-100 rounded-lg pb-6">
      {sections.map(({ Component, key, title, collapsible }) => (
        <div key={key} className="border-b-[1px] border-gray-400">
          {title && (
            <div
              className={`flex justify-start space-x-4 items-center px-4 py-2 ${
                collapsible ? "cursor-pointer" : ""
              }`}
              onClick={collapsible ? () => toggleCollapse(key) : undefined}
            >
              <h2 className="text-lg font-semibold">{title}</h2>
              {collapsible && (
                <FontAwesomeIcon
                  icon={collapsedSections[key] ? faChevronUp : faChevronDown}
                />
              )}
            </div>
          )}
          {(!collapsible || !collapsedSections[key]) && <Component />}
        </div>
      ))}
    </div>
  );
};

export default SettingsForm;
