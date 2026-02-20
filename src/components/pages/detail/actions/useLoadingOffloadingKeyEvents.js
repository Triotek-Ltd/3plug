import { useEffect } from "react";

const useLoadingOffloadingKeyEvents = (currentStatus, onKeyPress) => {
  useEffect(() => {
    if (currentStatus !== "Loading" && currentStatus !== "Offloading") {
      return;
    }

    const handleKeyPress = (event) => {
      if (onKeyPress) {
        onKeyPress(event);
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentStatus, onKeyPress]);
};

export default useLoadingOffloadingKeyEvents;
