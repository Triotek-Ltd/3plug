import { useEffect, useMemo, useState } from "react";

export default function useDocBuilderNativeFilesState({
  selectedDocKey,
  selectedBundleValue,
  selectedAppValue,
  selectedModuleValue,
  selectedSubmoduleValue,
  selectedDocMeta,
  selectedDocRow,
}) {
  const [nativeDocFilesLoading, setNativeDocFilesLoading] = useState(false);
  const [nativeDocFilesError, setNativeDocFilesError] = useState("");
  const [nativeDocFilesStatus, setNativeDocFilesStatus] = useState("");
  const [nativeDocFiles, setNativeDocFiles] = useState({ doc: {}, schema: {}, actions: {} });
  const [formPreviewValues, setFormPreviewValues] = useState({});

  const loadNativeDocFiles = async () => {
    if (!selectedDocKey || !selectedModuleValue || !selectedSubmoduleValue) return;
    setNativeDocFilesLoading(true);
    setNativeDocFilesError("");
    setNativeDocFilesStatus("");
    try {
      const params = new URLSearchParams({
        bundle: selectedBundleValue,
        app: selectedAppValue,
        module: selectedModuleValue,
        submodule: selectedSubmoduleValue,
        doc_key: selectedDocKey,
      });
      const response = await fetch(`/api/native-doc-files?${params.toString()}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Failed to load native doc files");
      setNativeDocFiles({ doc: payload.doc || {}, schema: payload.schema || {}, actions: payload.actions || {} });
      const fields = Array.isArray(payload.schema?.fields) ? payload.schema.fields : [];
      setFormPreviewValues((prev) => {
        const next = { ...prev };
        fields.forEach((f) => {
          const key = f.fieldname || f.id;
          if (key && !(key in next)) next[key] = f.default || "";
        });
        return next;
      });
      setNativeDocFilesStatus("Native doc files loaded.");
    } catch (e) {
      setNativeDocFilesError(e?.message || "Failed to load native doc files");
    } finally {
      setNativeDocFilesLoading(false);
    }
  };

  const saveNativeDocFiles = async (overrideFiles = null) => {
    if (!selectedDocKey || !selectedModuleValue || !selectedSubmoduleValue) return false;
    setNativeDocFilesLoading(true);
    setNativeDocFilesError("");
    setNativeDocFilesStatus("");
    try {
      const filesToSave = overrideFiles || nativeDocFiles;
      const response = await fetch("/api/native-doc-files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bundle: selectedBundleValue,
          app: selectedAppValue,
          module: selectedModuleValue,
          submodule: selectedSubmoduleValue,
          docKey: selectedDocKey,
          doc: filesToSave.doc,
          schema: filesToSave.schema,
          actions: filesToSave.actions,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Failed to save native doc files");
      setNativeDocFilesStatus("Native doc files saved.");
      return true;
    } catch (e) {
      setNativeDocFilesError(e?.message || "Failed to save native doc files");
      return false;
    } finally {
      setNativeDocFilesLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDocKey) loadNativeDocFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDocKey, selectedModuleValue, selectedSubmoduleValue, selectedAppValue, selectedBundleValue]);

  const studioConfig = useMemo(
    () => ({
      name: selectedDocMeta?.doc_key || selectedDocRow?.doc_key || "Select a doc",
      schema: nativeDocFiles.schema?.fields ? nativeDocFiles.schema : selectedDocMeta?.schema || { fields: [] },
      actions: nativeDocFiles.actions?.actions || selectedDocMeta?.allowed_actions || [],
    }),
    [selectedDocMeta, selectedDocRow, nativeDocFiles]
  );

  const schemaFields = useMemo(
    () =>
      Array.isArray(nativeDocFiles.schema?.fields)
        ? nativeDocFiles.schema.fields
        : Array.isArray(selectedDocMeta?.schema?.fields)
        ? selectedDocMeta.schema.fields
        : [],
    [nativeDocFiles.schema, selectedDocMeta]
  );

  const listPreviewTableConfig = useMemo(
    () => ({
      name: "Doc Rows Preview",
      quick_entry: false,
      fields: [
        { fieldname: "id", label: "ID", fieldtype: "Data", in_list_view: 1 },
        ...schemaFields
          .filter((f) => !(f.fieldtype || "").includes("Break"))
          .slice(0, 8)
          .map((f) => ({
            fieldname: f.fieldname || f.id,
            label: f.label || f.fieldname || f.id,
            fieldtype: f.fieldtype || "Data",
            in_list_view: 1,
            in_standard_filter: 0,
          })),
      ],
    }),
    [schemaFields]
  );

  const listPreviewRows = useMemo(() => {
    const row = { id: "sample-1" };
    schemaFields.forEach((f) => {
      const key = f.fieldname || f.id;
      if (key) row[key] = formPreviewValues[key] ?? f.default ?? "";
    });
    return [row];
  }, [schemaFields, formPreviewValues]);

  const updateNativeActions = (updater) =>
    setNativeDocFiles((prev) => ({
      ...prev,
      actions: typeof updater === "function" ? updater(prev.actions || {}) : updater,
    }));

  const updateNativeDoc = (updater) =>
    setNativeDocFiles((prev) => ({
      ...prev,
      doc: typeof updater === "function" ? updater(prev.doc || {}) : updater,
    }));

  const updateNativeSchemaFields = (updater) =>
    setNativeDocFiles((prev) => {
      const currentFields = Array.isArray(prev.schema?.fields) ? prev.schema.fields : [];
      const nextFields = typeof updater === "function" ? updater(currentFields) : updater;
      return {
        ...prev,
        schema: {
          ...(prev.schema || {}),
          fields: Array.isArray(nextFields) ? nextFields : currentFields,
        },
      };
    });

  const applyStudioSchemaConfig = (updatedConfig) => {
    const normalized = updatedConfig || {};
    setNativeDocFiles((prev) => ({
      ...prev,
      schema: {
        ...(prev.schema || {}),
        ...normalized,
        fields: Array.isArray(normalized.fields) ? normalized.fields : prev.schema?.fields || [],
      },
    }));
    if (Array.isArray(normalized.fields)) {
      setFormPreviewValues((prev) => {
        const next = { ...prev };
        normalized.fields.forEach((f) => {
          const key = f.fieldname || f.id;
          if (!key) return;
          if (!(key in next)) next[key] = f.default || "";
        });
        return next;
      });
    }
  };

  return {
    nativeDocFilesLoading,
    nativeDocFilesError,
    nativeDocFilesStatus,
    nativeDocFiles,
    formPreviewValues,
    setFormPreviewValues,
    studioConfig,
    schemaFields,
    listPreviewTableConfig,
    listPreviewRows,
    updateNativeActions,
    updateNativeDoc,
    updateNativeSchemaFields,
    applyStudioSchemaConfig,
    loadNativeDocFiles,
    saveNativeDocFiles,
  };
}
