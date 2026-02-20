import React, { Suspense, useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import clsx from "clsx";
import DraggableItem from "../DraggableItem"; // Assuming lazy loading is used in DraggableItem
import CustomButton from "@/components/core/common/buttons/Custom"; // Assuming lazy loading for CustomButton
import { COLUMN_TYPE, ITEM_TYPE } from "../constants"; // Make sure ITEM_TYPE and COLUMN_TYPE are imported
import { useConfig } from "@/contexts/ConfigContext";
import { moveColumn, moveGroupedItems, moveItem } from "../utils/move";
import { getFieldsAfterBreak } from "../utils/getFieldsAfterBreak";
import ColumnActions from "./ColumnActions";
import { getLastFieldname } from "../utils/getLastFieldname";
import { addFieldToConfig } from "../utils/addFieldToConfig";
import { getFirstFieldname } from "../utils/getFirstField";

const ColumnItem = ({ section, column, handleFocus, handleBlur }) => {
  // Dragging logic for the column (already in place)
  const { selectedItem, localConfig, selectedTab, setLocalConfig } =
    useConfig();

  const ref = useRef(null);

  const [{ isDragging: isColumnDragging }, dragColumn] = useDrag(() => ({
    type: COLUMN_TYPE,
    item: { column, type: COLUMN_TYPE },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Dropping logic for both ITEM_TYPE and COLUMN_TYPE
  const [{ isOver, canDrop }, dropColumn] = useDrop(() => ({
    accept: [COLUMN_TYPE], // Allow both ITEM_TYPE and COLUMN_TYPE to be dropped

    drop: (item, monitor) => {
      handleDrop(item, monitor);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  // Handle click event
  const handleColClick = (e) => {
    if (e && typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
    handleFocus(column); // Focus the column
  };

  const handleAddField = async () => {
    const targetField =
      getLastFieldname(column) || column.fieldname || column.prevField;
    const newConfig = await addFieldToConfig(localConfig, targetField, "Data");
    setLocalConfig({ ...newConfig });
  };

  dropColumn(dragColumn(ref));

  const getDropType = (current) => {
    // Determine the attribute used and the drop type
    const attributeUsed = current.getAttribute("fieldname")
      ? "fieldname"
      : current.getAttribute("firstfield")
      ? "firstfield"
      : current.getAttribute("sectionname")
      ? "sectionname"
      : current.getAttribute("tabname")
      ? "tabname"
      : "other";

    const moveAbove =
      attributeUsed === "sectionname" || attributeUsed === "tabname"
        ? false
        : true;

    return { moveAbove, attributeUsed };
  };

  const handleDrop = (item, monitor) => {
    const current = ref.current;
    const targetField =
      current.getAttribute("fieldname") ||
      current.getAttribute("sectionname") ||
      current.getAttribute("firstfield") ||
      current.getAttribute("tabname");

    const { moveAbove, attributeUsed } = getDropType(ref.current);

    if (item.type === COLUMN_TYPE) {
      const firstfield = getFirstFieldname(item.column);
      const targetRect = ref.current.getBoundingClientRect(); // Get the bounding box of the target
      const clientOffset = monitor.getClientOffset(); // Get the mouse position

      // Calculate the percentage of the target element's width covered by the drop point
      const dropPercentage =
        ((clientOffset?.x - targetRect?.left) / targetRect?.width) * 100;

      // Determine drop side based on percentage
      const dropSide = dropPercentage <= 50 ? "left" : "right";
      const targetFields = getFieldsAfterBreak(
        localConfig,
        targetField,
        "Column",
        true
      );
      const specificTargetField = targetFields[targetFields.length - 1]; // Last field if dropped on the right

      const droppedFields = getFieldsAfterBreak(
        localConfig,
        firstfield,
        "Column",
        true
      );

      // Uncomment and modify as necessary to integrate further functionality
      const newConfig = moveGroupedItems(
        droppedFields,
        specificTargetField,
        localConfig,
        false // Pass the drop side to determine before/after placement
      );

      setLocalConfig(newConfig);
    } else {
      // Handle ITEM_TYPE drop
      const newConfig = moveItem(item.id, targetField, localConfig, moveAbove);
      setLocalConfig(newConfig);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        ref={ref}
        fieldname={column?.fieldname}
        sectionname={section?.fieldname}
        tabname={selectedTab?.fieldname}
        firstfield={column?.fields[0]?.fieldname}
        className={clsx("flex-1 bg-gray-100 p-2 rounded-md border-[1px]", {
          "border border-black": selectedItem === column,
          "border-dashed border-gray-500": selectedItem !== column,
          "opacity-50": isColumnDragging,
          "bg-green-200": isOver && canDrop,
        })}
        onClick={handleColClick} // Click to focus the column
        key={column.fieldname}
      >
        <div className="flex flex-row w-full h-fit justify-between">
          <h5 className="text-md font-semibold p-2">{column.label}</h5>
          {selectedItem === column && (
            <ColumnActions column={column} handleAddField={handleAddField} />
          )}
        </div>

        {/* Render draggable items inside the column */}
        {column?.fields?.map((item) => (
          <Suspense fallback={<div>Loading...</div>} key={item.fieldname}>
            <DraggableItem
              item={item}
              handleFocus={handleFocus}
              handleBlur={handleBlur}
              itemType={COLUMN_TYPE} // Specify ITEM_TYPE here if DraggableItem is for both types
            />
          </Suspense>
        ))}

        {/* Render Custom Button to add a new field */}
        <Suspense fallback={<div>Loading...</div>}>
          <CustomButton
            text="Add field"
            className="-mt-2 ml-1 bg-white"
            onClick={handleAddField}
          />
        </Suspense>
      </div>
    </Suspense>
  );
};

export default ColumnItem;
