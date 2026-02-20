import { useNavbar } from "@/contexts/NavbarContext";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import ModuleDashboard from "@/components/workspace/ModuleDashboard";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function ModuleIndex() {
  const { updateDashboardText, updatePagesText, updateTextColor } = useNavbar();
  const { setSidebarHidden } = useSidebar();
  const router = useRouter();

  useEffect(() => {
    // Extract app and module names from the router path
    const currentPath = router.asPath.split("/").filter(Boolean);
    const modulename = currentPath.pop(); // Get the last segment as modulename
    const appname = currentPath.pop(); // Get the second last segment as appname

    if (appname && modulename) {
      // Update titles based on the app and module names
      updatePagesText(`${appname.charAt(0).toUpperCase() + appname.slice(1)}`);
      updateDashboardText(
        `${modulename.charAt(0).toUpperCase() + modulename.slice(1)}`
      );
      updateTextColor("text-gray-900");
      setSidebarHidden(false);
    }
  }, [router.asPath]); // Re-run the effect when router.asPath changes

  return (
    <>
      <ModuleDashboard />
    </>
  );
}
