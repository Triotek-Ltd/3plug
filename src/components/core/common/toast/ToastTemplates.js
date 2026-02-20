import React from "react";
import { toast } from "react-toastify";
import {
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const baseStyle = "flex items-center text-slate-800";

const ToastTemplates = {
  success: (message, title = "Success!", position = "bottom-right") =>
    toast(
      <div className={`${baseStyle} text-green-500 w-full`}>
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="w-6 h-6 mr-3 text-green-600"
        />
        <div>
          {/* <p className="font-semibold text-sm">{title}</p> */}
          <p className="text-sm">{message}</p>
        </div>
      </div>,
      {
        autoClose: 3000,
        hideProgressBar: false,
        progressClassName: "bg-green-300",
        position: position,
        toastClassName: "wide-toast", // Apply custom class for width
      }
    ),

  error: (message, title = "Error!", position = "top-center") =>
    toast(
      <div className={`${baseStyle} !text-red-500`}>
        <FontAwesomeIcon
          icon={faTimesCircle}
          className="w-6 h-6 mr-3 text-red-600"
        />
        <div>
          {/* <p className="font-semibold text-sm">{title}</p> */}
          <p className="text-sm">{message}</p>
        </div>
      </div>,
      {
        autoClose: false, // Stay on screen until dismissed
        hideProgressBar: false, // Show progress bar even if it's static
        progressClassName: "bg-red-300",
        position: position,
        toastClassName: "wide-toast", // Apply custom class for width
      }
    ),

  warning: (message, title = "Warning!", position = "bottom-right") =>
    toast(
      <div className={`${baseStyle} text-yellow-500 w-full`}>
        <FontAwesomeIcon
          icon={faExclamationCircle}
          className="w-6 h-6 mr-3 text-yellow-600"
        />
        <div>
          {/* <p className="font-semibold text-sm">{title}</p> */}
          <p className="text-sm">{message}</p>
        </div>
      </div>,
      {
        autoClose: false, // Stay on screen until dismissed
        hideProgressBar: false,
        progressClassName: "bg-yellow-300",
        position: position,
        toastClassName: "wide-toast", // Apply custom class for width
      }
    ),

  info: (message, title = "Info!", position = "bottom-right") =>
    toast(
      <div className={`${baseStyle} text-blue-500 w-full`}>
        <FontAwesomeIcon
          icon={faInfoCircle}
          className="w-6 h-6 mr-3 text-blue-600"
        />
        <div>
          {/* <p className="font-semibold text-sm">{title}</p> */}
          <p className="text-sm">{message}</p>
        </div>
      </div>,
      {
        autoClose: 3000,
        hideProgressBar: false,
        progressClassName: "bg-blue-300",
        position: position,
        toastClassName: "wide-toast", // Apply custom class for width
      }
    ),
};

export default ToastTemplates;
