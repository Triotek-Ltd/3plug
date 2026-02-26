import BuilderDeskSkeletonWorkspace from "@/components/workbench/BuilderDeskSkeletonWorkspace";

export default function ThemeBuilderDeskPage() {
  return (
    <BuilderDeskSkeletonWorkspace
      builderKey="theme_ui_token_builder"
      title="Theme / UI Token Builder Desk"
      subtitle="Define branding, typography, spacing, and UI token values for builder/runtime consistency."
      nextLinks={[
        { label: "Page Builder", href: "/workbench/page-builder" },
        { label: "Workspace / Desk Builder", href: "/workbench/workspace-builder" },
      ]}
    />
  );
}
