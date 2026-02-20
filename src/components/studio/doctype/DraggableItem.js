import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import FieldRenderer from "./FieldRenderer";
import { moveItem } from "./utils/move";
import { handleInputChange } from "./utils/handleInputChange";
import { useConfig } from "@/contexts/ConfigContext";
import ItemActions from "./section/ItemActions";
import { addFieldToConfig } from "./utils/addFieldToConfig";
import { duplicateFieldInConfig } from "./utils/duplicateFieldInConfig";
import { deleteFieldsFromConfig } from "./utils/deleteFields";

const ITEM_TYPE = "FIELD";

const DraggableItem = ({ item, handleFocus, placeholder = false }) => {
  const { selectedItem, setSelectedItem, localConfig, setLocalConfig } =
    useConfig();
  const ref = useRef(null);

  // Dragging logic
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { type: ITEM_TYPE, id: item?.fieldname, item },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Drop logic for moving the item
  const [, drop] = useDrop({
    accept: ITEM_TYPE, // Accepts other items of type ITEM_TYPE
    hover: (draggedItem) => {
      // Ensure the item is moved correctly when dropped
      const newConfig = moveItem(
        draggedItem.item.fieldname,
        item.fieldname,
        localConfig
      );
      setLocalConfig(newConfig);
    },
    drop: (draggedItem) => {
      // Ensure the item is moved correctly when dropped
      const newConfig = moveItem(
        draggedItem.item.fieldname,
        item.fieldname,
        localConfig
      );
      setLocalConfig(newConfig);
    },
  });

  // Attach both drag and drop handlers to the reference
  drag(drop(ref));

  if (!item) {
    console.error(`Item at index ${index} is undefined`);
    return null;
  }

  // Handle selecting the field for focus
  const handleSelect = (e) => {
    e.stopPropagation();
    handleFocus(item);
  };

  const handleChange = (field, value) => {
    handleInputChange(
      field,
      value,
      selectedItem,
      setSelectedItem,
      localConfig,
      setLocalConfig
    );
  };

  // Handle Delete Action
  const handleDelete = async () => {
    const newConfig = await deleteFieldsFromConfig(localConfig, [
      item.fieldname,
    ]);
    setLocalConfig({ ...newConfig });
  };

  // Handle Duplicate Action
  const handleDuplicate = () => {
    const newConfig = duplicateFieldInConfig(localConfig, item.fieldname);
    setLocalConfig({ ...newConfig });
  };

  const handleAddField = async () => {
    const newConfig = await addFieldToConfig(
      localConfig,
      item.fieldname,
      "Data"
    );
    setLocalConfig({ ...newConfig });
  };

  return (
    <div
      ref={ref}
      className={`group flex flex-col min-w-0 break-words rounded-md p-1 mb-2 hover:border hover:border-black ${
        selectedItem === item ? "border border-black" : ""
      }`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={handleSelect}
    >
      <>
        <div
          className={`flex flex-row justify-between items-center ${
            selectedItem === item ? "" : ""
          }`}
        >
          <input
            type="text"
            value={item.label}
            onChange={(e) => handleChange("label", e.target.value)}
            className="block w-full py-1 text-sm border-none focus:outline-none bg-transparent"
            placeholder="Edit label"
          />
          <div
            className={` flex space-x-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100
          ${selectedItem === item ? "opacity-100" : ""}`}
          >
            <ItemActions
              onDelete={() => handleDelete(item.id)}
              onDuplicate={() => handleDuplicate(item.id)}
              onAddField={() => handleAddField(item.id)}
            />
          </div>
        </div>
        {/* Render field preview using FieldRenderer */}
        <FieldRenderer fieldtype={item.fieldtype} item={item} />
      </>
    </div>
  );
};

export default DraggableItem;
