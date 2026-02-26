import BuilderDeskSkeletonWorkspace from "@/components/workbench/BuilderDeskSkeletonWorkspace";

export default function ApiWorkbenchPage() {
  return (
    <BuilderDeskSkeletonWorkspace
      builderKey="integration_api_workbench"
      title="Integration / API Workbench"
      subtitle="Transmission validation workbench for GET/POST/actions across docs/apps/modules/submodules."
      nextLinks={[
        { label: "Integration / Webhook Builder", href: "/workbench/integration-builder" },
        { label: "Automation / Rule Builder", href: "/workbench/automation-builder" },
      ]}
    />
  );
}
