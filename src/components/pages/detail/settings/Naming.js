import TableTooltip from "@/components/tooltip/TableTooltip";
import { faIdCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Naming = ({ settings, handleChange, initialData }) => {
  return (
    <>
      {/* ID Naming Method */}
      <div className="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border mb-4">
        <div className="flex-auto p-4">
          <div className="flex flex-row justify-between -mx-3">
            <div className="w-full px-2">
              <p className="mb-1 font-sans text-xs font-semibold leading-normal">
                ID Naming Method
              </p>
              <div className="flex flex-row gap-x-2 w-full">
                <TableTooltip content="Select the method to generate IDs for documents.">
                  <select
                    name="idNamingMethod"
                    value={settings.idNamingMethod}
                    onChange={handleChange}
                    className="w-full px-2 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="fieldNaming">Use Field</option>
                    <option value="functionNaming">Use Function</option>
                    <option value="incrementalNaming">Incremental</option>
                    <option value="randomNaming">Random</option>
                    <option value="customNaming">Custom Naming</option>
                  </select>
                </TableTooltip>
                <div className="text-right flex justify-end">
                  <div className="flex items-center justify-center w-10 h-10 text-center rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500">
                    <FontAwesomeIcon
                      icon={faIdCard}
                      className="h-6 w-6 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ID Naming Rule */}
      {(settings.idNamingMethod === "fieldNaming" ||
        settings.idNamingMethod === "functionNaming" ||
        settings.idNamingMethod === "incrementalNaming" ||
        settings.idNamingMethod === "customNaming") && (
        <div className="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border mb-4">
          <div className="flex-auto p-4">
            <div className="flex flex-row justify-between -mx-3">
              <div className="flex-none w-full px-2">
                <div>
                  <p className="mb-1 font-sans text-xs font-semibold leading-normal">
                    {settings.idNamingMethod === "fieldNaming"
                      ? "Field for ID Naming"
                      : settings.idNamingMethod === "functionNaming"
                      ? "Function for ID Naming"
                      : settings.idNamingMethod === "incrementalNaming"
                      ? "Length for Incremental Naming"
                      : "Custom Naming Rule"}
                  </p>
                  <TableTooltip content="Select the field to use for naming IDs.">
                    {settings.idNamingMethod === "fieldNaming" && (
                      <select
                        name="fieldForIdNaming"
                        value={settings.fieldForIdNaming}
                        onChange={handleChange}
                        className="w-full px-2 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select Field</option>
                        {initialData &&
                          initialData?.map((field) => (
                            <option key={field.id} value={field.id}>
                              {field.name}
                            </option>
                          ))}
                      </select>
                    )}
                  </TableTooltip>

                  <TableTooltip content="Enter the function name for generating IDs.">
                    {settings.idNamingMethod === "functionNaming" && (
                      <input
                        type="text"
                        name="functionForIdNaming"
                        value={settings.functionForIdNaming}
                        onChange={handleChange}
                        className="w-full px-2 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter function name"
                      />
                    )}
                  </TableTooltip>

                  <TableTooltip content="Specify the length of the numeric part for incremental ID generation (e.g., 5 for IDs like 00001, 00002).">
                    {settings.idNamingMethod === "incrementalNaming" && (
                      <input
                        type="text"
                        name="lengthForIncrementalNaming"
                        value={settings.lengthForIncrementalNaming}
                        onChange={handleChange}
                        className="w-full px-2 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter length (e.g., 5)"
                      />
                    )}
                  </TableTooltip>

                  <TableTooltip content="Enter the custom naming rule. Use {{field_name}} to insert field values and # for auto-increment. For example, {{charfield_1}}-### will generate IDs like ABC-001, ABC-002.">
                    {settings.idNamingMethod === "customNaming" && (
                      <input
                        type="text"
                        name="idNamingRule"
                        value={settings.idNamingRule}
                        onChange={handleChange}
                        className="w-full px-2 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter custom naming rule"
                      />
                    )}
                  </TableTooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Naming;
