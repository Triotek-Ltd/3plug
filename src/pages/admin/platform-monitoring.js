import { Inter } from "next/font/google";
import PltWorkspaceRoute from "@/components/platform/workspaces/PltWorkspaceRoute";

const inter = Inter({ subsets: ["latin"] });

export default function AdminPlatformMonitoringPage() {
  return (
    <div className={inter.className}>
      <PltWorkspaceRoute configKey="admin_platform_monitoring" />
    </div>
  );
}

