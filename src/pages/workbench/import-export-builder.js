import BuilderDeskSkeletonWorkspace from "@/components/workbench/BuilderDeskSkeletonWorkspace";

export default function ImportExportBuilderDeskPage() {
  return (
    <BuilderDeskSkeletonWorkspace
      builderKey="import_export_mapping_builder"
      title="Import / Export Mapping Builder Desk"
      subtitle="Define CSV/Excel/API field mappings for bulk import/export against native docs."
      nextLinks={[
        { label: "Integration / Webhook Builder", href: "/workbench/integration-builder" },
        { label: "Query / Dataset Builder", href: "/workbench/query-builder" },
      ]}
    />
  );
}
