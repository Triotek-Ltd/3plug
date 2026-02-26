import fs from "fs";
import path from "path";

function safeSegment(value) {
  return String(value || "")
    .trim()
    .replace(/[\\/]/g, "");
}

function getDocBasePath({ bundle, app, module, submodule, docKey }) {
  const bundleSeg = safeSegment(bundle);
  const appSeg = safeSegment(app);
  const moduleSeg = safeSegment(module);
  const submoduleSeg = safeSegment(submodule);
  const docSeg = safeSegment(docKey);

  if (!bundleSeg || !appSeg || !moduleSeg || !submoduleSeg || !docSeg) {
    return null;
  }

  return path.join(
    process.cwd(),
    "bundles",
    bundleSeg,
    appSeg,
    moduleSeg,
    "submodule",
    submoduleSeg,
    "docs",
    docSeg
  );
}

function readJsonIfExists(filePath, fallback = {}) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return fallback;
  }
}

export default function handler(req, res) {
  if (req.method === "GET") {
    const { bundle, app, module, submodule, doc_key: docKey } = req.query;
    const basePath = getDocBasePath({ bundle, app, module, submodule, docKey });
    if (!basePath) {
      return res.status(400).json({ error: "Missing required hierarchy fields" });
    }
    if (!fs.existsSync(basePath)) {
      return res.status(404).json({ error: "Native doc path not found" });
    }
    return res.status(200).json({
      doc: readJsonIfExists(path.join(basePath, "doc.json"), {}),
      schema: readJsonIfExists(path.join(basePath, "schema.json"), {}),
      actions: readJsonIfExists(path.join(basePath, "actions.json"), {}),
      runtime: readJsonIfExists(path.join(basePath, `${safeSegment(docKey)}.json`), {}),
      base_path: basePath,
    });
  }

  if (req.method === "POST") {
    const { bundle, app, module, submodule, docKey, doc, schema, actions } = req.body || {};
    const basePath = getDocBasePath({ bundle, app, module, submodule, docKey });
    if (!basePath) {
      return res.status(400).json({ error: "Missing required hierarchy fields" });
    }
    try {
      fs.mkdirSync(basePath, { recursive: true });
      if (doc) fs.writeFileSync(path.join(basePath, "doc.json"), JSON.stringify(doc, null, 2), "utf-8");
      if (schema) fs.writeFileSync(path.join(basePath, "schema.json"), JSON.stringify(schema, null, 2), "utf-8");
      if (actions) fs.writeFileSync(path.join(basePath, "actions.json"), JSON.stringify(actions, null, 2), "utf-8");
      return res.status(200).json({ message: "Native doc files saved", base_path: basePath });
    } catch (error) {
      return res.status(500).json({ error: error?.message || "Failed to save native doc files" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
