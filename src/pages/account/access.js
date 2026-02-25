import { Inter } from "next/font/google";
import PltWorkspaceRoute from "@/components/platform/workspaces/PltWorkspaceRoute";

const inter = Inter({ subsets: ["latin"] });

export default function AccountAccessPage() {
  return (
    <div className={inter.className}>
      <PltWorkspaceRoute configKey="account_access" />
    </div>
  );
}

