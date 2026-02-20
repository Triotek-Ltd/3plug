import { useEffect } from "react";
import { useNavbar } from "@/contexts/NavbarContext";
import { useSidebar } from "@/contexts/SidebarContext";

export default function Custom404() {
  const { updateDashboardText, updatePagesText, updateTextColor } = useNavbar();
  const { setSidebarHidden } = useSidebar();

  useEffect(() => {
    updateDashboardText("404");
    updatePagesText("Page Not Found");
    updateTextColor("text-slate-500");
    setSidebarHidden(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-slate-500 via-blue-500 to-purple-500 text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-8">Oops! The page you’re looking for doesn’t exist.</p>
      <button
        onClick={() => window.location.href = '/'}
        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium transition-all duration-300 shadow-lg hover:shadow-2xl"
      >
        Take me home
      </button>
    </div>
  );
}
