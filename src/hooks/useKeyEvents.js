import { useEffect } from "react";
import { useRouter } from "next/router";

const useKeyEvents = (printCallback, saveCallback, duplicateCallback) => {
  const router = useRouter();

  useEffect(() => {
    const logKeyPress = (event) => {
      if (event.ctrlKey && event.key === "b") {
        event.preventDefault();
        handleCtrlB();
      } else if (event.ctrlKey && event.key === "p") {
        event.preventDefault();
        handleCtrlP();
      } else if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        handleCtrlS();
      } else if (event.ctrlKey && event.key === "d") {
        event.preventDefault();
        handleCtrlD();
      } else if (event.ctrlKey && event.key === "z") {
        event.preventDefault();
        handleCtrlZ();
      } else if (event.ctrlKey && event.key === "y") {
        event.preventDefault();
        handleCtrlY();
      }
    };

    const handleCtrlB = () => {
      const { query, pathname } = router;
      const hasIdOrSlug = query.id || query.slug;

      let newPath;

      if (hasIdOrSlug) {
        // If slug or id exists, replace the last segment of the path with "/new"
        newPath = pathname.replace(/\/[^\/]+$/, `/new`);
      } else {
        // Otherwise, append "/new" to the current path
        newPath = pathname + "/new";
      }

      // Ensure the query (id or slug) is included in the new path if available
      if (hasIdOrSlug) {
        newPath =
          newPath + (query.slug ? `?slug=${query.slug}` : `?id=${query.id}`);
      }

      router.push(newPath);
    };

    const handleCtrlP = () => {
      if (typeof printCallback === "function") {
        printCallback();
      }
    };

    const handleCtrlS = () => {
      if (typeof saveCallback === "function") {
        saveCallback();
      }
    };

    const handleCtrlD = () => {
      if (typeof duplicateCallback === "function") {
        duplicateCallback();
      }
    };

    const handleCtrlZ = () => {};

    const handleCtrlY = () => {};

    window.addEventListener("keydown", logKeyPress);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("keydown", logKeyPress);
    };
  }, [router, printCallback, saveCallback, duplicateCallback]);

  return null; // Custom hooks do not return JSX
};

export default useKeyEvents;
