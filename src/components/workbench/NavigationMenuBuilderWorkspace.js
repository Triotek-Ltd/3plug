import WorkspacePanel from "@/components/workspace/layout/WorkspacePanel";
import TextField from "@/components/fields/TextField";
import SelectField from "@/components/fields/SelectField";
import CheckField from "@/components/fields/CheckField";
import SecondaryButton from "@/components/core/common/buttons/Secondary";
import PrimaryButton from "@/components/core/common/buttons/Primary";
import DocScopedBuilderDeskFrame from "@/components/workbench/DocScopedBuilderDeskFrame";
import useDocBuilderDeskState from "@/components/workbench/doc-builder/useDocBuilderDeskState";

const STANDARD_RUNTIME_NAV_ITEMS = [
  { label: "List", link: "./list", target: "sidebar", role: "", enabled: true },
  { label: "Report", link: "./report", target: "sidebar", role: "", enabled: true },
  { label: "New", link: "./new", target: "quick_action", role: "", enabled: true },
];

function NavItemsEditor({ items = [], onChange }) {
  const safe = Array.isArray(items) ? items : [];
  const updateItem = (i, patch) => onChange?.(safe.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  const removeItem = (i) => onChange?.(safe.filter((_, idx) => idx !== i));
  const addItem = () =>
    onChange?.([...safe, { label: "", link: "", target: "sidebar", role: "", enabled: true }]);

  return (
    <div className="space-y-3">
      <div className="max-h-[340px] overflow-auto rounded-xl border border-slate-200 bg-white p-2">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-2 py-2">Label</th>
              <th className="px-2 py-2">Link</th>
              <th className="px-2 py-2">Target</th>
              <th className="px-2 py-2">Role</th>
              <th className="px-2 py-2">On</th>
              <th className="px-2 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {safe.map((item, idx) => (
              <tr key={`${item.label || "nav"}-${idx}`} className="border-t border-slate-100 align-top">
                <td className="px-2 py-2 min-w-[160px]"><TextField value={item.label || ""} onChange={(e) => updateItem(idx, { label: e.target.value })} /></td>
                <td className="px-2 py-2 min-w-[220px]"><TextField value={item.link || ""} onChange={(e) => updateItem(idx, { link: e.target.value })} /></td>
                <td className="px-2 py-2 min-w-[140px]">
                  <SelectField
                    value={item.target || "sidebar"}
                    onChange={(value) => updateItem(idx, { target: value || "sidebar" })}
                    options={[
                      { label: "Sidebar", value: "sidebar" },
                      { label: "Top Nav", value: "top_nav" },
                      { label: "Quick Action", value: "quick_action" },
                    ]}
                  />
                </td>
                <td className="px-2 py-2 min-w-[140px]"><TextField value={item.role || ""} onChange={(e) => updateItem(idx, { role: e.target.value })} /></td>
                <td className="px-2 py-2"><CheckField checked={Boolean(item.enabled ?? true)} onChange={(e) => updateItem(idx, { enabled: e.target.checked })} /></td>
                <td className="px-2 py-2"><SecondaryButton text="Remove" onClick={() => removeItem(idx)} className="!px-2 !py-1 !text-xs" /></td>
              </tr>
            ))}
            {!safe.length ? <tr><td colSpan={6} className="px-3 py-3 text-slate-600">No navigation items configured yet.</td></tr> : null}
          </tbody>
        </table>
      </div>
      <PrimaryButton text="Add Navigation Item" onClick={addItem} className="!px-3 !py-2 !text-xs" />
    </div>
  );
}

export default function NavigationMenuBuilderWorkspace() {
  const state = useDocBuilderDeskState();
  const { nativeDocFiles, updateNativeDoc } = state;
  const navConfig = nativeDocFiles?.doc?.navigation || {};

  const setNavPatch = (patch) =>
    updateNativeDoc((doc) => ({
      ...doc,
      navigation: {
        ...(doc.navigation || {}),
        ...patch,
      },
    }));

  const addRuntimeNavDefaults = () => {
    const current = Array.isArray(navConfig.items) ? navConfig.items : [];
    const keys = new Set(current.map((item) => `${item.label}|${item.link}`));
    const merged = [...current];
    STANDARD_RUNTIME_NAV_ITEMS.forEach((item) => {
      const key = `${item.label}|${item.link}`;
      if (!keys.has(key)) merged.push(item);
    });
    setNavPatch({ items: merged });
  };

  return (
    <DocScopedBuilderDeskFrame
      title="Navigation / Menu Builder"
      subtitle="Configure sidebar/top-nav/menu items for native docs and desk contexts."
      deskLabel="Navigation / Menu Builder"
      state={state}
    >
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <WorkspacePanel title="Navigation Items" description="Stored in `doc.json.navigation.items`.">
            <div className="mb-3 flex items-center justify-end">
              <SecondaryButton
                text="Add Runtime Nav Defaults"
                onClick={addRuntimeNavDefaults}
                className="!px-3 !py-2 !text-xs"
              />
            </div>
            <NavItemsEditor items={navConfig.items || []} onChange={(items) => setNavPatch({ items })} />
          </WorkspacePanel>
        </div>
        <div className="xl:col-span-4">
          <WorkspacePanel title="Navigation Config Preview (JSON)" description="Live preview of `doc.json.navigation`.">
            <pre className="max-h-[420px] overflow-auto rounded-lg bg-slate-950 p-3 text-[11px] leading-5 text-slate-100">
              {JSON.stringify(navConfig, null, 2)}
            </pre>
          </WorkspacePanel>
        </div>
      </div>
    </DocScopedBuilderDeskFrame>
  );
}
