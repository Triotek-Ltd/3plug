import path from "path";
import fs from "fs";

import modelsData from "/sites/doctypes.json";

// Define the root path for apps
const basePath = path.join(process.cwd(), "..", "..");

export default async function handler(req, res) {
  const { name, filename } = req.query;

  // Check if both `name` and `filename` are provided
  if (!name || !filename) {
    return res
      .status(400)
      .json({ message: "Missing 'name' or 'filename' query parameter" });
  }

  // Iterate through the models data to find the app, module, and doc that matches
  for (const app of modelsData) {
    for (const module of app.modules) {
      const doc = module.docs.find((doc) => doc.id === name);
      if (doc) {
        // Construct the potential document path
        let docPath = null;
        let appPathWithAppFolder = null;

        // Check with the additional app folder path: /apps/app/app
        const appPathWithAppFolder1 = path.join(basePath, "apps", app.id);
        const appPathWithAppFolder2 = path.join(
          basePath,
          "apps",
          app.id,
          app.id
        );
        const p1 = path.join(appPathWithAppFolder1, "modules.txt");
        const p2 = path.join(appPathWithAppFolder2, "modules.txt");

        // Check if modules.txt exists in either of the paths
        if (fs.existsSync(p1)) {
          appPathWithAppFolder = appPathWithAppFolder1;
        } else if (fs.existsSync(p2)) {
          appPathWithAppFolder = appPathWithAppFolder2;
        }

        // Define possible doc/doctype paths
        const appDocPath = path.join(appPathWithAppFolder, module.id, "doc");
        const appDoctypePath = path.join(
          appPathWithAppFolder,
          module.id,
          "doctype"
        );

        // Try to find the doc or doctype path
        if (fs.existsSync(appDocPath)) {
          docPath = appDocPath;
        } else if (fs.existsSync(appDoctypePath)) {
          docPath = appDoctypePath;
        }

        // If we found a valid document path, try to load the file
        if (docPath) {
          const filePath = path.join(docPath, name, filename);
          if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, "utf-8");

            return res.status(200).json({
              content: JSON.parse(fileContent), // Returning content of the file
            });
          } else {
            return res.status(404).json({ message: "File not found" });
          }
        }
      }
    }
  }

  // Return 404 if no match is found
  res.status(404).json({ message: "Module not found" });
}
