import { useNavbar } from "@/contexts/NavbarContext";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import { useRouter } from "next/router";
import Dashboard from "@/components/workspace/Dashboard";

const inter = Inter({ subsets: ["latin"] });

export default function HomeDesk() {
  const { updateDashboardText, updatePagesText, updateTextColor } = useNavbar();
  const { setSidebarHidden } = useSidebar();
  const router = useRouter();

  useEffect(() => {
    const currentPath = router.asPath.split("/").filter(Boolean);
    const modulename = currentPath.pop() || "home";
    const appname = currentPath.pop() || "portal";

    updatePagesText(`${appname.charAt(0).toUpperCase() + appname.slice(1)}`);
    updateDashboardText(
      `${modulename.charAt(0).toUpperCase() + modulename.slice(1)}`
    );
    updateTextColor("text-gray-900");
    setSidebarHidden(false);
  }, [router.asPath, setSidebarHidden, updateDashboardText, updatePagesText, updateTextColor]);

  return <Dashboard className={inter.className} />;
}
