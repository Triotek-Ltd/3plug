import { useEffect, useState } from "react";

const useLoadingOffloadingKeyEvents = (currentStatus, onScannedCode) => {
  const [scannedCode, setScannedCode] = useState("");

  useEffect(() => {
    if (
      currentStatus !== "Loading" &&
      currentStatus !== "Offloading" &&
      currentStatus !== "Adding Items"
    ) {
      return;
    }

    const handleKeyPress = (event) => {
      if (event.key.length === 1) {
        // Accumulate the barcode data only if it is a printable character
        setScannedCode((prevCode) => prevCode + event.key);
      }

      if (event.key === "Enter") {
        if (scannedCode.length > 0) {
          if (onScannedCode) {
            onScannedCode(scannedCode);
          }
          setScannedCode("");
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentStatus, scannedCode, onScannedCode]);

  return scannedCode;
};

export default useLoadingOffloadingKeyEvents;
