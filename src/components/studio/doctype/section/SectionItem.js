import React, { useCallback, Suspense } from "react";
import { useDrag } from "react-dnd";
import clsx from "clsx";
import ColumnItem from "./ColumnItem"; // Import the new ColumnItem component
import SectionActions from "./SectionActions";
import ColumnItemEmpty from "./ColumnItemEmpty";

const SectionItem = ({ section, handleFocus, handleBlur, selectedItem }) => {
  const [{ isDragging: isSectionDragging }, drag] = useDrag(() => ({
    type: "SECTION_TYPE",
    item: { sectionId: section.fieldname },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleSectionClick = (e) => {
    e.stopPropagation();
    handleFocus(section);
  };

  return (
    <div
      ref={drag}
      className={clsx("border p-2 rounded-md", {
        "border-black": selectedItem?.fieldname === section?.fieldname,
        "border-gray-50": selectedItem?.fieldname !== section?.fieldname,
        "opacity-50": isSectionDragging,
      })}
      style={{ cursor: "move" }}
      onClick={handleSectionClick}
    >
      <div className="flex flex-row w-full h-fit justify-between">
        <h4 className="text-md font-semibold py-2">{section.label || ""}</h4>

        <SectionActions section={section} />
      </div>

      <div className="flex space-x-2">
        {section?.columns?.map((column, index) => (
          <React.Fragment key={index}>
            {" "}
            {column?.fields?.length > 0 ? (
              <ColumnItem
                key={index}
                column={column}
                section={section}
                handleFocus={handleFocus}
                handleBlur={handleBlur}
              />
            ) : (
              <ColumnItemEmpty
                key={index}
                column={column}
                section={section}
                handleFocus={handleFocus}
                handleBlur={handleBlur}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SectionItem;
