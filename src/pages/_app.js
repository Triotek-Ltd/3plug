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

Modal.setAppElement("#__next");

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

        if (
          !isApiRoute &&
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

  return (
    <>
      <AppProviders>
        <DynamicHead />
        <div className="m-0 font-sans text-base antialiased font-normal font-lato leading-8 leading-default bg-gray-50 text-slate-500 max-h-screen w-full flex items-center justify-center">
          <ToastContainer />
          {/* Fixed Navbar */}
          {!isAuthPage && (
            <div className="fixed top-0 left-0 right-0 z-50 bg-gray-50">
              <div className="flex items-center justify-center">
                <Navbar />
              </div>
              <hr className="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/90 to-transparent" />
            </div>
          )}

          {/* Main Content Area with Padding to Avoid Overlap */}
          <main className="relative flex flex-col w-full items-center justify-center h-screen">
            <div
              className={`ease-soft-in-out max-h-screen ${
                !isAuthPage ? "pt-1 md:pt-14 h-[100vh]" : ""
              } flex flex-row relative items-center justify-center rounded-xl transition-all duration-200 w-full max-w-[1536px]`}
            >
              {isAuthPage ? (
                <div className="flex-grow overflow-y-auto">
                  <div className="relative flex-grow">
                    <Component {...pageProps} />
                  </div>
                </div>
              ) : (
                <>
                  <div className="h-[88vh] w-fit">
                    <Sidebar />
                  </div>
                  <div className="flex-grow flex flex-col w-full">
                    <div className="flex-grow h-full md:h-[88vh] pt-[6vh] md:pt-0 overflow-y-auto">
                      <div className="relative flex-grow">
                        <Component {...pageProps} />
                      </div>
                    </div>
                    <Footer />{" "}
                  </div>
                </>
              )}{" "}
            </div>
          </main>
          <Loader />
          <ContextConfirmationModal />
          {/* <div id="dropdown-root"></div> */}
        </div>
      </AppProviders>
    </>
  );
}
