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

const Navbar = () => {
  const router = useRouter();
  const { textColor, iconColor } = "text-gray-800";
  const { dashboardText, pagesText, navLinks, pageInfo } = useNavbar();
  const { sidebarWidth } = useSidebar();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { websiteSettings } = useData();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getFromDB("authToken");
      setIsAuthenticated(!!token);
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await deleteFromDB("authToken");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <>
      <div className="w-full max-w-[1536px] z-50 flex flex-wrap items-center justify-between transition-all duration-250 ease-soft-in bg-transparent">
        <div className="flex items-center justify-between w-full px-2 md:px-4 py-1">
          <Link href="/">
            {websiteSettings?.app_logo && (
              <img
                src={websiteSettings?.app_logo}
                alt="App Logo"
                className="h-10 md:h-12 ml-4 w-auto p-1 flex items-center cursor-pointer"
              />
            )}
          </Link>
          <nav className="hidden md:flex md:flex-col gap-x-4">
            <ol className="flex flex-wrap pt-1 bg-transparent rounded-lg sm:mr-16">
              <div
                className="flex items-center cursor-pointer pr-4 pl-8 text-sm font-semibold transition-all ease-nav-brand"
                onClick={() => router.back()}
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  className={`mr-2 ${iconColor} text-gray-800`}
                />
                <span className={`hidden md:block ${textColor} text-gray-800`}>
                  Back
                </span>
              </div>
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

          <div className="flex items-center grow sm:mt-0 lg:flex lg:basis-auto w-full justify-end">
            <div className="flex items-center md:ml-auto pl-8 md:pr-4 ">
              <div className="relative flex flex-wrap items-stretch w-full rounded-lg">
                <Search />
              </div>
            </div>
            <ul className="flex flex-row justify-end pl-4 mb-0 list-none">
              {isAuthenticated ? (
                <>
                  <li className="flex items-center mr-2 md:mr-4">
                    <RemindersIcon />
                  </li>
                  <li className="flex items-center mx-1 md:mr-2">
                    <Link href="/profile">
                      <div
                        className={`flex items-center text-sm font-semibold cursor-pointer hover:text-yellow-400 transition duration-300 ease-in-out transform hover:scale-125 ${textColor} cursor-pointer`}
                      >
                        <FontAwesomeIcon
                          icon={faUserCircle}
                          className={`mr-2 text-green-600 ${iconColor} text-lg md:text-2xl`}
                          size="xl"
                        />
                        {/* <span className="hidden sm:inline">Profile</span> */}
                      </div>
                    </Link>
                  </li>
                  <li className="flex items-center mr-3">
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
                        className={`mr-2 ${iconColor}`}
                      />
                      <span className="hidden sm:inline">Login</span>
                    </div>
                  </Link>
                </li>
              )}
            </ul>
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
