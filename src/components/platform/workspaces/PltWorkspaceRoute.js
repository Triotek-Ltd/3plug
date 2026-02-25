import PltWorkspaceScaffold from "@/components/platform/workspaces/PltWorkspaceScaffold";
import { PLT_WORKSPACE_CONFIGS } from "@/components/platform/workspaces/data";
import usePltPageChrome from "@/hooks/usePltPageChrome";
import usePltShellContext from "@/hooks/usePltShellContext";
import { useUiDirection } from "@/contexts/UiDirectionContext";
import { useMemo } from "react";

export default function PltWorkspaceRoute({ configKey }) {
  const config = PLT_WORKSPACE_CONFIGS[configKey];

  usePltPageChrome({
    pageLabel: config?.pageLabel || "Platform",
    dashboardLabel: config?.dashboardLabel || "Workspace",
  });

  const { shellContext, loading, error } = usePltShellContext();
  const { dir, toggleDir } = useUiDirection();
  const shellDir = shellContext?.shell?.ui?.dir || "ltr";
  const activeDir = dir || shellDir;
  const configMeta = useMemo(
    () => [
      ...(config?.meta || []),
      { label: "Direction", value: activeDir.toUpperCase() },
    ],
    [config?.meta, activeDir]
  );

  if (!config) {
    return (
      <div className="p-6 text-sm text-rose-700">
        Unknown PLT workspace config: {configKey}
      </div>
    );
  }

  return (
    <PltWorkspaceScaffold
      shellContext={shellContext}
      loading={loading}
      error={error}
      eyebrow={config.eyebrow}
      title={config.title}
      subtitle={config.subtitle}
      accent={config.accent}
      meta={configMeta}
      metrics={config.metrics || []}
      sections={config.sections || []}
      rightRail={config.rightRail || []}
      dirMode={activeDir}
      onToggleDir={toggleDir}
    />
  );
}
