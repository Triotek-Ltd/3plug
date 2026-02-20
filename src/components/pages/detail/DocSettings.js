import React, { useState, useEffect } from "react";
import SettingsPermissionTable from "./settings/SettingsPermissionTable";
import Naming from "@/components/pages/detail/settings/Naming";
import WorkflowTable from "@/components/pages/detail/settings/Workflow"; // Updated import to WorkflowTable
import SecondaryButton from "@/components/core/common/buttons/Secondary";
import TableTooltip from "@/components/tooltip/TableTooltip";

const DocSettings = ({ config, onChange, saveSettings, setting, data }) => {
  const [settings, setSettings] = useState(
    setting || {
      idNamingRule: config.idNamingRule || "",
      idNamingMethod: config.idNamingMethod || "fieldNaming",
      fieldForIdNaming: config.fieldForIdNaming || "",
      functionForIdNaming: config.functionForIdNaming || "",
      lengthForIncrementalNaming: config.lengthForIncrementalNaming || "",
      enableFeature: config.enableFeature || false,
      thresholdValue: config.thresholdValue || "",
      notificationEmail: config.notificationEmail || "",
      permissions: config.permissions || [],
      workflow: config.workflow || [], // Default to empty array for workflows
      enableSMS: config.enableSMS || false, // New setting for SMS
      enableEmail: config.enableEmail || false, // New setting for Email
      smsPhone: config.smsPhone || "", // New field for SMS phone number
      emailAddress: config.emailAddress || "", // New field for Email address
      ...config.otherSettings,
    }
  );

  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (onChange) {
      onChange(settings);
    }
  }, [settings, onChange]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePermissionsChange = (newPermissions) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      permissions: newPermissions.permissions,
    }));
  };

  const handleSave = () => {
    if (saveSettings) {
      saveSettings(settings);
    }
  };

  const handleWorkflowChange = (newWorkflow) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      workflow: newWorkflow,
    }));
  };

  // useEffect(() => {
  //   const fetchInitialData = async () => {
  //     try {
  //       const fieldsModule = await import(
  //         `@/apps/${data.app}/${data.module}/doc/${data.id}/fields.json`
  //       );

  //       if (fieldsModule) {
  //         setInitialData(fieldsModule.default);
  //       }
  //     } catch (error) {
  //       console.error(
  //         `Failed to load fields module, ${error.message || error}`
  //       );
  //     }
  //   };

  //   if (data) {
  //     fetchInitialData();
  //   }
  // }, [data]);

  return (
    <div className="py-2 px-2 flex items-center justify-center">
      <div className="w-full bg-white shadow-soft-xl rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6">Document Settings</h2>
        <div className="grid grid-cols-2 gap-4">
          <Naming
            settings={settings}
            handleChange={handleChange}
            initialData={initialData}
          />
          {/* SMS Feature */}
          <div className="px-2 col-span-1">
            <TableTooltip content="Enable SMS notifications and provide a phone number.">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="enableSMS"
                  checked={settings.enableSMS}
                  onChange={handleChange}
                />
                <span>Enable SMS</span>
              </label>
            </TableTooltip>
            {settings.enableSMS && (
              <input
                type="text"
                name="smsPhone"
                value={settings.smsPhone}
                onChange={handleChange}
                placeholder="Enter SMS phone number"
                className="w-full px-2 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}
          </div>

          {/* Email Feature */}
          <div className="px-2 col-span-1">
            <TableTooltip content="Enable Email notifications and provide an email address.">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="enableEmail"
                  checked={settings.enableEmail}
                  onChange={handleChange}
                />
                <span>Enable Email</span>
              </label>
            </TableTooltip>
            {settings.enableEmail && (
              <input
                type="text"
                name="emailAddress"
                value={settings.emailAddress}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full px-2 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}
          </div>

          {/* Workflow Table */}
          <div className="col-span-2">
            <WorkflowTable
              workflow={settings.workflow}
              onWorkflowChange={handleWorkflowChange}
            />
          </div>

          {/* Permissions */}
          <div className="col-span-2">
            <SettingsPermissionTable
              settings={settings}
              onPermissionsChange={handlePermissionsChange}
            />
          </div>
        </div>
        <button type="button" onClick={handleSave}>
          <SecondaryButton text={"Save Settings"} />
        </button>
      </div>
    </div>
  );
};

export default DocSettings;
