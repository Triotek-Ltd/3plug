import BuilderDeskSkeletonWorkspace from "@/components/workbench/BuilderDeskSkeletonWorkspace";

export default function AutomationBuilderDeskPage() {
  return (
    <BuilderDeskSkeletonWorkspace
      builderKey="automation_rule_builder"
      title="Automation / Rule Builder Desk"
      subtitle="Define event-condition-action rules for native docs, actions, and workflow transitions."
      nextLinks={[
        { label: "Workflow / Approval Builder", href: "/workbench/workflow-builder" },
        { label: "Actions / Permissions Builder", href: "/workbench/actions-builder" },
        { label: "Notification / Alert Builder", href: "/workbench/notification-builder" },
      ]}
    />
  );
}
