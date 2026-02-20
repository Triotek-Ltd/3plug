import { getFieldsAfterBreak } from "./getFieldsAfterBreak";
import { deleteFieldsFromConfig } from "./deleteFields";

/**
 * Delete the column and its related fields from the configuration.
 * @param {Object} localConfig - Current configuration.
 * @param {Object} column - Column to delete.
 * @param {Boolean} deleteFields - Whether to delete related fields or not.
 * @returns {Promise<Object>} - Updated configuration.
 */
const deleteColumn = async (localConfig, column, deleteFields = false) => {
  const targetField =
    column.fieldname || column.prevField || getFirstFieldname(column);
  const includeField = column.fieldname || getFirstFieldname(column);

  let list;
  if (deleteFields) {
    // Delete column and related fields
    list = getFieldsAfterBreak(
      localConfig,
      targetField,
      "Column",
      !!includeField
    );
  } else {
    // Only delete the column break (no fields)
    list = [targetField];
  }

  const newConfig = await deleteFieldsFromConfig(localConfig, list);
  return newConfig;
};

export default deleteColumn;
