import React, { useState, useCallback } from "react";
import clsx from "clsx";
import ColumnItem from "./ColumnItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const SectionItem = ({ section, handleFocus, handleBlur, selectedItem }) => {
  // Track the collapsed state of the section
  const [isCollapsed, setIsCollapsed] = useState(section.collapsible === 1);

  // Toggle the collapsed state only if the section is collapsible
  const toggleCollapse = useCallback(() => {
    if (section.collapsible === 1) {
      setIsCollapsed((prev) => !prev);
    }
  }, [section.collapsible]);

  return (
    <div className={clsx("border-b-[1px] border-gray-400 px-2 py-1")}>
      {section?.label && (
        <div
          className="flex flex-row w-full h-fit justify-between items-center"
          onClick={toggleCollapse} // Only allow toggle if collapsible
        >
          <h4 className="text-base font-medium py-2 flex items-center">
            {section.label || ""}
            {/* Show collapse icon if section is collapsible */}
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

      {/* Conditionally render content based on collapse state */}
      {!isCollapsed && (
        <div className="flex flex-col md:flex-row md:space-x-8">
          {section?.columns?.map((column, index) => (
            <ColumnItem
              key={index}
              column={column}
              section={section}
              handleFocus={handleFocus}
              handleBlur={handleBlur}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionItem;
