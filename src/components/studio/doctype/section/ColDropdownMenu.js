import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const ColActionsDropdownMenu = ({
  isOpen,
  onAddBefore,
  onAddAfter,
  onDelete,
  closeMenu,
  handleAddField,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{
            duration: 0.7,
            ease: [0.25, 0.8, 0.25, 1],
          }}
          className="absolute right-4 top-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <ul className="divide-y divide-gray-100 text-sm text-gray-700">
            <li>
              <button
                className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  onAddBefore();
                  closeMenu();
                }}
              >
                <div className="flex items-center space-x-1 text-blue-500">
                  <FontAwesomeIcon icon={faArrowLeft} />
                </div>
                <span>Add Column Before</span>
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  onAddAfter();
                  closeMenu();
                }}
              >
                <div className="flex items-center space-x-1 text-blue-500">
                  <FontAwesomeIcon icon={faArrowRight} />
                </div>
                <span>Add Column After</span>
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  handleAddField();
                  closeMenu();
                }}
              >
                <div className="flex items-center space-x-1 text-gray-900">
                  <FontAwesomeIcon icon={faPlus} />
                </div>
                <span>Add Field</span>
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-red-600"
                onClick={() => {
                  onDelete();
                  closeMenu();
                }}
              >
                <FontAwesomeIcon icon={faTrash} className="text-red-500" />
                <span>Remove Column</span>
              </button>
            </li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ColActionsDropdownMenu;
