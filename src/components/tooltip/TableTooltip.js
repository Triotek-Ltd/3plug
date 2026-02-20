import React, { useRef, useState } from "react";

const TableTooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const referenceRef = useRef(null);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  return (
    <div className="flex items-center justify-start space-x-2 ">
      <div
        ref={referenceRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className="relative flex items-center w-full justify-center z-100"
      >
        {children}
        {isVisible && content && (
          <div
            className="absolute !z-10 bg-gradient-to-tl from-purple-700 to-pink-500 text-white text-[11px] font-medium py-1 px-2 rounded-lg shadow-lg flex flex-col items-center"
            style={{
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              marginTop: "8px",
              minWidth: "150px",
              maxWidth: "200px",
            }}
          >
            {content}
            <div
              className="absolute w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-pink-500"
              style={{
                bottom: "100%",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableTooltip;
