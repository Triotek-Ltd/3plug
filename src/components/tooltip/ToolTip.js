import React, { useRef, useState } from "react";

const DefaultTooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const referenceRef = useRef(null);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  return (
    <div
      ref={referenceRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      className="relative flex items-center w-full"
    >
      {children}
      {isVisible && (
        <div
          className="absolute z-10 bg-150 bg-x-25 leading-pro bg-gradient-to-br from-purple-700 to-pink-500 hover:shadow-soft-2xl hover:scale-102 text-white text-xs font-medium py-1 px-2 rounded-lg shadow-lg"
          style={{
            top: "0",
            right: "0",
            marginTop: "-20px",
            minWidth: "100px",
          }}
        >
          {content}
          <div className="absolute w-2.5 h-2.5 bg-pink-500 transform rotate-45 -bottom-1 right-1"></div>
        </div>
      )}
    </div>
  );
};

export default DefaultTooltip;
