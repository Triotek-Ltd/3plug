import { resolvePltShellContext } from "@/utils/platformResolver";
import { useEffect, useState } from "react";

export default function usePltShellContext(options = {}) {
  const [shellContext, setShellContext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      const result = await resolvePltShellContext(options);
      if (!mounted) return;
      setShellContext(result);
      if (!result?.session || !result?.catalog || !result?.workspaces) {
        setError("PLT shell endpoints unavailable or returned invalid data.");
      }
      setLoading(false);
    };
    load();
    return () => {
      mounted = false;
    };
  }, [JSON.stringify(options)]);

  return { shellContext, loading, error };
}

