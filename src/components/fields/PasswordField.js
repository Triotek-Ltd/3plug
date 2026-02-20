import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const PasswordField = ({
  value = "", // Default to empty string if value is null or undefined
  onChange,
  readOnly,
  preview,
  placeholder,
  hidden,
  type,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <input
        type={showPassword ? "text" : "password"}
        value={preview ? "" : value || ""} // Ensure value is never null or undefined
        readOnly={readOnly} // Make input readOnly in both readOnly and preview mode
        disabled={readOnly || preview}
        onChange={onChange}
        placeholder={placeholder}
        hidden={hidden}
        className="px-1 w-full focus:outline-none focus:ring-0 focus:border-none"
      />
      <div className="px-1 text-right flex justify-end">
        <div
          className="flex items-center justify-center w-5 h-5 text-center rounded-md bg-gradient-to-tl from-purple-700 to-pink-500 cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            className="h-3 w-3 text-white"
          />
        </div>
      </div>
    </>
  );
};

export default PasswordField;
