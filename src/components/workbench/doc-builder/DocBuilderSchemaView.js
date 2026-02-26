import WorkspacePanel from "@/components/workspace/layout/WorkspacePanel";
import DocStudio from "@/components/studio/doctype/DocStudio";

export default function DocBuilderSchemaView({ selectedDocKey, studioConfig, onSchemaSave }) {
  return (
    <WorkspacePanel
      title="Schema Builder (Drag / Drop)"
      description={
        selectedDocKey
          ? "Using the existing studio/doctype builder stack for the selected doc."
          : "Select a doc first to open the schema builder."
      }
    >
      {selectedDocKey ? (
        <DocStudio
          config={studioConfig}
          handleSave={(updatedConfig) => {
            onSchemaSave?.(updatedConfig);
          }}
        />
      ) : (
        <div className="text-sm text-slate-600">
          Select a doc from the table, then switch to Schema Builder to use the drag-and-drop studio.
        </div>
      )}
    </WorkspacePanel>
  );
}
