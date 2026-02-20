import _ from "lodash";

export const getChanges = (original, updated, config) => {
  const changes = {};

  for (const key in updated) {
    if (_.isEqual(original[key], updated[key])) continue;
    const fieldConfig = config.fields.find((field) => field.fieldname === key);
    if (!fieldConfig) {
      changes[key] = updated[key];
      continue;
    }

    switch (fieldConfig.fieldtype) {
      case "Table":
        changes[key] = getTableChanges(original[key], updated[key], config);
        break;
      case "File":
        changes[key] = getFileChanges(original[key], updated[key]);
        break;
      default:
        changes[key] = updated[key];
        break;
    }
  }
  return changes;
};

const getTableChanges = (original, updated, config) => {
  const changes = [];
  const originalItemsById = (original || []).reduce((acc, item) => {
    if (item.id) acc[item.id] = item;
    return acc;
  }, {});
  const updatedItemsById = (updated || []).reduce((acc, item) => {
    if (item.id) acc[item.id] = item;
    return acc;
  }, {});

  const currentIds = Object.keys(updatedItemsById);

  for (const item of updated) {
    if (item.id) {
      const originalItem = originalItemsById[item.id];
      if (!_.isEqual(originalItem, item)) {
        changes.push({
          id: item.id,
          ...getChanges(originalItem || {}, item, config),
        });
      }
    } else {
      changes.push(item);
    }
  }

  const deletedIds = Object.keys(originalItemsById).filter(
    (id) => !currentIds.includes(id)
  );
  deletedIds.forEach((id) => {
    if (!updated.some((item) => item.id === id)) {
      changes.push({ __deleted: true, id });
    }
  });

  return changes.length > 0 ? changes : null;
};

const getFileChanges = (original, updated) => {
  return original !== updated ? { from: original, to: updated } : null;
};

const getMultiSelectChanges = (original, updated) => {
  const added = _.difference(updated, original).map((item) => item.id);
  const removed = _.difference(original, updated).map((item) => item.id);
  return added.length || removed.length ? { added, removed } : null;
};
