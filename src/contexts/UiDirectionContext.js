import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const UiDirectionContext = createContext(null);

export function UiDirectionProvider({ children }) {
  const [dir, setDir] = useState("ltr");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("ui.direction");
    if (saved === "rtl" || saved === "ltr") {
      setDir(saved);
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("dir", dir);
    document.body?.setAttribute("dir", dir);
    try {
      window.localStorage.setItem("ui.direction", dir);
    } catch {}
  }, [dir]);

  const value = useMemo(
    () => ({
      dir,
      setDir,
      toggleDir: () => setDir((prev) => (prev === "ltr" ? "rtl" : "ltr")),
    }),
    [dir]
  );

  return (
    <UiDirectionContext.Provider value={value}>
      {children}
    </UiDirectionContext.Provider>
  );
}

export function useUiDirection() {
  const ctx = useContext(UiDirectionContext);
  if (!ctx) {
    return {
      dir: "ltr",
      setDir: () => {},
      toggleDir: () => {},
    };
  }
  return ctx;
}

