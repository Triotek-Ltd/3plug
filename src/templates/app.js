import { useNavbar } from "@/contexts/NavbarContext";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
// import AppDashboard from "@/components/workspace/AppDashboard";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

// Helper function to convert a string to Titlecase
const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function AppIndex() {
  const { updateDashboardText, updatePagesText, updateTextColor } = useNavbar();
  const { setSidebarHidden } = useSidebar();
  const router = useRouter();
  useEffect(() => {
    // Update the dashboard text and text color
    updatePagesText("Home");
    updateTextColor("text-gray-900");
    setSidebarHidden(false);

    // Get the last part of the URL path and update the page text
    const pathSegments = router.asPath.split("/").filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    const titleCaseText = toTitleCase(lastSegment);

    updateDashboardText(titleCaseText);
  }, []); // Add router.asPath as a dependency to trigger effect on route change

  return <>{/* <AppDashboard /> */}</>;
}
