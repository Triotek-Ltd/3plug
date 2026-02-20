import doctypesData from "../../sites/doctypes.json"; // Directly import the JSON file

// Utility function to find document details and simulate the logic from the original handler
export const findDocDetails = (slug, type = "doctype") => {
  try {
    // Iterate over the doctypesData (doctypes.json content)
    for (const app of doctypesData) {
      for (const module1 of app.modules) {
        const docs =
          type === "doctype"
            ? module1.docs
            : type === "print_format"
            ? module1.print_formats
            : module1[type];

        const doc = docs.find((doc) => doc.id === slug);
        if (doc) {
          const appPathWithAppFolder = `/apps/${app.id}/${app.id}`;

          const appDoctypePath = `${appPathWithAppFolder}/${module1.id}/${type}`;

          // Simulate the logic that would normally check the existence of files using fs
          const docPath =
            [appDoctypePath].find((path) => path.includes(module1.id)) || null;

          const values = {
            moduleRoot: appPathWithAppFolder,
            app: app.name,
            app_id: app.id,
            module_id: module1.id,
            module: module1.name,
            docPath: docPath ? `${docPath}/${slug}` : null,
            doc: doc,
          };

          // Return document details as expected
          return values;
        }
      }
    }

    // Return null if no document was found
    return null;
  } catch (error) {
    console.error(
      "Error reading doctypes.json or finding document details:",
      error
    );
    return null;
  }
};

// Example usage for the function (would typically be inside a Next.js page component)
export const getDocDetails = async (slug) => {
  const docDetails = findDocDetails(slug);
  if (docDetails) {
    // Handle the found document details (for example, return or render)
    console.log("Document found:", docDetails);
  } else {
    // Handle the case when no document is found
    console.log("Document not found");
  }
};
