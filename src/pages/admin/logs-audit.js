import { Inter } from "next/font/google";
import PltWorkspaceRoute from "@/components/platform/workspaces/PltWorkspaceRoute";

const inter = Inter({ subsets: ["latin"] });

export default function AdminLogsAuditPage() {
  return (
    <div className={inter.className}>
      <PltWorkspaceRoute configKey="admin_logs_audit" />
    </div>
  );
}

