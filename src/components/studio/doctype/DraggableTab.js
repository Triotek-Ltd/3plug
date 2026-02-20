import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { TabType, ITEM_TYPE, SECTION_TYPE, COLUMN_TYPE } from "./constants";
import { useConfig } from "@/contexts/ConfigContext";

const DraggableTab = ({ tab, handleFocus }) => {
  const { selectedTab, setSelectedTab } = useConfig();
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: [TabType, ITEM_TYPE, SECTION_TYPE, COLUMN_TYPE],
    canDrop: (draggedItem) => {
      return draggedItem.type === TabType;
    },

    hover: () => {
      setSelectedTab(tab);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleSectionClick = (e) => {
    preventPropagation(e);
    handleFocus(tab);
  };

  const preventPropagation = (e) => {
    e.stopPropagation();
  };

  const [, drag] = useDrag(() => ({
    type: TabType,
    item: { id: tab },
  }));

  return (
    <div ref={(node) => drag(drop(node))}>
      <a
        onClick={(e) => {
          handleSectionClick(e);
          setSelectedTab(tab);
        }}
        className={`flex items-center ${
          selectedTab.fieldname === tab.fieldname
            ? "border-b-[1px] border-slate-800 font-semibold text-purple-700"
            : "text-slate-700"
        }`}
      >
        {tab.label}
      </a>
    </div>
  );
};

export default DraggableTab;
