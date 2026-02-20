import { addFieldToConfig } from "./addFieldToConfig";
import { getFirstFieldname } from "./getFirstField";
import { getLastFieldname } from "./getLastFieldname";

/**
 * Add a column before or after a given field.
 * @param {Object} localConfig - Current configuration.
 * @param {Object} column - Column to add a new field to.
 * @param {Boolean} top - Whether to add the column before (true) or after (false).
 * @returns {Promise<Object>} - Updated configuration.
 */
const addColumn = async (localConfig, column, top = false) => {
  const { fieldname, prevField } = column;
  const firstField = getFirstFieldname(column);
  const lastFieldname = getLastFieldname(column);

  let newConfig = null;

  if (top) {
    if (prevField) {
      newConfig = await addFieldToConfig(localConfig, prevField, "Column");
    } else {
      newConfig = await addFieldToConfig(
        localConfig,
        firstField,
        "Column",
        true
      );
    }
  } else {
    const targetField = lastFieldname || fieldname || prevField;
    newConfig = await addFieldToConfig(localConfig, targetField, "Column");
  }

  return newConfig;
};

export default addColumn;
