import React from "react";

const PrimaryButton1 = ({ text, className, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`inline-block whitespace-nowrap px-2 py-1 mb-0 font-bold text-center align-middle transition-all bg-transparent border border-solid rounded-lg shadow-none cursor-pointer leading-pro ease-soft-in text-xs bg-150 active:opacity-85 hover:scale-102 tracking-tight-soft bg-x-25 border-fuchsia-500 text-fuchsia-500 hover:opacity-75 ${className}`}
    >
      {text}
    </div>
  );
};

export default PrimaryButton1;
