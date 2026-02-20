import { toUnderscoreLowercase } from "@/utils/textConvert";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { app, module, id, canvasItems } = req.body;

      const basePath = path.join(
        process.cwd(),
        "..",
        "..",
        "apps",
        app,
        module,
        "doc",
        id
      );

      const fieldsJsPath = path.join(basePath, "fields.js");
      const fieldsJsonPath = path.join(basePath, "fields.json");

      const convertToUnderscore = (name) => {
        return name.toLowerCase().replace(/\s+/g, "_");
      };

      const extractFields = (obj) => {
        let fieldsList = [];

        const extract = (item) => {
          if (Array.isArray(item)) {
            item.forEach(extract);
          } else if (typeof item === "object") {
            if (item.fields) {
              fieldsList = fieldsList.concat(
                item.fields.map(({ id, id1, name, icon, ...rest }) => {
                  let newId = id;
                  let newId1 = id1;

                  if (!id1) {
                    newId = convertToUnderscore(name);
                    newId1 = newId;
                  } else {
                    newId = id1;
                  }

                  return {
                    ...rest,
                    id: newId,
                    id1: newId1,
                    name,
                  };
                })
              );
            }
            Object.values(item).forEach(extract);
          }
        };

        extract(obj);
        return fieldsList;
      };

      const transformedCanvasItems = canvasItems.map(
        ({ id, id1, name, ...rest }) => {
          let newId = id;
          let newId1 = id1;

          if (!id1) {
            newId = convertToUnderscore(name);
            newId1 = newId;
          } else {
            newId = id1;
          }

          return {
            ...rest,
            id: newId,
            id1: newId1,
            name,
          };
        }
      );

      const fieldsJsData = `export const fields = ${JSON.stringify(
        transformedCanvasItems,
        null,
        2
      )};\n`;

      const fieldsJsonData = extractFields(transformedCanvasItems);

      fs.mkdirSync(basePath, { recursive: true });

      fs.writeFileSync(fieldsJsPath, fieldsJsData);

      fs.writeFileSync(fieldsJsonPath, JSON.stringify(fieldsJsonData, null, 2));

      res.status(200).json({ message: "Files saved successfully" });
    } catch (error) {
      console.error("Error saving files:", error);
      res.status(500).json({ error: "Error saving files" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
