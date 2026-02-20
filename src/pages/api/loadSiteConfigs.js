import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const SITES_DIR = path.join(process.cwd(), "sites");
  const siteConfigs = [];

  try {
    const siteFolders = fs.readdirSync(SITES_DIR);

    siteFolders.forEach((folder) => {
      const configPath = path.join(SITES_DIR, folder, "site_config.json");

      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        siteConfigs.push(config);
      }
    });

    res.status(200).json(siteConfigs);
  } catch (error) {
    res.status(500).json({ error: "Failed to load site configurations" });
  }
}
