import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faEdit,
  faPlus,
  faTrash,
  faIcons,
} from "@fortawesome/free-solid-svg-icons";
import IconSelector from "./IconSelector"; // Adjust the path as necessary

const SidebarSettings = () => {
  const [sidebarItems, setSidebarItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [newItem, setNewItem] = useState({ text: "", link: "", icon: "" });
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

  useEffect(() => {
    // Fetch sidebar items from the API
    fetch("/api/sidebar")
      .then((response) => response.json())
      .then((data) => setSidebarItems(data.sidebarLinks || []))
      .catch((error) => console.error("Error loading sidebar items:", error));
  }, []);

  const updateSidebarSettings = (updatedSidebar) => {
    fetch("/api/sidebar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedSidebar),
    })
      .then((response) => {
        if (response.ok) {
        } else {
          console.error("Failed to update sidebar settings");
        }
      })
      .catch((error) =>
        console.error("Error updating sidebar settings:", error)
      );
  };

  const handleEditToggle = () => {
    if (editMode) {
      // If exiting edit mode, save settings
      updateSidebarSettings(sidebarItems);
    }
    setEditMode(!editMode);
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...sidebarItems];
    updatedItems[index][field] = value;
    setSidebarItems(updatedItems);
  };

  const handleNewItemChange = (field, value) => {
    setNewItem({ ...newItem, [field]: value });
  };

  const handleAddItem = () => {
    const updatedItems = [...sidebarItems, newItem];
    setSidebarItems(updatedItems);
    setNewItem({ text: "", link: "", icon: "" });
  };

  const handleDeleteItem = (index) => {
    const updatedItems = sidebarItems.filter((_, i) => i !== index);
    setSidebarItems(updatedItems);
  };

  const handleIconSelect = (iconName) => {
    if (selectedItemIndex !== null) {
      // Update the icon of the selected item
      const updatedItems = [...sidebarItems];
      updatedItems[selectedItemIndex].icon = iconName;
      setSidebarItems(updatedItems);
    } else {
      // Update the icon of the new item
      setNewItem({ ...newItem, icon: iconName });
    }
    setShowIconSelector(false);
    setSelectedItemIndex(null); // Reset after selection
  };

  const openIconSelectorForNew = () => {
    setSelectedItemIndex(null); // Reset selected item index for new item
    setShowIconSelector(true);
  };

  const openIconSelectorForExisting = (index) => {
    setSelectedItemIndex(index); // Set the index of the existing item to update
    setShowIconSelector(true);
  };

  return (
    <div className="p-6 bg-slate-50 rounded-lg shadow-lg">
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleEditToggle}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg transition duration-200 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <FontAwesomeIcon icon={editMode ? faSave : faEdit} className="mr-2" />
          {editMode ? "Save Settings" : "Edit Sidebar"}
        </button>
      </div>

      {editMode && (
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2 text-purple-700">
            Add New Item
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Text"
              value={newItem.text}
              onChange={(e) => handleNewItemChange("text", e.target.value)}
              className="border border-slate-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Link"
              value={newItem.link}
              onChange={(e) => handleNewItemChange("link", e.target.value)}
              className="border border-slate-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="relative flex flex-row space-x-4">
              {newItem.icon ? (
                <FontAwesomeIcon
                  icon={newItem.icon}
                  size="2x"
                  className="text-purple-500"
                  onClick={openIconSelectorForNew}
                />
              ) : (
                <button
                  onClick={openIconSelectorForNew}
                  className="border border-slate-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <FontAwesomeIcon icon={faIcons} /> Select Icon
                </button>
              )}
              <button
                onClick={handleAddItem}
                className="flex flex-row items-center px-6 py-1 bg-purple-600 text-white rounded-r-lg hover:bg-purple-400 transition duration-200"
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>
        </div>
      )}

      {showIconSelector && (
        <IconSelector
          onSelect={handleIconSelect}
          onClose={() => setShowIconSelector(false)}
        />
      )}

      <div className="border-t pt-4">
        {sidebarItems.length > 0 ? (
          <ul>
            {sidebarItems.map((item, index) => (
              <li
                key={index}
                className="mb-4 flex items-center border-b border-slate-200 pb-2"
              >
                <div className="w-1/3">
                  {editMode ? (
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) =>
                        handleInputChange(index, "text", e.target.value)
                      }
                      className="border border-slate-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-purple-600 font-semibold">
                      {item.text}
                    </span>
                  )}
                </div>

                <div className="w-1/3">
                  {editMode ? (
                    <input
                      type="text"
                      value={item.link}
                      onChange={(e) =>
                        handleInputChange(index, "link", e.target.value)
                      }
                      className="border border-slate-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-slate-600">{item.link}</span>
                  )}
                </div>

                <div className="w-1/3 flex items-center">
                  {editMode ? (
                    <FontAwesomeIcon
                      icon={item.icon}
                      size="2x"
                      className="text-purple-500"
                      onClick={() => openIconSelectorForExisting(index)}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={item.icon}
                      size="2x"
                      className="text-purple-500"
                    />
                  )}
                </div>

                {editMode && (
                  <div className="w-1/3 flex items-center justify-end">
                    <button
                      onClick={() => handleDeleteItem(index)}
                      className="bg-red-500 text-white px-2 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-600">No sidebar items available.</p>
        )}
      </div>
    </div>
  );
};

export default SidebarSettings;
