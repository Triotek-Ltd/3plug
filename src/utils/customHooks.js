// utils/customHooks.js
const applyLifecycleHooks = (form, lifecycleHooks) => {
  if (lifecycleHooks?.onLoad) {
    lifecycleHooks.onLoad(form);
  }

  const beforeSave = (data) => {
    if (lifecycleHooks?.beforeSave) {
      return lifecycleHooks.beforeSave(data);
    }
    return data;
  };

  const afterSave = (data) => {
    if (lifecycleHooks?.afterSave) {
      lifecycleHooks.afterSave(data);
    }
  };

  const onFieldChange = (fieldname, value) => {
    if (lifecycleHooks?.onFieldChange) {
      lifecycleHooks.onFieldChange(fieldname, value);
    }
  };

  return { beforeSave, afterSave, onFieldChange };
};

export { applyLifecycleHooks };
