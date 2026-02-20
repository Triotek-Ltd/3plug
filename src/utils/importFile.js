import doctypesData from "../../sites/doctypes.json";

// Utility function to find the document details from doctypes.json data
export const importFile = async (name, filename, type = "doctype") => {
  try {
    // Iterate over the doctypesData (doctypes.json content)
    for (const app of doctypesData) {
      for (const module1 of app.modules) {
        const doc = module1.docs.find((doc) => doc.id === name);
        if (doc) {
          // Simulate document path logic without fs
          // Assuming docPath is a known structure without fs checks
          const appDoctypePath = `./apps/${app.id}/${app.id}/${module1.id}/${type}`;

          // Simulate checking the file path structure and returning content
          const doctypeFilePath = `${appDoctypePath}/${name}/${filename}`;

          // For demonstration purposes, assume the file content is statically available
          // In a real-world scenario, you'd fetch this from a server or CMS
          const fileContent = await fetchFileContent(
            doctypeFilePath.toString()
          );

          if (fileContent) {
            return {
              content: fileContent?.data || fileContent, // Returning the content of the file
            };
          } else {
            return { message: "File not found" };
          }
        }
      }
    }
    return { message: "Module not found" }; // Return message if no matching document
  } catch (error) {
    console.error(
      "Error processing doctypes.json or finding document details:",
      error
    );
    return { message: "Error processing document" };
  }
};

const fetchFileContent = async (path) => {
  if (!path) {
    return;
  }

  try {
    const newp = path.toString(); // Use path as a string

    // Make a request to your API route in Next.js
    const response = await fetch(
      `/api/getFileContent?path=${encodeURIComponent(newp)}`
    );

    if (!response.ok) {
      throw new Error(`Failed to load file: ${newp}`);
    }

    const data = await response.json();

    return { data };
  } catch (error) {
    console.log("Error loading file:", error);
    return null;
  }
};

// Example usage
export default function handler(req, res) {
  const { name, filename } = req.query;

  // Check if both `name` and `filename` are provided
  if (!name || !filename) {
    return res
      .status(400)
      .json({ message: "Missing 'name' or 'filename' query parameter" });
  }

  // Fetch document details based on name and filename
  const docDetails = importFile(name, filename);

  if (docDetails.content) {
    return res.status(200).json(docDetails); // Return file content if found
  } else {
    return res.status(404).json(docDetails); // Return error message if not found
  }
}
