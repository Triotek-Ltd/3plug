import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faColumns,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const SectionDropdownMenu = ({
  isOpen,
  handleAddSection,
  handleAddColumn,
  handleDeleteSection,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{
            duration: 0.7, // Slower animation
            ease: [0.25, 0.8, 0.25, 1], // Advanced cubic-bezier easing
          }}
          className="absolute right-4 top-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
          onClick={(e) => e.stopPropagation()} // Prevent submenu clicks from closing the menu
        >
          <ul className="divide-y divide-gray-100 text-sm text-gray-700">
            <li>
              <button
                className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                onClick={() => handleAddSection(true)}
              >
                <div className="flex items-center space-x-1 text-blue-500">
                  <FontAwesomeIcon icon={faArrowUp} />
                </div>
                <span>Add Section Above</span>
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                onClick={() => handleAddSection(false)}
              >
                <div className="flex items-center space-x-1 text-blue-500">
                  <FontAwesomeIcon icon={faArrowDown} />
                </div>
                <span>Add Section Below</span>
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                onClick={handleAddColumn}
              >
                <FontAwesomeIcon icon={faColumns} className="text-blue-500" />
                <span>Add Column</span>
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-red-600"
                onClick={handleDeleteSection}
              >
                <FontAwesomeIcon icon={faTrash} className="text-red-500" />
                <span>Remove Section</span>
              </button>
            </li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SectionDropdownMenu;
