import React, { useState, useCallback, Suspense } from "react";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import FieldItem from "./FieldItem";

const QuickEntryModalSection = ({ form, section, handleInputChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(section.collapsible === 1);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <div className={clsx("border-b-[1px] border-gray-400 px-2 py-1")}>
      {/* Section Header */}
      {section?.label && (
        <div
          className="flex flex-row w-full justify-between items-center"
          onClick={toggleCollapse}
        >
          <h4 className="text-sm font-semibold pt-2 flex items-center">
            {section.label || ""}
            {section.collapsible === 1 && (
              <button
                className="ml-2 text-gray-600"
                aria-label={isCollapsed ? "Expand section" : "Collapse section"}
              >
                <FontAwesomeIcon
                  icon={isCollapsed ? faChevronDown : faChevronUp}
                  size="sm"
                />
              </button>
            )}
          </h4>
        </div>
      )}

      {/* Section Content */}
      {!isCollapsed && (
        <div className="flex flex-wrap space-x-4 mt-2">
          {section?.columns?.map((column, columnIndex) => (
            <div key={columnIndex} className={clsx("flex-1 rounded-md")}>
              {/* Column Header */}
              <div className="flex flex-row justify-between">
                <h5 className="text-md font-semibold p-2">{column.label}</h5>
              </div>

              {/* Column Fields */}
              {column?.fields?.map((item) => (
                <Suspense fallback={<div>Loading...</div>} key={item.fieldname}>
                  <FieldItem
                    item={item}
                    handleInputChange={handleInputChange}
                    form={form}
                  />
                </Suspense>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickEntryModalSection;
