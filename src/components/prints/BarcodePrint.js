import React, { useEffect } from "react";
import { format, formatDistanceToNow } from "date-fns";

const BarcodePrint = React.forwardRef(({ data }, ref) => {
  useEffect(() => {
    const handleBeforePrint = () => {
      // No additional action needed before printing
    };

    window.addEventListener("beforeprint", handleBeforePrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
    };
  }, []);

  const formattedDate = data?.created_at
    ? format(new Date(data.created_at), "MMM d, yyyy")
    : "";

  return (
    <div
      ref={ref}
      style={{
        width: "62mm", // Set the page width to 62mm
        height: "auto", // Allow height to adjust automatically
        margin: 0, // Remove any margins during printing
        display: "flex", // Center the content
        flexDirection: "column", // Stack content vertically
        justifyContent: "center", // Horizontally center the content
        alignItems: "center", // Vertically center the content
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
        }}
      >
        {/* Title and Name (Rotated Block) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            transform: "rotate(-90deg)",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            Masafa Logistics
          </h3>
          <h4
            style={{
              marginTop: "2mm",
              fontSize: "12px",
              fontWeight: "normal",
              textAlign: "center",
            }}
          >
            {formattedDate}
          </h4>
        </div>
        {/* QR Code */}
        <img
          src={
            typeof data.barcode === "string" &&
            data?.barcode?.includes("/media")
              ? data.barcode
                  .replace("/media", "/apis/media")
                  .replace(/\/[^\/]+$/, `/${data.id}_qr.png`)
              : data?.barcode?.replace("barcode", "qr")
          }
          alt="qr code"
          style={{
            width: "33mm", // Size of the QR code
            height: "33mm", // Ensure square dimensions
            padding: "1mm",
            objectFit: "contain", // Maintain the aspect ratio of the image
            marginRight: "4mm",
          }}
        />
      </div>

      {/* Barcode */}
      <img
        src={
          typeof data.barcode === "string" && data.barcode.includes("/media")
            ? data?.barcode?.replace("/media", "/apis/media")
            : data.barcode
        }
        alt="barcode"
        style={{
          marginTop: "5mm",
          maxWidth: "100%", // Ensure the barcode fits within the container
          maxHeight: "100%", // Ensure the height doesn't overflow
          objectFit: "contain",
        }}
      />

      {/* Description */}
      <p
        style={{
          margin: "3mm",
          fontSize: "11px",
          textAlign: "center",
          wordWrap: "break-word", // Handle long descriptions
        }}
      >
        {data.description}
      </p>
    </div>
  );
});

export default BarcodePrint;
