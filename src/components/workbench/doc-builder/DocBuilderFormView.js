import WorkspacePanel from "@/components/workspace/layout/WorkspacePanel";
import FieldRenderer from "@/components/pages/form/FieldRenderer";
import TextField from "@/components/fields/TextField";
import CheckField from "@/components/fields/CheckField";

export default function DocBuilderFormView({
  schemaFields,
  formPreviewValues,
  setFormPreviewValues,
  onSchemaFieldsChange,
}) {
  const editableFields = schemaFields.filter((field) => !String(field.fieldtype || "").includes("Break"));

  const updateFieldConfig = (fieldKey, patch) => {
    onSchemaFieldsChange?.((fields) =>
      fields.map((field) => {
        const key = field.fieldname || field.id;
        return key === fieldKey ? { ...field, ...patch } : field;
      })
    );
  };

  return (
    <WorkspacePanel
      title="Form Builder Preview"
      description="Preview and adjust field behavior using the existing form field renderer stack."
    >
      {editableFields.length ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="mb-2 text-xs uppercase tracking-[0.12em] text-slate-500">Field Properties (Schema)</div>
            <div className="max-h-[260px] overflow-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Field</th>
                    <th className="px-3 py-2">Label</th>
                    <th className="px-3 py-2">Placeholder</th>
                    <th className="px-3 py-2">Required</th>
                    <th className="px-3 py-2">Read Only</th>
                    <th className="px-3 py-2">Hidden</th>
                  </tr>
                </thead>
                <tbody>
                  {editableFields.slice(0, 20).map((field) => {
                    const key = field.fieldname || field.id;
                    return (
                      <tr key={key} className="border-t border-slate-100 align-top">
                        <td className="px-3 py-2 text-xs font-semibold text-slate-800">{key}</td>
                        <td className="px-3 py-2 min-w-[180px]">
                          <TextField
                            value={field.label || ""}
                            onChange={(e) => updateFieldConfig(key, { label: e.target.value })}
                            placeholder="Label"
                          />
                        </td>
                        <td className="px-3 py-2 min-w-[200px]">
                          <TextField
                            value={field.placeholder || ""}
                            onChange={(e) => updateFieldConfig(key, { placeholder: e.target.value })}
                            placeholder="Placeholder"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <CheckField
                            checked={Boolean(field.reqd)}
                            onChange={(e) => updateFieldConfig(key, { reqd: e.target.checked ? 1 : 0 })}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <CheckField
                            checked={Boolean(field.read_only)}
                            onChange={(e) => updateFieldConfig(key, { read_only: e.target.checked ? 1 : 0 })}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <CheckField
                            checked={Boolean(field.hidden)}
                            onChange={(e) => updateFieldConfig(key, { hidden: e.target.checked ? 1 : 0 })}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {editableFields.slice(0, 20).map((field) => {
              const key = field.fieldname || field.id;
              return (
                <div key={key} className="rounded-xl border border-slate-200 bg-white p-3">
                  <FieldRenderer
                    fieldtype={field.fieldtype || "Data"}
                    item={field}
                    value={formPreviewValues[key] ?? ""}
                    label={field.label || key}
                    handleInputChange={(item, value) => {
                      const itemKey = item.fieldname || item.id;
                      setFormPreviewValues((prev) => ({ ...prev, [itemKey]: value }));
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-sm text-slate-600">No schema fields available yet. Load native files first.</div>
      )}
    </WorkspacePanel>
  );
}
