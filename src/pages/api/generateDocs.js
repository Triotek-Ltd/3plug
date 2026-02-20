// pages/api/generateDocs.js

import { exec } from "child_process";

export default async function handler(req, res) {
  try {
    // Run the Python script to generate JSON documentation data
    exec(
      "python3 src/components/functions/documentation/documentation_script.py",
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing script: ${error.message}`);
          res.status(500).json({ error: "Script execution failed" });
          return;
        }
        if (stderr) {
          console.error(`Script stderr: ${stderr}`);
          res.status(500).json({ error: "Script execution error" });
          return;
        }
        res
          .status(200)
          .json({ message: "Documentation data generated successfully" });
      }
    );
  } catch (error) {
    console.error("Error triggering script:", error);
    res.status(500).json({ error: "Server error" });
  }
}
