import WorkspacePanel from "@/components/workspace/layout/WorkspacePanel";
import TableTemplate from "@/components/pages/list/TableTemplate";
import CheckField from "@/components/fields/CheckField";
import SelectField from "@/components/fields/SelectField";
import TextField from "@/components/fields/TextField";

export default function DocBuilderListReportView({
  listPreviewTableConfig,
  listPreviewRows,
  schemaFields = [],
  nativeDocFiles,
  onSchemaFieldsChange,
  onDocConfigChange,
}) {
  const listConfig = nativeDocFiles?.doc?.list_report || {};
  const sortFieldOptions = [
    { label: "None", value: "" },
    ...schemaFields
      .filter((f) => !String(f.fieldtype || "").includes("Break"))
      .map((f) => ({ label: f.label || f.fieldname || f.id, value: f.fieldname || f.id })),
  ];

  const updateFieldFlag = (fieldKey, patch) => {
    onSchemaFieldsChange?.((fields) =>
      fields.map((field) => {
        const key = field.fieldname || field.id;
        return key === fieldKey ? { ...field, ...patch } : field;
      })
    );
  };

  return (
    <WorkspacePanel
      title="List / Report Builder"
      description="Edit list/report flags and preview using the existing list table stack driven by the selected doc schema."
    >
      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <SelectField
            label="Default Sort Field"
            value={listConfig.sort_field || ""}
            onChange={(value) =>
              onDocConfigChange?.((doc) => ({
                ...doc,
                list_report: {
                  ...(doc.list_report || {}),
                  sort_field: value || "",
                },
              }))
            }
            options={sortFieldOptions}
          />
          <SelectField
            label="Sort Order"
            value={listConfig.sort_order || "desc"}
            onChange={(value) =>
              onDocConfigChange?.((doc) => ({
                ...doc,
                list_report: {
                  ...(doc.list_report || {}),
                  sort_order: value || "desc",
                },
              }))
            }
            options={[
              { label: "Descending", value: "desc" },
              { label: "Ascending", value: "asc" },
            ]}
          />
          <TextField
            label="Report Group By"
            value={listConfig.group_by || ""}
            onChange={(e) =>
              onDocConfigChange?.((doc) => ({
                ...doc,
                list_report: {
                  ...(doc.list_report || {}),
                  group_by: e.target.value,
                },
              }))
            }
            placeholder="fieldname"
          />
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3">
        <div className="mb-2 text-xs uppercase tracking-[0.12em] text-slate-500">Field Flags</div>
        <div className="max-h-[240px] overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-3 py-2">Field</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">List</th>
                <th className="px-3 py-2">Filter</th>
              </tr>
            </thead>
            <tbody>
              {schemaFields
                .filter((f) => !String(f.fieldtype || "").includes("Break"))
                .map((field) => {
                  const key = field.fieldname || field.id;
                  return (
                    <tr key={key} className="border-t border-slate-100">
                      <td className="px-3 py-2 font-medium text-slate-800">{field.label || key}</td>
                      <td className="px-3 py-2 text-slate-600">{field.fieldtype || "Data"}</td>
                      <td className="px-3 py-2">
                        <CheckField
                          checked={Boolean(field.in_list_view)}
                          onChange={(e) => updateFieldFlag(key, { in_list_view: e.target.checked ? 1 : 0 })}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <CheckField
                          checked={Boolean(field.in_standard_filter)}
                          onChange={(e) => updateFieldFlag(key, { in_standard_filter: e.target.checked ? 1 : 0 })}
                        />
                      </td>
                    </tr>
                  );
                })}
              {!schemaFields.length ? (
                <tr>
                  <td colSpan={4} className="px-3 py-3 text-slate-600">
                    No schema fields available yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <TableTemplate
          tableConfig={listPreviewTableConfig}
          data={listPreviewRows}
          filters={{}}
          activeFilters={{}}
          handleFilterChange={() => {}}
          handleClearFilters={() => {}}
          applyFilters={() => {}}
          refresh={() => {}}
        />
      </div>
    </WorkspacePanel>
  );
}
