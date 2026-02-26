import BuilderDeskSkeletonWorkspace from "@/components/workbench/BuilderDeskSkeletonWorkspace";

export default function QueryBuilderDeskPage() {
  return (
    <BuilderDeskSkeletonWorkspace
      builderKey="query_dataset_builder"
      title="Query / Dataset Builder Desk"
      subtitle="Define reusable datasets for reports, charts, and dashboards with grouping and aggregation rules."
      nextLinks={[
        { label: "Chart Builder", href: "/workbench/chart-builder" },
        { label: "Dashboard Builder", href: "/workbench/dashboard-builder" },
      ]}
    />
  );
}
