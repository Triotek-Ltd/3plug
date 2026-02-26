import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import WorkspaceShell from "@/components/workspace/layout/WorkspaceShell";
import WorkspaceHeader from "@/components/workspace/layout/WorkspaceHeader";
import WorkspacePanel from "@/components/workspace/layout/WorkspacePanel";
import RuntimeDocNavStrip from "@/components/erp/runtime/RuntimeDocNavStrip";
import FieldRenderer from "@/components/pages/form/FieldRenderer";
import PrimaryButton from "@/components/core/common/buttons/Primary";
import SecondaryButton from "@/components/core/common/buttons/Secondary";
import { postData, updateData } from "@/utils/Api";
import {
  buildInitialFormState,
  buildRuntimeUiConfig,
  getRenderableFormFields,
  loadDocDetailData,
  loadNativeDocFiles,
} from "@/utils/nativeDocRuntime";

export default function DocFormRuntimeWorkspace({ mode = "new" }) {
  const router = useRouter();
  const { bundle, app, module, submodule, doc, id } = router.query;
  const [nativeFiles, setNativeFiles] = useState(null);
  const [formState, setFormState] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const ready = Boolean(bundle && app && module && submodule && doc && (mode === "new" || id));
  const fields = useMemo(() => getRenderableFormFields(nativeFiles || {}), [nativeFiles]);
  const uiConfig = useMemo(
    () =>
      ready
        ? buildRuntimeUiConfig({ bundle, app, module, submodule, doc }, nativeFiles || {}, mode === "edit" ? "edit" : "new")
        : { dir: "ltr", title: "Doc Form", eyebrow: "ERP", subtitle: "", meta: [], navItems: [] },
    [ready, bundle, app, module, submodule, doc, nativeFiles, mode]
  );

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    setMessage("");

    (async () => {
      try {
        const hierarchy = { bundle, app, module, submodule, doc };
        const [files, row] = await Promise.all([
          loadNativeDocFiles(hierarchy),
          mode === "edit" ? loadDocDetailData(doc, id) : Promise.resolve(null),
        ]);
        if (cancelled) return;
        const nextFields = getRenderableFormFields(files || {});
        setNativeFiles(files);
        setFormState(buildInitialFormState(nextFields, row));
      } catch (err) {
        if (!cancelled) setError(err?.message || "Failed to load runtime form");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, bundle, app, module, submodule, doc, id, mode]);

  const handleInputChange = (item, value) => {
    const key = item?.fieldname || item?.id;
    if (!key) return;
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!doc) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const endpoint = mode === "edit" ? `${doc}/${id}` : doc;
      const response =
        mode === "edit" ? await updateData(formState, endpoint) : await postData(formState, endpoint);
      if (response?.error) throw new Error(response?.message || "Save failed");
      setMessage(mode === "edit" ? "Updated successfully." : "Created successfully.");
    } catch (err) {
      setError(err?.message || "Failed to save record");
    } finally {
      setSaving(false);
    }
  };

  return (
    <WorkspaceShell dir={uiConfig.dir}>
      <WorkspaceHeader
        dir={uiConfig.dir}
        eyebrow={uiConfig.eyebrow}
        title={uiConfig.title}
        subtitle={uiConfig.subtitle}
        meta={uiConfig.meta}
      />
      <WorkspacePanel
        title="Form"
        description={error || message || (loading ? "Loading form..." : "Runtime form generated from schema.json")}
      >
        <RuntimeDocNavStrip items={uiConfig.navItems} />
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {fields.map((field) => (
              <div key={field.fieldname} className="rounded-lg border border-slate-100 p-2">
                <FieldRenderer
                  fieldtype={field.fieldtype || field.type || "Data"}
                  item={field}
                  label={field.label || field.name || field.fieldname}
                  value={formState[field.fieldname] ?? ""}
                  handleInputChange={handleInputChange}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <PrimaryButton
              text={saving ? "Saving..." : mode === "edit" ? "Update" : "Create"}
              onClick={handleSave}
              disabled={saving || loading}
            />
            <SecondaryButton
              text="Reload"
              onClick={() => router.replace(router.asPath)}
              disabled={saving}
            />
          </div>
        </div>
      </WorkspacePanel>
    </WorkspaceShell>
  );
}
