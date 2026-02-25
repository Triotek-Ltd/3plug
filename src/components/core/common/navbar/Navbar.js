import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useNavbar } from "@/contexts/NavbarContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faTachometerAlt,
  faSearch,
  faUserCircle,
  faSignInAlt,
  faSignOutAlt,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { getFromDB, deleteFromDB } from "@/utils/indexedDB";
import LogoutModal from "@/components/core/common/LogoutModal";
import Search from "./Search";
import RemindersIcon from "./RemindersIcon";
import { useData } from "@/contexts/DataContext";
import { useUiDirection } from "@/contexts/UiDirectionContext";

const Navbar = () => {
  const router = useRouter();
  const { textColor, iconColor } = "text-gray-800";
  const { dashboardText, pagesText, navLinks, pageInfo } = useNavbar();
  const { sidebarWidth } = useSidebar();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);

  const { websiteSettings } = useData();
  const { dir } = useUiDirection();
  const isRtl = dir === "rtl";
  const companyName =
    websiteSettings?.site_title || websiteSettings?.app_name || "3plug";

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getFromDB("authToken");
      setIsAuthenticated(!!token);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const referrer = document.referrer;
    if (!referrer) {
      setCanGoBack(false);
      return;
    }

    try {
      const referrerUrl = new URL(referrer);
      const sameOrigin = referrerUrl.origin === window.location.origin;
      const isLoginReferrer = referrerUrl.pathname === "/login";
      const isLoginPage = router.pathname === "/login";

      setCanGoBack(sameOrigin && !isLoginReferrer && !isLoginPage);
    } catch (error) {
      setCanGoBack(false);
    }
  }, [router.pathname]);

  const handleLogout = async () => {
    await deleteFromDB("authToken");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  const handleBack = () => {
    if (!canGoBack) return;
    router.back();
  };

  return (
    <>
      <div className="w-full max-w-[1536px] z-50 flex flex-wrap items-center justify-between transition-all duration-250 ease-soft-in bg-transparent">
        <div className="grid w-full grid-cols-1 items-center gap-2 px-2 py-1 md:grid-cols-[auto_minmax(320px,560px)_auto] md:gap-4 md:px-4">
          <div className={`flex items-center ${isRtl ? "md:justify-self-end" : "md:justify-self-start"}`}>
            <Link href="/home">
              <span className={`${isRtl ? "mr-4" : "ml-4"} text-lg md:text-2xl font-bold text-slate-800 cursor-pointer`}>
                {companyName}
              </span>
            </Link>
          </div>

          <div className="flex w-full items-center justify-center">
            <div className="w-full max-w-[560px] px-2 md:px-0">
              <div className="relative flex w-full flex-wrap items-stretch rounded-lg">
                <Search />
              </div>
            </div>
          </div>

          <div className={`flex items-center ${isRtl ? "md:justify-self-start" : "md:justify-self-end"} justify-end`}>
            <nav className="hidden md:flex md:flex-col gap-x-4">
              <ol className={`flex flex-wrap pt-1 bg-transparent rounded-lg ${isRtl ? "sm:ml-16" : "sm:mr-16"}`}>
                {canGoBack ? (
                  <div
                    className={`flex items-center cursor-pointer text-sm font-semibold transition-all ease-nav-brand ${isRtl ? "pl-4 pr-8" : "pr-4 pl-8"}`}
                    onClick={handleBack}
                  >
                    <FontAwesomeIcon
                      icon={faArrowLeft}
                      className={`${isRtl ? "ml-2 rotate-180" : "mr-2"} ${iconColor} text-gray-800`}
                    />
                    <span className={`hidden md:block ${textColor} text-gray-800`}>
                      Back
                    </span>
                  </div>
                ) : null}
                {/* {navLinks.map((navItem, index) => (
                  <li
                    key={`nav-item-${index}`}
                    id={`nav-item-${index}`}
                    className={`flex items-center justify-center text-sm pl-2 capitalize leading-normal ${textColor} text-gray-800 before:float-left before:pr-2 before:text-gray-600 before:content-['/']`}
                  >
                    <Link href={`${navItem.link}`}>
                      <div className="flex items-center cursor-pointer font-semibold">
                        <FontAwesomeIcon
                          icon={faTachometerAlt}
                          className={`mr-2 ${iconColor}`}
                        />
                        <span>{navItem.text}</span>
                      </div>
                    </Link>
                  </li>
                ))} */}
              </ol>
            </nav>

            <div className={`flex items-center sm:mt-0 lg:flex lg:basis-auto ${isRtl ? "justify-start" : "justify-end"}`}>
              <ul className={`flex flex-row ${isRtl ? "justify-start pr-4" : "justify-end pl-4"} mb-0 list-none`}>
                {isAuthenticated ? (
                  <>
                    <li className={`flex items-center ${isRtl ? "ml-2 md:ml-4" : "mr-2 md:mr-4"}`}>
                      <RemindersIcon />
                    </li>
                    <li className={`flex items-center mx-1 ${isRtl ? "md:ml-2" : "md:mr-2"}`}>
                      <Link href="/profile">
                        <div
                          className={`flex items-center text-sm font-semibold cursor-pointer hover:text-yellow-400 transition duration-300 ease-in-out transform hover:scale-125 ${textColor} cursor-pointer`}
                        >
                          <FontAwesomeIcon
                            icon={faUserCircle}
                            className={`${isRtl ? "ml-2" : "mr-2"} text-green-600 ${iconColor} text-lg md:text-2xl`}
                            size="xl"
                          />
                          {/* <span className="hidden sm:inline">Profile</span> */}
                        </div>
                      </Link>
                    </li>
                    <li className={`flex items-center ${isRtl ? "ml-3" : "mr-3"}`}>
                      <div
                        className={`flex items-center text-sm font-semibold cursor-pointer hover:text-yellow-400 transition duration-300 ease-in-out transform hover:scale-125 ${textColor} cursor-pointer`}
                        onClick={() => setIsModalOpen(true)}
                      >
                        <FontAwesomeIcon
                          icon={faSignOutAlt}
                          className={`text-green-600 ${iconColor} text-lg md:text-2xl`}
                          size="xl"
                        />
                        {/* <span className="hidden sm:inline">Logout</span> */}
                      </div>
                    </li>
                  </>
                ) : (
                  <li className="flex items-center">
                    <Link href="/login">
                      <div
                        className={`flex items-center text-sm font-semibold ${textColor} cursor-pointer`}
                      >
                        <FontAwesomeIcon
                          icon={faSignInAlt}
                          className={`${isRtl ? "ml-2" : "mr-2"} ${iconColor}`}
                        />
                        <span className="hidden sm:inline">Login</span>
                      </div>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <hr className="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent" />
      </div>

      <LogoutModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Navbar;
