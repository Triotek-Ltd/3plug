import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/core/common/sidebar/Sidebar";
import "@/styles/globals.css";
import Navbar from "@/components/core/common/navbar/Navbar";
import Footer from "@/components/core/common/Footer";
import useKeyEvents from "@/hooks/useKeyEvents";
import { getFromDB, saveToDB } from "@/utils/indexedDB";
import Loading from "@/components/core/account/Loading";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer } from "react-toastify";
import Modal from "react-modal";
import { fetchData } from "@/utils/Api";
import Loader from "@/components/core/common/Loader";
import ContextConfirmationModal from "@/components/core/common/modal/ContextModal";
import AppProviders from "@/contexts/AppProviders";
import DynamicHead from "@/components/core/common/DynamicHead";
import { useUiDirection } from "@/contexts/UiDirectionContext";

Modal.setAppElement("#__next");

const PUBLIC_ROUTES = new Set([
  "/",
  "/platform",
  "/solutions",
  "/deployments/cloud",
  "/deployments/local",
  "/apps",
  "/publishers",
]);

export default function App({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useKeyEvents();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getFromDB("authToken");

      if (token) {
        setIsAuthenticated(true);
        const response = await fetchData({}, "roles");
        const prof = await fetchData({}, `profile`);
        if (response?.data) {
          await saveToDB("permissions", response?.data);
          await saveToDB("profile", prof?.data);
        }
      } else {
        setIsAuthenticated(false);

        const isApiRoute = router.pathname.startsWith("/apis");
        const isPublicRoute = PUBLIC_ROUTES.has(router.pathname);

        if (
          !isApiRoute &&
          !isPublicRoute &&
          router.pathname !== "/login" &&
          router.pathname !== "/signup" &&
          router.pathname !== "/admin"
        ) {
          router.push("/login");
        }
      }
    };

    checkAuth();
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loading />;
  }

  const isAuthPage =
    router.pathname === "/login" || router.pathname === "/signup";
  const isPublicPage = PUBLIC_ROUTES.has(router.pathname);
  const useAppShell = !isAuthPage && !isPublicPage;

  return (
    <>
      <AppProviders>
        <AppFrame Component={Component} pageProps={pageProps} isClient={isClient} isPublicPage={isPublicPage} isAuthPage={isAuthPage} useAppShell={useAppShell} />
      </AppProviders>
    </>
  );
}

function AppFrame({ Component, pageProps, isPublicPage, isAuthPage, useAppShell }) {
  const { dir } = useUiDirection();
  const isRtl = dir === "rtl";

  useEffect(() => {
    if (typeof window === "undefined" || !useAppShell || isPublicPage || isAuthPage) return;

    const logShellState = (reason = "effect") => {
      const shell = document.querySelector("[data-app-shell-dir]");
      const sidebar = document.querySelector('[data-app-shell-slot="sidebar"]');
      const content = document.querySelector('[data-app-shell-slot="content"]');
      const sidebarPanel = document.querySelector("aside > div");

      if (!shell || !sidebar || !content) {
        console.log("[3plug RTL debug]", reason, "missing shell nodes");
        return;
      }

      const s = sidebar.getBoundingClientRect();
      const c = content.getBoundingClientRect();

      console.log("[3plug RTL debug]", {
        reason,
        dir,
        shellClass: shell.className,
        sidebarClass: sidebar.className,
        contentClass: content.className,
        sidebarPanelClass: sidebarPanel?.className || null,
        sidebarRect: { left: Math.round(s.left), right: Math.round(s.right), width: Math.round(s.width) },
        contentRect: { left: Math.round(c.left), right: Math.round(c.right), width: Math.round(c.width) },
        sidebarVisualSide: s.left < c.left ? "left" : "right",
        viewport: { w: window.innerWidth, h: window.innerHeight },
      });
    };

    logShellState("dir/render");
    const onResize = () => logShellState("resize");
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [dir, useAppShell, isPublicPage, isAuthPage]);

  return (
    <>
        <DynamicHead />
        <div
          dir={dir}
          className={`m-0 font-sans text-base antialiased font-normal font-lato leading-8 leading-default text-slate-700 w-full ${
            isPublicPage
              ? "bg-white min-h-screen"
              : "bg-brand-surface flex min-h-screen items-start md:items-center justify-center"
          }`}
        >
          <ToastContainer
            theme="colored"
            position="bottom-right"
            autoClose={3500}
            toastClassName="brand-toast"
          />
          {/* Fixed Navbar */}
          {useAppShell && (
            <div className="fixed top-0 left-0 right-0 z-50 bg-gray-50">
              <div className="flex items-center justify-center">
                <Navbar />
              </div>
              <hr className="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/90 to-transparent" />
            </div>
          )}

          {/* Main Content Area with Padding to Avoid Overlap */}
          <main
            className={`relative w-full ${
              isPublicPage
                ? "min-h-screen"
                : "flex min-h-screen flex-col items-center justify-start md:justify-center"
            }`}
          >
            {isPublicPage ? (
              <Component {...pageProps} />
            ) : (
            <div
              data-app-shell-dir={dir}
              className={`ease-soft-in-out ${
                useAppShell ? "pt-16 md:pt-14 md:h-[100vh]" : ""
              } relative w-full max-w-[1536px] rounded-xl transition-all duration-200 md:flex md:items-stretch md:justify-start`}
            >
              {isAuthPage ? (
                <div className="flex-grow overflow-y-auto">
                  <div className="relative flex-grow">
                    <Component {...pageProps} />
                  </div>
                </div>
              ) : (
                <>
                  <div data-app-shell-slot="sidebar" className="w-0 shrink-0 md:w-fit md:h-[88vh]">
                    <Sidebar />
                  </div>
                  <div data-app-shell-slot="content" className="flex-1 flex flex-col w-full min-w-0">
                    <div className="flex-grow min-h-0 md:h-[88vh] pt-0 overflow-y-auto">
                      <div className="relative flex-grow">
                        <Component {...pageProps} />
                      </div>
                    </div>
                    <Footer />{" "}
                  </div>
                </>
              )}{" "}
            </div>
            )}
          </main>
          <Loader />
          <ContextConfirmationModal />
          {/* <div id="dropdown-root"></div> */}
        </div>
    </>
  );
}
