import appsConfig from "../../sites/doctypes.json"; // Import doctypes.json

export const getSiteConfigByHostname = async () => {
  if (typeof window === "undefined") return null;

  const hostname = window.location.hostname;

  try {
    const response = await fetch("/api/loadSiteConfigs");
    const siteConfigs = await response.json();

    return siteConfigs.find((site) => site.domains.includes(hostname)) || null;
  } catch (error) {
    console.error("Error fetching site configurations:", error);
    return null;
  }
};

// Helper function to check if an ID is valid (does not start with '__')
const isValidId = (id) => id && !id.startsWith("__");

// Function to extract all installed apps and associated modules
export const generateSidebarData = () => {
  const installedApps = getSiteConfigByHostname().installed_apps || []; // Extract installed apps
  const apps = [];
  const modules = [];

  installedApps.forEach((appId) => {
    if (!isValidId(appId)) return; // Skip apps with invalid IDs

    const appData = appsConfig.find((app) => app.id === appId);

    if (appData && isValidId(appData.id)) {
      // Add the app to the list of apps
      apps.push({
        id: appData.id,
        name: appData.name.charAt(0).toUpperCase() + appData.name.slice(1), // Capitalize app name
        link: `/apps/${appData.id}`, // App link
      });

      // Add each module of the app to the list of modules if it has a valid ID
      appData.modules
        .filter((module) => isValidId(module.id)) // Skip modules with invalid IDs
        .forEach((module) => {
          modules.push({
            id: module.id,
            name: module.name.charAt(0).toUpperCase() + module.name.slice(1), // Capitalize module name
            link: `/modules/${module.id}`, // Module link
            appId: appData.id, // Keep track of the parent app ID
          });
        });
    }
  });

  return {
    apps,
    modules,
    developerMode: getSiteConfigByHostname()?.developer_mode,
  };
};

// Function to get modules of a specific app
export const getModulesByApp = (appId) => {
  if (!isValidId(appId)) return []; // Skip if appId is invalid

  const appData = appsConfig.find((app) => app.id === appId);

  if (appData && appData.modules) {
    return appData.modules
      .filter((module) => isValidId(module.id)) // Skip modules with invalid IDs
      .map((module) => ({
        id: module.id,
        name: module.name.charAt(0).toUpperCase() + module.name.slice(1), // Capitalize module name
        link: `/modules/${module.id}`, // Module link
      }));
  }
  return [];
};

// Function to get documents of a specific module or app
export const getDocsByModuleOrApp = (appId, moduleId = null) => {
  if (!isValidId(appId)) return []; // Skip if appId is invalid

  const appData = appsConfig.find((app) => app.id === appId);

  if (appData && appData.modules) {
    const targetModules = moduleId
      ? appData.modules.filter(
          (module) => module.id === moduleId && isValidId(module.id) // Skip if moduleId is invalid
        )
      : appData.modules.filter((module) => isValidId(module.id)); // Filter out modules with invalid IDs

    const docs = targetModules.reduce((acc, module) => {
      if (module.docs) {
        const moduleDocs = module.docs
          .filter((doc) => isValidId(doc.id)) // Skip documents with invalid IDs
          .map((doc) => ({
            id: doc.id,
            name: doc.name.charAt(0).toUpperCase() + doc.name.slice(1), // Capitalize document name
            link: `/app/${doc.id}`, // Document link
          }));
        return acc.concat(moduleDocs);
      }
      return acc;
    }, []);

    return docs;
  }
  return [];
};

// Function to get documents by moduleId across all apps
export const getDocsByModule = (moduleId) => {
  if (!isValidId(moduleId)) return []; // Skip if moduleId is invalid

  const docs = [];

  // Iterate through all apps in the configuration
  appsConfig.forEach((app) => {
    if (app.modules) {
      // Filter modules matching the given moduleId
      const matchingModules = app.modules.filter(
        (module) => module.id === moduleId && isValidId(module.id)
      );

      matchingModules.forEach((module) => {
        if (module.docs) {
          const moduleDocs = module.docs
            .filter((doc) => isValidId(doc.id)) // Skip documents with invalid IDs
            .map((doc) => ({
              id: doc.id,
              name: doc.name.charAt(0).toUpperCase() + doc.name.slice(1), // Capitalize document name
              link: `/app/${doc.id}`, // Document link
            }));
          docs.push(...moduleDocs); // Add the documents to the list
        }
      });
    }
  });

  return docs;
};

// New function to get document details by ID or name
export const getDocDetail = (identifier) => {
  for (const app of appsConfig) {
    for (const module1 of app.modules || []) {
      const doc = module1.docs.find(
        (d) =>
          d.id === identifier ||
          d.name.toLowerCase() === identifier.toLowerCase()
      );
      if (doc) {
        return {
          id: doc.id,
          name: capitalize(doc.name),
          link: `/app/${doc.id}`,
          endpoint: `${app.id}/${doc.id}`,
          app: app.id,
          module: module1.id,
        };
      }
    }
  }
  return null;
};

// Helper function to capitalize text
const capitalize = (text) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
