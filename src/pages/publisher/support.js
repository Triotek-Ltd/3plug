import { Inter } from "next/font/google";
import PltWorkspaceRoute from "@/components/platform/workspaces/PltWorkspaceRoute";

const inter = Inter({ subsets: ["latin"] });

export default function PublisherSupportPage() {
  return (
    <div className={inter.className}>
      <PltWorkspaceRoute configKey="publisher_support" />
    </div>
  );
}

