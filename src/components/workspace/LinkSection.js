import React from "react";
import LinkCard from "@/components/workspace/LinkCard";

const LinkSection = ({
  title,
  description,
  tooltipContent,
  links,
  bgColor = "bg-white", // Default background color
  textColor = "text-gray-800", // Default text color
  cols = 2, // Default number of columns
  className,
}) => {
  return (
    <div
      className={`relative flex flex-col min-w-0 break-words ${bgColor} shadow-md shadow-pink-200 rounded-2xl bg-clip-border p-4 ${className}`}
    >
      <div className="relative z-1 flex flex-col flex-auto h-full p-2">
        <h5 className={`mb-2 font-bold ${textColor}`}>{title}</h5>
        {description && (
          <p className={`mb-1 ${textColor} text-sm`}>{description}</p>
        )}
        <div className={`grid grid-cols-${cols} gap-4`}>
          {links?.map((link, index) => (
            <LinkCard
              key={index}
              title={link.text}
              icon={link.icon}
              href={link.href}
              tooltipContent={link.tooltipContent}
              iconBg="bg-gradient-to-tl from-purple-700 to-pink-500"
              arrowClassName="bg-gradient-to-tl from-green-500 to-blue-500"
              bgColor="bg-gray-100"
              textClassNameOverride="text-xs font-semibold text-gray-800 text-left"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LinkSection;
