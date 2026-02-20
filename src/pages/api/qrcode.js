import QRCode from "qrcode";

export default async function handler(req, res) {
  const { text } = req.query; // Get text from query params

  if (!text) {
    return res.status(400).json({ error: "Missing text parameter" });
  }

  try {
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      margin: 2,
      width: 500, // Increase the width
      scale: 10, // Increase the scale for higher resolution
    });
    const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, "");

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Length", base64Data.length);
    res.status(200).send(Buffer.from(base64Data, "base64"));
  } catch (error) {
    res.status(500).json({ error: "QR code generation failed" });
  }
}
