import TextField from "@/components/fields/TextField";
import SelectField from "@/components/fields/SelectField";
import CheckField from "@/components/fields/CheckField";
import SecondaryButton from "@/components/core/common/buttons/Secondary";
import PrimaryButton from "@/components/core/common/buttons/Primary";

export default function DashboardWidgetsEditor({ widgets = [], onChange }) {
  const safeWidgets = Array.isArray(widgets) ? widgets : [];

  const updateRow = (index, patch) => {
    const next = safeWidgets.map((row, i) => (i === index ? { ...row, ...patch } : row));
    onChange?.(next);
  };

  const removeRow = (index) => onChange?.(safeWidgets.filter((_, i) => i !== index));
  const addRow = () =>
    onChange?.([
      ...safeWidgets,
      { id: `widget_${safeWidgets.length + 1}`, type: "chart", title: "", source_doc: "", source_key: "", width: 6, enabled: true },
    ]);

  return (
    <div className="space-y-3">
      <div className="max-h-[340px] overflow-auto rounded-xl border border-slate-200 bg-white p-2">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-2 py-2">ID</th>
              <th className="px-2 py-2">Type</th>
              <th className="px-2 py-2">Title</th>
              <th className="px-2 py-2">Source Doc</th>
              <th className="px-2 py-2">Source Key</th>
              <th className="px-2 py-2">Width</th>
              <th className="px-2 py-2">On</th>
              <th className="px-2 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {safeWidgets.map((widget, index) => (
              <tr key={`${widget.id || "widget"}-${index}`} className="border-t border-slate-100 align-top">
                <td className="px-2 py-2 min-w-[130px]">
                  <TextField value={widget.id || ""} onChange={(e) => updateRow(index, { id: e.target.value })} />
                </td>
                <td className="px-2 py-2 min-w-[140px]">
                  <SelectField
                    value={widget.type || "chart"}
                    onChange={(value) => updateRow(index, { type: value || "chart" })}
                    options={[
                      { label: "Chart", value: "chart" },
                      { label: "Table", value: "table" },
                      { label: "Metric", value: "metric" },
                      { label: "Text", value: "text" },
                    ]}
                  />
                </td>
                <td className="px-2 py-2 min-w-[180px]">
                  <TextField value={widget.title || ""} onChange={(e) => updateRow(index, { title: e.target.value })} />
                </td>
                <td className="px-2 py-2 min-w-[140px]">
                  <TextField value={widget.source_doc || ""} onChange={(e) => updateRow(index, { source_doc: e.target.value })} />
                </td>
                <td className="px-2 py-2 min-w-[140px]">
                  <TextField value={widget.source_key || ""} onChange={(e) => updateRow(index, { source_key: e.target.value })} />
                </td>
                <td className="px-2 py-2 min-w-[90px]">
                  <TextField type="number" value={String(widget.width ?? 6)} onChange={(e) => updateRow(index, { width: Number(e.target.value || 0) || 0 })} />
                </td>
                <td className="px-2 py-2">
                  <CheckField checked={Boolean(widget.enabled ?? true)} onChange={(e) => updateRow(index, { enabled: e.target.checked })} />
                </td>
                <td className="px-2 py-2">
                  <SecondaryButton text="Remove" onClick={() => removeRow(index)} className="!px-2 !py-1 !text-xs" />
                </td>
              </tr>
            ))}
            {!safeWidgets.length ? (
              <tr>
                <td colSpan={8} className="px-3 py-3 text-slate-600">
                  No widgets configured yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <PrimaryButton text="Add Widget" onClick={addRow} className="!px-3 !py-2 !text-xs" />
    </div>
  );
}
