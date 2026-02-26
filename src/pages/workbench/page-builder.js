import BuilderDeskSkeletonWorkspace from "@/components/workbench/BuilderDeskSkeletonWorkspace";

export default function PageBuilderDeskPage() {
  return (
    <BuilderDeskSkeletonWorkspace
      builderKey="page_builder"
      title="Page Builder Desk"
      subtitle="Dedicated page builder desk skeleton for ERP pages/workspaces composed from existing templates and sections."
      nextLinks={[
        { label: "Dashboard Builder", href: "/workbench/dashboard-builder" },
        { label: "Doc Builder Desk", href: "/workbench/doc-builder" },
      ]}
    />
  );
}
