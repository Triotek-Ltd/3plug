import BuilderDeskSkeletonWorkspace from "@/components/workbench/BuilderDeskSkeletonWorkspace";

export default function LocalizationBuilderDeskPage() {
  return (
    <BuilderDeskSkeletonWorkspace
      builderKey="localization_builder"
      title="Localization Builder Desk"
      subtitle="Manage translations, locale formats, and regional settings for native docs and ERP workspaces."
      nextLinks={[
        { label: "Navigation / Menu Builder", href: "/workbench/navigation-builder" },
        { label: "Theme / UI Token Builder", href: "/workbench/theme-builder" },
      ]}
    />
  );
}
