import { getChanges } from "./getChanges";
import { postData, updateData, deleteData, fetchJSON } from "./Api";
import { getDocDetail } from "./generateSidebarData";
import ToastTemplates from "@/components/core/common/toast/ToastTemplates";
import _ from "lodash";

export const handleSave = async ({
  data,
  form,
  appData,
  slug,
  id,
  setData,
  setForm,
  setLoading,
  config,
}) => {
  try {
    setLoading(true);

    const changes = getChanges(data, form, config);

    if (Object.keys(changes).length === 0) {
      ToastTemplates.info("No changes.");
      return;
    }

    const accumulatedChanges = {}; // Object to hold changes for a single update

    for (const key in changes) {
      const fieldConfig = config.fields.find(
        (field) => field.fieldname === key
      );
      const fieldType = fieldConfig?.fieldtype;

      // Determine how to handle changes based on fieldType
      switch (mapFieldType(fieldType)) {
        case "MultiSelect":
          accumulatedChanges[key] = changes[key].map((item) => item.id);
          break;
        case "Table":
          await handleTableChanges(
            changes[key],
            key,
            form,
            data,
            accumulatedChanges,
            appData,
            slug,
            id,
            config
          );
          break;
        case "File":
          accumulatedChanges[key] = changes[key];
          break;
        case "Link":
          accumulatedChanges[key] = changes[key].id
            ? changes[key].id
            : changes[key];
          break;
        default:
          accumulatedChanges[key] = changes[key];
      }
    }

    const response = await updateData(
      accumulatedChanges,
      `${appData.app}/${slug}/${id}`
    );
    if (response.data) {
      setData(response?.data);
      // setForm(response?.data);
    }

    ToastTemplates.success("Saved successfully.");
  } catch (error) {
    console.error("Error saving data:", error);
    ToastTemplates.error(`Error saving data: ${error}`);
  } finally {
    setLoading(false);
  }
};

const mapFieldType = (fieldType) => {
  const typeMapping = {
    Link: ["Link"],
    Table: ["Table", "Grid"],
    File: ["File", "Image", "Attachment"],
    MultiSelect: ["MultiSelect", "Table MultiSelect"],
  };

  for (const [mappedType, fieldTypes] of Object.entries(typeMapping)) {
    if (fieldTypes.includes(fieldType)) {
      return mappedType;
    }
  }

  return "Default"; // Return "Default" for non-matching fieldTypes
};

const handleTableChanges = async (
  change,
  key,
  form,
  data,
  accumulatedChanges,
  appData,
  slug,
  id,
  config
) => {
  const previousIds = data[key]?.map((item) => item.id).filter(Boolean);
  const combinedCreateItems = [];
  const fieldOption = await loadOptionField(config, key);
  const docDetail = getDocDetail(fieldOption);

  for (const item of change) {
    if (item.id) {
      if (item.__deleted) {
        // await deleteData(`${docDetail.endpoint}/${item.id}`);
      } else if (!previousIds.includes(item.id)) {
      } else {
        const { id, ...rest } = item;
        console.log("rest", rest);

        await updateData(rest, `${docDetail.endpoint}/${id}`);
      }
    } else {
      combinedCreateItems.push(item);
    }
  }

  if (combinedCreateItems.length > 0) {
    const response = await postData(combinedCreateItems, docDetail.endpoint);
    form[key] = [...form[key], ...response.data];
  }

  const currentIds = form[key].map((item) => item.id).filter(Boolean);
  if (!_.isEqual(previousIds, currentIds)) {
    accumulatedChanges[key] = currentIds;
  }
};

/**
 * Load the `option` field from the document JSON file at the specified docPath.
 * @param {Object} appData - The appData containing the docPath.
 * @param {string} docId - The document ID.
 * @param {string} field - The field for which to load the option.
 * @returns {Promise<string>} The option value.
 */
const loadOptionField = async (docData, fieldname) => {
  try {
    if (docData && docData.fields) {
      // Find the field with the matching fieldname
      const fieldData = docData.fields.find(
        (field) => field.fieldname === fieldname
      );

      if (fieldData) {
        // Check if the 'options' key exists in the found field
        if (fieldData.options) {
          return fieldData.options; // Return the options field (e.g., "Company")
        } else {
          throw new Error(`Options field not found for ${fieldname}`);
        }
      } else {
        throw new Error(`Field with fieldname ${fieldname} not found`);
      }
    } else {
      throw new Error("Document data or fields not found");
    }
  } catch (error) {
    console.error(`Error loading option field: ${error.message}`);
    throw error;
  }
};
