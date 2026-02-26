import BuilderDeskSkeletonWorkspace from "@/components/workbench/BuilderDeskSkeletonWorkspace";

export default function IntegrationBuilderDeskPage() {
  return (
    <BuilderDeskSkeletonWorkspace
      builderKey="integration_webhook_builder"
      title="Integration / Webhook Builder Desk"
      subtitle="Configure webhooks, integrations, endpoint mappings, and retry/event bindings."
      nextLinks={[
        { label: "Import / Export Mapping Builder", href: "/workbench/import-export-builder" },
        { label: "API Workbench", href: "/workbench/api-workbench" },
      ]}
    />
  );
}
