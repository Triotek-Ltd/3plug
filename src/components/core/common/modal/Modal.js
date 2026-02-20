import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { FaTimes } from "react-icons/fa"; // Importing the 'X' icon for the close button

const Modal = ({
  isOpen,
  onClose,
  children,
  justify = "center",
  position = "center",
  className = "",
  zIndex = 500,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClosing, setIsClosing] = useState(false); // Track if the modal is animating to close

  // Track mouse position when opening
  useEffect(() => {
    if (isOpen) {
      const handleMouseMove = (event) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
      };

      document.addEventListener("mousemove", handleMouseMove);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [isOpen]);

  // Close modal after animation completes
  const handleAnimationComplete = () => {
    if (isClosing) {
      setIsClosing(false);
      onClose();
    }
  };

  // Handle clicks outside the modal
  const handleBackdropClick = (event) => {
    if (event.target.id === "backdrop") {
      setIsClosing(true);
    }
  };

  return (
    <AnimatePresence>
      {(isOpen || isClosing) && (
        <motion.div
          id="backdrop"
          onClick={handleBackdropClick}
          className={`fixed inset-0 p-4 flex items-${position} justify-${justify} bg-gray-600 bg-opacity-50 backdrop-blur-sm h-screen !z-500 rounded-md ${className}`}
          style={{ backdropFilter: "blur(0.5px)", zIndex: zIndex }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <motion.div
            id="modal"
            className="bg-white p-4 shadow-lg relative max-h-[90vh] !min-w-[40vw]  overflow-auto rounded-md"
            style={{ height: "fit-content", zIndex: zIndex }}
            initial={{
              x: isClosing ? 0 : mousePosition.x - 200,
              y: isClosing ? 0 : mousePosition.y - 150,
              opacity: isClosing ? 1 : 0,
            }}
            animate={{
              x: isClosing ? mousePosition.x - 200 : 0,
              y: isClosing ? mousePosition.y - 150 : 0,
              opacity: 1,
            }}
            exit={{
              x: mousePosition.x - 200,
              y: mousePosition.y - 150,
              opacity: 0,
            }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
            }}
            onAnimationComplete={handleAnimationComplete}
          >
            {/* Close Button */}
            {/* <button
              onClick={() => setIsClosing(true)}
              className="fixed top-2 right-4 text-gray-700 hover:text-gray-600 focus:outline-none rounded-full bg-white p-1 z-10"
            >
              <FaTimes size={20} />
            </button> */}

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
