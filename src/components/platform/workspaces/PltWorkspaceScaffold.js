import WorkspaceHeader from "@/components/workspace/layout/WorkspaceHeader";
import WorkspaceDirectionToggle from "@/components/workspace/layout/WorkspaceDirectionToggle";
import WorkspaceMetricRow from "@/components/workspace/layout/WorkspaceMetricRow";
import WorkspacePanel from "@/components/workspace/layout/WorkspacePanel";
import WorkspaceShell from "@/components/workspace/layout/WorkspaceShell";

export default function PltWorkspaceScaffold({
  shellContext,
  loading,
  error,
  eyebrow,
  title,
  subtitle,
  accent = "sky",
  meta = [],
  metrics = [],
  sections = [],
  rightRail = [],
  dirMode = "ltr",
  onToggleDir,
}) {
  const shell = shellContext?.shell || {};
  const ui = shell.ui || { dir: "ltr", locale: "en" };
  const activeDir = dirMode || ui.dir || "ltr";
  const isRtl = activeDir === "rtl";

  return (
    <>
      <WorkspaceShell dir={activeDir}>
        <WorkspaceHeader
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          accent={accent}
          meta={meta}
          dir={activeDir}
          actions={null}
        />

        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-200/80 bg-rose-50/90 p-4 text-sm text-rose-700 shadow-[0_12px_30px_-24px_rgba(225,29,72,0.45)]">
            {error}
          </div>
        ) : null}

        {metrics.length ? (
          <div className="mb-6">
            <WorkspaceMetricRow items={metrics} />
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className={`${rightRail.length ? "xl:col-span-8" : "xl:col-span-12"} space-y-6`}>
            {loading ? (
              <WorkspacePanel title="Loading" tone="glass">
                <div className="text-sm text-slate-500">Loading workspace...</div>
              </WorkspacePanel>
            ) : null}

            {sections.map((section) => (
              <WorkspacePanel key={section.id} title={section.title} tone={section.tone || "default"}>
                {section.content}
              </WorkspacePanel>
            ))}
          </div>

          {rightRail.length ? (
            <aside className={`space-y-6 xl:col-span-4 ${isRtl ? "xl:order-first" : ""}`}>
              {rightRail.map((panel) => (
                <WorkspacePanel key={panel.id} title={panel.title} tone={panel.tone || "glass"}>
                  {panel.content}
                </WorkspacePanel>
              ))}
            </aside>
          ) : null}
        </div>
      </WorkspaceShell>

      {onToggleDir ? (
        <div
          className={`fixed top-[42%] z-40 ${isRtl ? "left-2" : "right-2"}`}
          dir="ltr"
        >
          <div className="-rotate-90 origin-center">
            <WorkspaceDirectionToggle dir={activeDir} onToggle={onToggleDir} />
          </div>
        </div>
      ) : null}
    </>
  );
}
