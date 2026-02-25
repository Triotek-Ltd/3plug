import { Inter } from "next/font/google";
import PltWorkspaceRoute from "@/components/platform/workspaces/PltWorkspaceRoute";

const inter = Inter({ subsets: ["latin"] });

export default function AdminLandingAnalyticsPage() {
  return (
    <div className={inter.className}>
      <PltWorkspaceRoute configKey="admin_landing_analytics" />
    </div>
  );
}

