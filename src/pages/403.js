import { useNavbar } from "@/contexts/NavbarContext";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import ForbiddenModal from "@/components/core/common/modal/Forbidden";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { updateDashboardText, updatePagesText, updateTextColor } = useNavbar();
  const { setSidebarHidden } = useSidebar();

  useEffect(() => {
    updateDashboardText("403");
    updatePagesText("Home");
    updateTextColor("text-gray-900");
    setSidebarHidden(false);
  }, []);
  return (
    <div className="flex flex-col items-center w-full py-20">
      <h2 className="text-3xl font-semibold mb-4 text-red-600">
        Forbidden Error
      </h2>
      <p className="mb-6 text-lg">
        You don&apos;t have permission to access this resource.
      </p>

      {/* Confirmation Buttons */}
      <div className="flex justify-center space-x-4">
        {/* Link to Home using Next.js Link */}
        <div className="">
          <Link href="/">
            <div className="text-fuchsia-500 hover:underline text-lg font-semibold">
              Go back to Home
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
