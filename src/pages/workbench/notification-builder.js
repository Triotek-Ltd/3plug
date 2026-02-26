import BuilderDeskSkeletonWorkspace from "@/components/workbench/BuilderDeskSkeletonWorkspace";

export default function NotificationBuilderDeskPage() {
  return (
    <BuilderDeskSkeletonWorkspace
      builderKey="notification_alert_builder"
      title="Notification / Alert Builder Desk"
      subtitle="Define alert triggers, templates, channels, and routing linked to native docs and actions."
      nextLinks={[
        { label: "Automation / Rule Builder", href: "/workbench/automation-builder" },
        { label: "Workflow / Approval Builder", href: "/workbench/workflow-builder" },
      ]}
    />
  );
}
