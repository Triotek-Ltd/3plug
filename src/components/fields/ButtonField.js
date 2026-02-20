import React from "react";

const ButtonField = ({
  label,
  onClick,
  value,
  onChange,
  readOnly,
  preview,
  placeholder,
  hidden,
}) => (
  <button
    onClick={onClick}
    className="inline-block px-4 py-1 mb-0 font-bold text-center uppercase align-middle transition-all bg-transparent border border-solid rounded-lg shadow-none cursor-pointer leading-pro ease-soft-in text-xs bg-150 active:opacity-85 hover:scale-102 tracking-tight-soft bg-x-25 border-fuchsia-500 text-fuchsia-500 hover:opacity-75 w-fit"
    readOnly={readOnly || preview} // Make input readOnly in both readOnly and preview mode
    disabled={readOnly || preview}
    hidden={hidden}
    placeholder={placeholder}
  >
    {label || "Button"}
  </button>
);

export default ButtonField;
