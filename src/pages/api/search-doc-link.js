import path from "path";
import fs from "fs";

// Define the root path for apps
const basePath = path.join(process.cwd());

// Load the doctypes data
const doctypeConfigPath = path.join(basePath, "sites", "doctypes.json");
const doctypesData = JSON.parse(fs.readFileSync(doctypeConfigPath, "utf8"));

// Define static list matches
const staticMatches = [
  { type: "app", name: "App", id: "apps", link: "/apps" },
  { type: "module1", name: "Module", id: "module", link: "/modules" },
  { type: "doctype", name: "Document", id: "documents", link: "/documents" },
];

// Helper function to normalize and clean the search keyword
const cleanKeyword = (keyword) => {
  let cleanedKeyword = keyword.trim().toLowerCase();

  // Remove "New" at the beginning or "List" at the end if present
  if (cleanedKeyword.startsWith("new ")) {
    cleanedKeyword = cleanedKeyword.slice(4).trim(); // Remove 'new'
  }

  if (cleanedKeyword.endsWith(" list")) {
    cleanedKeyword = cleanedKeyword.slice(0, -5).trim(); // Remove 'list'
  } else if (cleanedKeyword.endsWith(" lis")) {
    cleanedKeyword = cleanedKeyword.slice(0, -4).trim(); // Remove 'lis'
  } else if (cleanedKeyword.endsWith(" li")) {
    cleanedKeyword = cleanedKeyword.slice(0, -3).trim(); // Remove 'li'
  } else if (cleanedKeyword.endsWith(" l")) {
    cleanedKeyword = cleanedKeyword.slice(0, -2).trim(); // Remove 'l'
  }

  return cleanedKeyword;
};

// Helper function to perform advanced fuzzy matching
const isFuzzyMatch = (str, keyword) => {
  return str.toLowerCase().includes(keyword);
};

export default async function handler(req, res) {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ message: "Keyword is required" });
  }

  // Clean and prepare the search keyword for matching
  const cleanedKeyword = cleanKeyword(keyword);

  // Array to hold the matched results
  let matchedResults = [];

  // Check static matches
  for (const staticItem of staticMatches) {
    if (isFuzzyMatch(staticItem.name, cleanedKeyword)) {
      matchedResults.push(staticItem);
    }
  }

  // Iterate through the installed apps to find matching doctypes, modules, and apps
  for (const appData of doctypesData) {
    // Match app name or ID
    if (
      isFuzzyMatch(appData.name, cleanedKeyword) ||
      isFuzzyMatch(appData.id, cleanedKeyword)
    ) {
      matchedResults.push({
        type: "app",
        name: appData.name,
        id: appData.id,
        link: `/apps/${appData.id}`,
      });
    }

    // Iterate through the modules and their docs
    for (const module1 of appData.modules) {
      // Match module1 name or ID
      if (
        isFuzzyMatch(module1.name, cleanedKeyword) ||
        isFuzzyMatch(module1.id, cleanedKeyword)
      ) {
        matchedResults.push({
          type: "module1",
          name: module1.name,
          id: module1.id,
          app_id: appData.id,
          link: `/modules/${module1.id}`,
        });
      }

      // Match doctypes within the module1
      for (const doc of module1.docs) {
        if (
          isFuzzyMatch(doc.id, cleanedKeyword) ||
          isFuzzyMatch(doc.name, cleanedKeyword)
        ) {
          matchedResults.push({
            type: "doctype",
            name: doc.name,
            id: doc.id,
            app_id: appData.id,
            module_id: module1.id,
            link: `/app/${doc.id}`,
          });
        }
      }
    }
  }

  // Return matched results
  return res.status(200).json(matchedResults.length > 0 ? matchedResults : []);
}
