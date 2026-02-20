import { promises as fs } from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const { filePath } = req.query;

    if (!filePath) {
      return res.status(400).json({ error: "No file path provided" });
    }

    console.log("Loading file:", filePath);

    // Convert relative path to absolute path
    const absolutePath = path.join(process.cwd(), filePath);

    // Read the file content
    const fileContents = await fs.readFile(absolutePath, "utf-8");

    // Set the content type as JavaScript module
    res.setHeader("Content-Type", "application/javascript");
    res.status(200).send(fileContents);
  } catch (error) {
    console.error("Failed to read file:", error);
    res.status(500).json({ error: "Failed to load file" });
  }
}
