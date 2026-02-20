import { createCanvas } from "canvas";
import JsBarcode from "jsbarcode";

export default function handler(req, res) {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ error: "Missing text parameter" });
  }

  try {
    // High-resolution settings (double the default size for better quality)
    const width = 800; // Increased width for sharper lines
    const height = 200; // Increased height for better readability
    const dpi = 600; // High DPI for print-quality output

    // Create high-resolution canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Set higher DPI scale
    ctx.scale(dpi / 72, dpi / 72); // Adjust DPI for crisp output

    // Generate high-quality barcode
    JsBarcode(canvas, text, {
      format: "CODE128",
      displayValue: true,
      background: "#ffffff",
      lineColor: "#000000",
      width: 4, // Increase line width for sharper bars
      height: 100, // More height for better scanning
      fontSize: 48, // Larger text for clarity
      margin: 10, // Add margin for better spacing
    });

    // Convert the canvas to a high-quality PNG buffer
    const buffer = canvas.toBuffer("image/png", { compressionLevel: 3 });

    // Set headers to return image
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Length", buffer.length);
    res.status(200).end(buffer);
  } catch (error) {
    res.status(500).json({ error: "Barcode generation failed" });
  }
}
