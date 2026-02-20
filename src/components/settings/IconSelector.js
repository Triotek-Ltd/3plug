import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas, faTimes } from "@fortawesome/free-solid-svg-icons";

const IconSelector = ({ onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Collect the list of icons
  const iconList = Object.keys(fas).map((iconKey) => ({
    name: iconKey,
    icon: fas[iconKey],
  }));

  // Filter icons based on search term
  const filteredIcons = iconList.filter((icon) =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIconSelect = (iconName) => {
    onSelect(iconName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-900 flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-h-[80vh] overflow-y-auto w-full md:w-3/4">
        {/* Close Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Select an Icon</h2>
          <button onClick={onClose} className="text-red-500 text-xl">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search icons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 w-full mb-4"
        />

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredIcons.map((icon) => (
            <div
              key={icon.name}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleIconSelect(icon.icon)}
            >
              <FontAwesomeIcon
                icon={icon.icon}
                size="2x"
                className="text-purple-700"
              />
              <span className="text-xs text-center">{icon.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IconSelector;
