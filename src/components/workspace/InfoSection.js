import React from "react";

const InfoSection = ({ title, description, bgColor, textColor }) => {
  return (
    <div
      className={`relative flex flex-col min-w-0 break-words ${bgColor} shadow-soft-xl rounded-2xl bg-clip-border p-4`}
    >
      <div className="relative h-full overflow-hidden bg-cover rounded-xl">
        <span className="absolute top-0 left-0 w-full h-full bg-center bg-cover bg-gradient-to-tl from-gray-900 to-slate-800 opacity-80"></span>
        <div className="relative z-10 flex flex-col flex-auto h-full p-4">
          <h5 className={`pt-2 mb-6 font-bold ${textColor}`}>{title}</h5>
          <p className={textColor}>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
