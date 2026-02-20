import React, { useEffect } from "react";
import { format } from "date-fns";

const BarcodePrintList = React.forwardRef(({ data, selectedRows }, ref) => {
  useEffect(() => {
    const handleBeforePrint = () => {
      // No additional action needed before printing
    };

    window.addEventListener("beforeprint", handleBeforePrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
    };
  }, []);

  // Filter the data to only include the rows whose IDs match the selectedRows
  const filteredData = selectedRows
    ? data.filter((item) => selectedRows.includes(item.id))
    : data;

  return (
    <div
      ref={ref}
      style={{
        width: "62mm", // Set the page width to 62mm
        height: "auto", // Allow height to adjust automatically
        margin: 0, // Remove any margins during printing
        display: "flex", // Center the content
        flexDirection: "column", // Stack barcodes and QR codes vertically
        alignItems: "center", // Vertically center the content
      }}
    >
      {filteredData?.map((item, index) => {
        // Format the date for the current item
        const formattedDate = item?.created_at
          ? format(new Date(item.created_at), "MMM d, yyyy")
          : "";

        return (
          <div
            key={index}
            style={{
              marginBottom: "10mm", // Add some space between each item
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              breakAfter: "page", // Add page break after each item
            }}
          >
            {/* Title and Name (Rotated Block) */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                alignItems: "center", // Align items to the center of the container
                justifyContent: "space-between",
                marginBottom: "5mm",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  transform: "rotate(-90deg)", // Rotate the text block vertically
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
                  typeof item.barcode === "string" &&
                  item.barcode.includes("/media")
                    ? item.barcode
                        .replace("/media", "/apis/media")
                        .replace(/\/[^\/]+$/, `/${item.id}_qr.png`)
                    : item.barcode
                }
                alt={`qr-code-${index}`}
                style={{
                  width: "30mm", // Set size for QR code
                  height: "30mm", // Ensure the dimensions are square
                  objectFit: "contain", // Maintain aspect ratio
                  marginRight: "5mm",
                }}
              />
            </div>

            {/* Barcode */}
            <img
              src={
                typeof item.barcode === "string" &&
                item.barcode.includes("/media")
                  ? item.barcode
                      .replace("/media", "/apis/media")
                      .replace(/\/[^\/]+$/, `/${item.id}_barcode.png`)
                  : item.barcode
              }
              alt={`barcode-${index}`}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
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
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  );
});

export default BarcodePrintList;
