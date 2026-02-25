import { Inter } from "next/font/google";
import PltWorkspaceRoute from "@/components/platform/workspaces/PltWorkspaceRoute";

const inter = Inter({ subsets: ["latin"] });

export default function PublisherDeploymentsPage() {
  return (
    <div className={inter.className}>
      <PltWorkspaceRoute configKey="publisher_deployments" />
    </div>
  );
}

