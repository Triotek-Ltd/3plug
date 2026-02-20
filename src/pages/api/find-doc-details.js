import path from "path";
import fs from "fs";
import modelsData from "/sites/doctypes.json";

// Define the root path for apps
const basePath = path.join(process.cwd(), "..", "..");

export default async function handler(req, res) {
  const { name } = req.query;

  // Iterate through the models data to find the app, module, and doc that matches
  for (const app of modelsData) {
    for (const module of app.modules) {
      const doc = module.docs.find((doc) => doc.id === name);
      if (doc) {
        // Check for paths like modulePath/module/doc or modulePath/module/doctype
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

        if (fs.existsSync(p1)) {
          appPathWithAppFolder = appPathWithAppFolder1;
        } else if (fs.existsSync(p2)) {
          appPathWithAppFolder = appPathWithAppFolder2;
        }
        const appDocPath = path.join(appPathWithAppFolder, module.id, "doc");
        const appDoctypePath = path.join(
          appPathWithAppFolder,
          module.id,
          "doctype"
        );

        // Try to find the doc or doctype path inside the second app folder
        if (fs.existsSync(appDocPath)) {
          docPath = appDocPath;
        } else if (fs.existsSync(appDoctypePath)) {
          docPath = appDoctypePath;
        }

        // Return the app, module, module root, and document path if found
        return res.status(200).json({
          moduleRoot: appPathWithAppFolder,
          app: app.name,
          app_id: app.id,
          module_id: module.id,
          module: module.name,
          docPath: path.join(docPath, name),
          doc: doc,
        });
      }
    }
  }

  // Return 404 if no match is found
  res.status(404).json({ message: "Module not found" });
}
