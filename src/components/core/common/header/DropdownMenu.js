import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

const DropdownMenu = ({ trigger, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Very fast transition settings
  const containerVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 1000, // Very fast response
        damping: 20, // Minimal resistance
        staggerChildren: 0.02, // Minimal delay between children animations
      },
    },
    closed: {
      opacity: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 1000,
        damping: 20,
        staggerChildren: 0.01,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 1000,
        damping: 20,
      },
    },
    closed: {
      opacity: 0,
      x: -10,
      transition: {
        type: "spring",
        stiffness: 1000,
        damping: 20,
      },
    },
  };

  return (
    <div className="relative">
      <div
        ref={triggerRef}
        onClick={toggleDropdown}
        className="flex items-center cursor-pointer space-x-2"
      >
        {/* <FontAwesomeIcon
          icon={faCaretDown}
          className={`transition-transform duration-150 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        /> */}
        {trigger}
      </div>
      <AnimatePresence>
        {isOpen && options && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={containerVariants}
            className="absolute right-0 mt-2 px-1 w-56 origin-top-right bg-white border border-purple-300 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
          >
            <motion.div className="py-2 space-y-1">
              {options?.map((option, index) => (
                <motion.a
                  key={index}
                  onClick={() => {
                    option.action();
                    closeDropdown();
                  }}
                  variants={itemVariants}
                  className="flex items-center px-2 py-1 text-sm text-gray-900 hover:bg-purple-100 hover:text-purple-900 rounded-lg transition-all duration-75 cursor-pointer"
                >
                  {option.icon && (
                    <FontAwesomeIcon
                      icon={option.icon}
                      className="mr-2 text-purple-800"
                    />
                  )}
                  {option.text}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownMenu;
