import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "src", "data", "sidebar.json");

  if (req.method === "GET") {
    // Read sidebar.json file
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      const sidebar = JSON.parse(data);
      res.status(200).json(sidebar);
    } catch (error) {
      res.status(500).json({ error: "Failed to load sidebar settings." });
    }
  } else if (req.method === "POST") {
    // Save new sidebar settings
    const sidebarData = req.body;

    // Wrap the sidebar data in the sidebarLinks structure
    const sidebarToSave = { sidebarLinks: sidebarData };

    try {
      fs.writeFileSync(
        filePath,
        JSON.stringify(sidebarToSave, null, 2),
        "utf-8"
      );
      res.status(200).json({ message: "Sidebar settings saved successfully." });
    } catch (error) {
      res.status(500).json({ error: "Failed to save sidebar settings." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
