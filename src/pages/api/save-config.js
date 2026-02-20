import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { directoryPath, filename, content } = req.body;

  if (!directoryPath || !filename || !content) {
    return res
      .status(400)
      .json({ message: "Directory path, filename, and content are required" });
  }

  try {
    // Find the position of "apps" in the given path
    const appsIndex = directoryPath.indexOf("apps");

    if (appsIndex === -1) {
      return res
        .status(400)
        .json({ message: `"apps" directory not found in the path` });
    }

    // Extract the relative path after "apps"
    const relativePath = directoryPath.substring(appsIndex);

    // Construct the new file path in the project root directory
    const fullPath = path.join(process.cwd(), relativePath, filename);

    // Ensure the directory exists before writing the file
    await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });

    // Write the content to the file
    await fs.promises.writeFile(fullPath, JSON.stringify(content, null, 2));

    res
      .status(200)
      .json({ message: "Config saved successfully", path: fullPath });
  } catch (error) {
    console.error("Error saving config:", error);
    res
      .status(500)
      .json({ message: "Failed to save config", error: error.message });
  }
}
