import React, { useState, useEffect } from "react";
import ColumnDropZone from "@/components/studio/doctype/ColumnDropZone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { updateItemById } from "@/components/studio/utils";

const StudioTabs = ({
  tabs,
  selectedTab,
  fieldOrder,
  fields,
  setCanvasItems,
  deleteField,
  ItemType,
  moveItem,
  setSelectedItem,
}) => {
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingTabId, setEditingTabId] = useState(null);
  const [sectionName, setSectionName] = useState("");
  const [tabName, setTabName] = useState("");

  const handleInputChange = (key, value, item, type) => {
    const updatedItems = updateItemById(fields, item.id, type, key, value);
    if (updatedItems) setCanvasItems([...updatedItems]);
  };

  const handleFocus = (id) => {
    setSelectedFieldId(id); // Set the selected field ID
    setSelectedItem(id); // Set the selected item
  };

  const handleBlur = () => {
    setSelectedFieldId(""); // Reset the selected field ID
    setSelectedItem(null); // Reset the selected item
  };

  const handleMoveItem = (draggedItem, targetItem, parent1Id, parent2Id) =>
    moveItem(draggedItem, targetItem, parent1Id, parent2Id);

  const handleEditSectionName = (section) => {
    setEditingSectionId(section.id);
    setSectionName(section.name);
  };

  const handleEditTabName = (tab) => {
    setEditingTabId(tab.id);
    setTabName(tab.name);
  };

  const handleSaveSectionName = () => {
    const updatedItems = updateItemById(
      fields,
      editingSectionId,
      "section",
      "name",
      sectionName
    );
    if (updatedItems) setCanvasItems([...updatedItems]);
    setEditingSectionId(null);
  };

  const handleSaveTabName = () => {
    if (tabName.trim() !== "") {
      const updatedItems = updateItemById(
        fields,
        editingTabId,
        "tab",
        "name",
        tabName
      );
      if (updatedItems) setCanvasItems([...updatedItems]);
    }
    setEditingTabId(null);
  };

  const handleCancelEdit = () => {
    setEditingSectionId(null);
    setEditingTabId(null);
  };

  return (
    <>
      {tabs.map(
        (tab) =>
          selectedTab === tab?.name && (
            <div key={tab.id} className="mb-4 bg-slate-50">
              <div className="flex items-center justify-start border-b border-gray-500 p-2">
                {editingTabId === tab.id ? (
                  <input
                    type="text"
                    value={tabName}
                    onChange={(e) => setTabName(e.target.value)}
                    onBlur={handleSaveTabName}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveTabName();
                      else if (e.key === "Escape") handleCancelEdit();
                    }}
                    autoFocus
                    className="text-md font-semibold p-1 border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <h4 className="text-md font-semibold">{tab.name}</h4>
                )}
                <button
                  onClick={() =>
                    editingTabId === tab.id
                      ? handleSaveTabName()
                      : handleEditTabName(tab)
                  }
                  className="ml-2 text-blue-500 hover:text-blue-700 transition-colors duration-150 ease-in-out"
                  aria-label="Edit tab"
                >
                  <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteField(tab, "tab")}
                  className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-150 ease-in-out"
                  aria-label="Delete tab"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                </button>
              </div>
              {tab.sections.map((section) => (
                <div key={section.id} className="border-b border-gray-500 p-2">
                  <div className="flex items-center justify-between my-2">
                    <div className="flex items-center">
                      {editingSectionId === section.id ? (
                        <input
                          type="text"
                          value={sectionName}
                          onChange={(e) => setSectionName(e.target.value)}
                          onBlur={handleSaveSectionName}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveSectionName();
                            else if (e.key === "Escape") handleCancelEdit();
                          }}
                          autoFocus
                          className="text-md font-semibold p-1 border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <h4 className="text-md font-semibold">
                          {section.name}
                        </h4>
                      )}
                      <button
                        onClick={() =>
                          editingSectionId === section.id
                            ? handleSaveSectionName()
                            : handleEditSectionName(section)
                        }
                        className="ml-2 text-blue-500 hover:text-blue-700 transition-colors duration-150 ease-in-out"
                        aria-label="Edit section"
                      >
                        <FontAwesomeIcon
                          icon={faPencilAlt}
                          className="w-4 h-4"
                        />
                      </button>
                      <button
                        onClick={() => deleteField(section, "section")}
                        className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-150 ease-in-out"
                        aria-label="Delete section"
                      >
                        <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {section.columns.map((column, index) => (
                      <div key={index} className="flex-1">
                        <ColumnDropZone
                          key={index}
                          column={column}
                          sectionId={section.id}
                          selectedFieldId={selectedFieldId}
                          handleFocus={handleFocus}
                          handleBlur={handleBlur}
                          handleInputChange={handleInputChange}
                          handleMoveItem={handleMoveItem}
                          deleteField={deleteField}
                          ItemType={ItemType}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
      )}
    </>
  );
};

export default StudioTabs;
