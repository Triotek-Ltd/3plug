import fs from "fs";
import path from "path";

const SITES_DIR = path.join(process.cwd(), "sites");
const COMMON_SITE_CONFIG_PATH = path.join(SITES_DIR, "common_site_config.json");
const DJANGO_PORT = process.env.NEXT_PUBLIC_DJANGO_PORT || "8000";

function normalizeHost(value = "") {
  const host = String(value).trim().toLowerCase().split(",")[0].trim();
  return host.split(":")[0];
}

function getRequestHost(req) {
  const forwarded = req.headers["x-forwarded-host"];
  const direct = req.headers.host;
  return normalizeHost(forwarded || direct || "localhost");
}

function getDefaultSiteName() {
  try {
    if (!fs.existsSync(COMMON_SITE_CONFIG_PATH)) {
      return null;
    }
    const config = JSON.parse(fs.readFileSync(COMMON_SITE_CONFIG_PATH, "utf-8"));
    return config?.default_site || null;
  } catch {
    return null;
  }
}

function getSiteFolders() {
  if (!fs.existsSync(SITES_DIR)) {
    return [];
  }
  return fs
    .readdirSync(SITES_DIR)
    .filter((folder) =>
      fs.existsSync(path.join(SITES_DIR, folder, "site_config.json"))
    );
}

function findSiteFolderByHost(hostname) {
  const folders = getSiteFolders();
  const matched = [];

  for (const folder of folders) {
    const configPath = path.join(SITES_DIR, folder, "site_config.json");
    try {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      const domains = Array.isArray(config?.domains)
        ? config.domains.map((d) => normalizeHost(d))
        : [];
      if (domains.includes(hostname)) {
        matched.push(folder);
      }
    } catch {
      // ignore malformed site config and continue
    }
  }

  if (matched.length === 1) {
    return matched[0];
  }

  const defaultSite = getDefaultSiteName();
  if (defaultSite && folders.includes(defaultSite)) {
    return defaultSite;
  }

  return matched[0] || folders[0] || null;
}

function getDefaultSettings(siteConfig, host) {
  const siteName = siteConfig?.site_name || "3plug";
  const fallbackHost = host || "localhost";
  const previewHost =
    (siteConfig?.domains || []).find((d) => normalizeHost(d) !== "localhost") ||
    fallbackHost;
  const previewProtocol = previewHost === "localhost" ? "http" : "https";

  return {
    site_title: `${siteName}`,
    welcome_message: `Welcome to ${siteName}.`,
    website_preview_url: `${previewProtocol}://${previewHost}`,
    website_preview_label: "Website Preview",
    about_tooltip: `About ${siteName}`,
  };
}

function getSettingsPayload(siteConfig, host) {
  const defaults = getDefaultSettings(siteConfig, host);
  return { ...defaults, ...(siteConfig?.workspace_settings || {}) };
}

function getProfileUrl(req) {
  const host = getRequestHost(req);
  if (host === "localhost" || host === "127.0.0.1") {
    return `http://localhost:${DJANGO_PORT}/apis/profile/`;
  }
  const proto = req.headers["x-forwarded-proto"] || "https";
  return `${proto}://${host}/apis/profile/`;
}

async function assertAdminPermission(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return { ok: false, status: 401, error: "Missing authorization token" };
  }

  const tenant = req.headers["x-tenant"] || getRequestHost(req);
  const response = await fetch(getProfileUrl(req), {
    method: "GET",
    headers: {
      Authorization: authHeader,
      "X-Tenant": tenant,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return { ok: false, status: 403, error: "Unable to verify admin permissions" };
  }

  const profile = await response.json();
  if (!profile?.is_superuser && !profile?.is_staff) {
    return { ok: false, status: 403, error: "Admin permissions required" };
  }

  return { ok: true };
}

export default async function handler(req, res) {
  const host = getRequestHost(req);
  const siteFolder = findSiteFolderByHost(host);

  if (!siteFolder) {
    return res.status(404).json({ error: "No site configuration found" });
  }

  const configPath = path.join(SITES_DIR, siteFolder, "site_config.json");
  let siteConfig;
  try {
    siteConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  } catch {
    return res.status(500).json({ error: "Invalid site configuration" });
  }

  if (req.method === "GET") {
    return res.status(200).json({
      site_name: siteConfig.site_name || siteFolder,
      settings: getSettingsPayload(siteConfig, host),
    });
  }

  if (req.method === "POST") {
    const permission = await assertAdminPermission(req);
    if (!permission.ok) {
      return res.status(permission.status).json({ error: permission.error });
    }

    const input = req.body?.settings || {};
    const settings = {
      site_title: String(input.site_title || "").trim(),
      welcome_message: String(input.welcome_message || "").trim(),
      website_preview_url: String(input.website_preview_url || "").trim(),
      website_preview_label: String(input.website_preview_label || "").trim(),
      about_tooltip: String(input.about_tooltip || "").trim(),
    };

    siteConfig.workspace_settings = {
      ...getSettingsPayload(siteConfig, host),
      ...settings,
    };

    try {
      fs.writeFileSync(configPath, JSON.stringify(siteConfig, null, 2), "utf-8");
      return res.status(200).json({
        message: "Workspace settings saved",
        site_name: siteConfig.site_name || siteFolder,
        settings: siteConfig.workspace_settings,
      });
    } catch {
      return res.status(500).json({ error: "Failed to save workspace settings" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
