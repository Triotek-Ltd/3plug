import React, { useRef, useState, useEffect } from "react";
import { computePosition, offset, flip, shift } from "@floating-ui/react";

const CustomTooltip = ({ children, content, open, trigger = "hover" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyles, setTooltipStyles] = useState({});
  const referenceRef = useRef(null);
  const tooltipRef = useRef(null);
  const isControlled = typeof open === "boolean";
  const visible = isControlled ? open : isVisible;

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  useEffect(() => {
    if (visible && referenceRef.current && tooltipRef.current) {
      computePosition(referenceRef.current, tooltipRef.current, {
        placement: "top-start",
        middleware: [offset(8), flip(), shift({ padding: 8 })],
        strategy: "fixed",
      }).then(({ x, y }) => {
        setTooltipStyles({
          position: "fixed",
          left: `${Math.max(0, x)}px`,
          top: `${Math.max(0, y)}px`,
        });
      });
    }
  }, [visible]);

  return (
    <div
      ref={referenceRef}
      onMouseEnter={!isControlled && trigger === "hover" ? showTooltip : undefined}
      onMouseLeave={!isControlled && trigger === "hover" ? hideTooltip : undefined}
      onFocus={!isControlled && trigger === "focus" ? showTooltip : undefined}
      onBlur={!isControlled && trigger === "focus" ? hideTooltip : undefined}
      className="relative flex items-center w-full"
    >
      {children}
      {visible && content ? (
        <div
          ref={tooltipRef}
          style={tooltipStyles}
          className="pointer-events-none z-20 leading-tight bg-gradient-to-tl from-slate-900 to-slate-700 text-white text-[11px] font-medium py-1.5 px-2 rounded-md shadow-lg relative max-w-[200px]"
        >
          {content}
          <div className="absolute w-2 h-2 bg-slate-800 transform rotate-45 -bottom-1 left-3"></div>
        </div>
      ) : null}
    </div>
  );
};

export default CustomTooltip;
