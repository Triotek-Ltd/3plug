import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const doctypeConfigPath = path.join(process.cwd(), "sites", "doctypes.json");

  try {
    const data = JSON.parse(fs.readFileSync(doctypeConfigPath, "utf-8"));
    res.status(200).json(data);
  } catch (error) {
    res.status(200).json([]);
  }
}
