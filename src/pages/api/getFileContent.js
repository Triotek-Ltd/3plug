import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const { path: filePath } = req.query; // Retrieve the 'path' from the query string

  if (!filePath) {
    return res.status(400).json({ error: "Path is required" });
  }

  try {
    // Fetch file content based on the path
    const fileContent = await fetchFileContentFromFileSystem(filePath);

    // If file content is not found, return 404
    if (!fileContent) {
      return res.status(404).json({ error: "File not found" });
    }

    // Return the file content as JSON if everything is fine
    res.status(200).json(fileContent);
  } catch (error) {
    console.error("Error loading file:", error);
    // Catch any other errors and respond with a 500 status
    res.status(500).json({ error: "Error loading file" });
  }
}

// Function that fetches file content from the server's filesystem
async function fetchFileContentFromFileSystem(filePath) {
  // Build the full file path from the current working directory
  const fullPath = path.join(process.cwd(), filePath); // Assuming files are stored in the 'files' folder in the root

  // Check if the file exists
  if (!fs.existsSync(fullPath)) {
    return null; // If file does not exist, return null
  }

  try {
    // Read the file synchronously (ensure it is in JSON format)
    const fileData = fs.readFileSync(fullPath, "utf-8");
    // Parse the file content assuming it's a JSON file
    return JSON.parse(fileData);
  } catch (error) {
    // If an error occurs while reading the file, return null
    console.error("Error reading file:", error);
    return null;
  }
}
