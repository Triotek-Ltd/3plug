import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa"; // Example icons from Font Awesome
import * as Icons from "react-icons/fa"; // Import all Font Awesome icons
import Modal from "../core/common/modal/Modal"; // Reuse your existing Modal component

const IconField = ({ value, onChange, readOnly, hidden }) => {
  const [selectedIcon, setSelectedIcon] = useState(value || null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get all icon names from the Font Awesome pack
  const iconNames = Object.keys(Icons);

  // Filter icons based on search query
  const filteredIcons = iconNames.filter((iconName) =>
    iconName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle icon selection
  const handleIconSelect = (iconName) => {
    setSelectedIcon(iconName);
    onChange(iconName); // Pass the selected icon name to the parent component
    setShowIconPicker(false); // Close the icon picker modal
  };

  // Handle icon removal
  const handleRemoveIcon = (e) => {
    e.stopPropagation(); // Prevent the modal from reopening
    setSelectedIcon(null);
    onChange(null); // Clear the selected icon
  };

  // Reopen the icon picker when the selected icon is clicked
  const handleIconClick = () => {
    if (selectedIcon && !readOnly) {
      setShowIconPicker(true);
    }
  };

  return (
    <div className="relative icon-field w-full pb-1" hidden={hidden}>
      {selectedIcon ? (
        <div
          className="flex flex-row items-center justify-between w-full gap-2 p-2 bg-pink-50 rounded-lg border border-pink-200 cursor-pointer hover:bg-pink-100 transition-colors"
          onClick={handleIconClick}
        >
          {/* Display the selected icon */}
          {React.createElement(Icons[selectedIcon], {
            className: "w-6 h-6 text-purple-600",
          })}
          <span className="text-sm text-purple-700 w-full">{selectedIcon}</span>
          {/* Remove icon button */}
          <button
            type="button"
            className="p-1 text-gray-500 hover:text-red-500 transition-colors"
            onClick={handleRemoveIcon}
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="bg-pink-100 text-purple-800 px-4 py-2 rounded-lg cursor-pointer bg-pink-50 rounded-lg border border-pink-200 cursor-pointer hover:bg-pink-100 transition-colors disabled:cursor-not-allowed"
          onClick={() => setShowIconPicker(true)}
          disabled={readOnly}
        >
          Select Icon
        </button>
      )}

      {/* Icon Picker Modal */}
      {showIconPicker && (
        <Modal
          className="fixed inset-0 p-4 flex items-center justify-center bg-gray-600 bg-opacity-50 backdrop-blur-sm h-screen !z-50000"
          onClick={() => setShowIconPicker(false)}
          isOpen={showIconPicker}
          onClose={() => setShowIconPicker(false)}
          zIndex={50000}
        >
          <div className="relative bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-auto shadow-xl">
            {/* <h2 className="text-lg font-semibold mb-4 text-purple-800">
              Select an Icon
            </h2> */}
            {/* Search bar */}
            <div className="mb-4 flex items-center w-full">
              <div className="flex items-center border border-pink-200 rounded-md p-2 bg-pink-50 w-full">
                <FaSearch className="text-pink-500" />
                <input
                  type="text"
                  placeholder="Search icons..."
                  className="ml-2 flex-1 focus:outline-none bg-transparent text-pink-700 placeholder-pink-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Close button */}
              <button
                type="button"
                className="relative p-2 text-pink-500 hover:text-pink-700 transition-colors"
                onClick={() => setShowIconPicker(false)}
              >
                <FaTimes className="w-8 h-8" />
              </button>
            </div>
            {/* Icon grid */}
            <div className="grid grid-cols-4 gap-4">
              {filteredIcons.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  className="flex flex-col items-center p-3 hover:bg-pink-50 rounded-lg transition-colors"
                  onClick={() => handleIconSelect(iconName)}
                >
                  {React.createElement(Icons[iconName], {
                    className: "w-6 h-6 text-purple-600",
                  })}
                  <span className="text-xs mt-1 text-pink-800">{iconName}</span>
                </button>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default IconField;
