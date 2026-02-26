import TextField from "@/components/fields/TextField";
import SelectField from "@/components/fields/SelectField";
import CheckField from "@/components/fields/CheckField";
import PrimaryButton from "@/components/core/common/buttons/Primary";
import SecondaryButton from "@/components/core/common/buttons/Secondary";

const METHOD_OPTIONS = [
  { label: "POST", value: "POST" },
  { label: "GET", value: "GET" },
  { label: "PUT", value: "PUT" },
  { label: "PATCH", value: "PATCH" },
  { label: "DELETE", value: "DELETE" },
];

const ACTION_KIND_OPTIONS = [
  { label: "Server Action", value: "server" },
  { label: "Workflow Action", value: "workflow" },
  { label: "UI Action", value: "ui" },
];

const STANDARD_RUNTIME_ACTIONS = [
  { id: "list", label: "List", method: "GET", kind: "ui", enabled: true },
  { id: "view", label: "View", method: "GET", kind: "ui", enabled: true },
  { id: "new", label: "New", method: "GET", kind: "ui", enabled: true },
  { id: "create", label: "Create", method: "POST", kind: "server", enabled: true },
  { id: "edit", label: "Edit", method: "GET", kind: "ui", enabled: true },
  { id: "update", label: "Update", method: "PATCH", kind: "server", enabled: true },
  { id: "delete", label: "Delete", method: "DELETE", kind: "server", enabled: true },
];

function normalizeAction(action = {}, index = 0) {
  return {
    id: action.id || `action_${index + 1}`,
    label: action.label || action.id || `Action ${index + 1}`,
    method: action.method || "POST",
    kind: action.kind || "server",
    enabled: action.enabled !== false,
    precondition: action.precondition || "",
    next_state: action.next_state || "",
  };
}

export default function DocBuilderActionsListEditor({ actions = [], onChange }) {
  const rows = Array.isArray(actions) ? actions.map(normalizeAction) : [];

  const updateRow = (index, patch) => {
    onChange?.(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const addRow = () => {
    onChange?.([...rows, normalizeAction({}, rows.length)]);
  };

  const removeRow = (index) => {
    onChange?.(rows.filter((_, i) => i !== index));
  };

  const mergeStandardRuntimeActions = () => {
    const byId = new Map(rows.map((row, index) => [String(row.id || "").trim() || `row_${index}`, row]));
    STANDARD_RUNTIME_ACTIONS.forEach((preset, index) => {
      const key = preset.id;
      if (!byId.has(key)) {
        byId.set(key, normalizeAction(preset, rows.length + index));
      }
    });
    onChange?.(Array.from(byId.values()));
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Actions List</div>
        <div className="flex items-center gap-2">
          <SecondaryButton
            text="Add Runtime Defaults"
            onClick={mergeStandardRuntimeActions}
            className="!px-3 !py-2 !text-xs"
          />
          <PrimaryButton text="Add Action" onClick={addRow} className="!px-3 !py-2 !text-xs" />
        </div>
      </div>

      <div className="max-h-[360px] overflow-auto space-y-3">
        {rows.map((row, index) => (
          <div key={`${row.id}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              <TextField
                label="Action ID"
                value={row.id}
                onChange={(e) => updateRow(index, { id: e.target.value })}
                placeholder="submit"
              />
              <TextField
                label="Label"
                value={row.label}
                onChange={(e) => updateRow(index, { label: e.target.value })}
                placeholder="Submit"
              />
              <SelectField
                label="Method"
                value={row.method}
                onChange={(value) => updateRow(index, { method: value })}
                options={METHOD_OPTIONS}
              />
              <SelectField
                label="Kind"
                value={row.kind}
                onChange={(value) => updateRow(index, { kind: value })}
                options={ACTION_KIND_OPTIONS}
              />
              <TextField
                label="Precondition"
                value={row.precondition}
                onChange={(e) => updateRow(index, { precondition: e.target.value })}
                placeholder="docstatus == 0"
              />
              <TextField
                label="Next State"
                value={row.next_state}
                onChange={(e) => updateRow(index, { next_state: e.target.value })}
                placeholder="approved"
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-slate-700">
                <CheckField
                  checked={Boolean(row.enabled)}
                  onChange={(e) => updateRow(index, { enabled: e.target.checked })}
                />
                Enabled
              </label>
              <SecondaryButton
                text="Remove"
                onClick={() => removeRow(index)}
                className="!px-3 !py-2 !text-xs"
              />
            </div>
          </div>
        ))}
        {!rows.length ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-4 text-sm text-slate-600">
            No actions yet. Add runtime defaults first, then customize additional actions in `actions.json`.
          </div>
        ) : null}
      </div>
    </div>
  );
}
