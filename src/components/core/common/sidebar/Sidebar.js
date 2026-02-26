import React, { useRef, useEffect, useState } from "react";
import Documentation from "@/components/core/common/sidebar/Documentation";
import SidebarList from "@/components/core/common/sidebar/List";
import {
  faDashboard,
  faUser,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faUserFriends,
  faCogs,
  faDiagnoses,
  faBook,
  faBookOpen,
  faTools,
  faBars,
  faCashRegister,
  faFileInvoice,
  faBox,
  faChartBar,
  faTruckLoading,
  faDriversLicense,
  faMoneyBillTransfer,
  faBell,
  faHeadset,
  faSailboat,
  faUserCheck,
  faShieldHalved,
  faGlobe,
  faFlask,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSidebar } from "@/contexts/SidebarContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { useRouter } from "next/router";
import sidebarConfig from "@/data/sidebar.json"; // Import sidebar.json for sidebar settings
import Link from "next/link";
import { fetchData } from "@/utils/Api";
import { useData } from "@/contexts/DataContext";
import { useUiDirection } from "@/contexts/UiDirectionContext";

const Sidebar = () => {
  const { sidebarWidth, setSidebarWidth, sidebarHidden } = useSidebar();
  const { dashboardText, pageInfo } = useNavbar();
  const sidebarRef = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarLinks, setSidebarLinks] = useState([]);
  const router = useRouter();
  const { websiteSettings } = useData();
  const { dir } = useUiDirection();
  const isRtl = dir === "rtl";
  const companyName =
    websiteSettings?.site_title || websiteSettings?.app_name || "3plug";
  const companyLogo = websiteSettings?.app_logo || "/brand/logo-3plug.png";
  const isHomeRoute = router.pathname === "/home";
  const isLauncherRoute = router.pathname === "/launcher";
  const isAccountRoute = router.pathname.startsWith("/account");
  const isAdminRoute = router.pathname === "/admin" || router.pathname.startsWith("/admin/");
  const isPublisherRoute = router.pathname === "/publisher" || router.pathname.startsWith("/publisher/");
  const isPlatformRoute = router.pathname === "/platform" || router.pathname.startsWith("/platform/");
  const isWorkbenchRoute = router.pathname.startsWith("/workbench/");
  const isWorkspaceEntryRoute = isHomeRoute || isLauncherRoute;

  useEffect(() => {
    const handleResize = () => {
      if (sidebarHidden) {
        setIsCollapsed(true);
      } else {
        if (sidebarRef.current) {
          setIsCollapsed(window.innerWidth < 1150);
        }
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [router, sidebarHidden]);

  useEffect(() => {
    if (sidebarRef.current) {
      setSidebarWidth(sidebarRef.current.offsetWidth);
    }
  }, [isCollapsed, sidebarHidden]);

  useEffect(() => {
    const fetchLinks = async () => {
      const response = await fetchData({}, `core/sidebar_link`);
      if (response?.data) {
        setSidebarLinks(response?.data?.data);
      }
    };
    fetchLinks();
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const accountNavItems = [
    { icon: faUser, text: "Account Setup", link: "/account/setup" },
    { icon: faUserCheck, text: "Access", link: "/account/access" },
    { icon: faShieldHalved, text: "Security", link: "/account/access?panel=security" },
    { icon: faCashRegister, text: "Billing", link: "/account/billing" },
    { icon: faGlobe, text: "Localization", link: "/account/localization" },
  ];
  const workspaceNavItems = [
    { icon: faDashboard, text: "Home", link: "/home" },
    { icon: faBox, text: "Launcher", link: "/launcher" },
    { icon: faUser, text: "Account", link: "/account/setup" },
    { icon: faSailboat, text: "Publisher", link: "/publisher" },
    { icon: faChartBar, text: "Admin", link: "/admin" },
    { icon: faFlask, text: "Workbench", link: "/workbench/doc-builder" },
  ];
  const workbenchNavItems = [
    { icon: faFlask, text: "Doc Builder", link: "/workbench/doc-builder" },
    { icon: faBookOpen, text: "List / Report", link: "/workbench/list-report-builder" },
    { icon: faTools, text: "Form Builder", link: "/workbench/form-builder" },
    { icon: faShieldHalved, text: "Actions / Permissions", link: "/workbench/actions-builder" },
    { icon: faCogs, text: "Workflow / Approval", link: "/workbench/workflow-builder" },
    { icon: faBell, text: "Notification / Alert", link: "/workbench/notification-builder" },
    { icon: faFileInvoice, text: "Print Format", link: "/workbench/print-format-builder" },
    { icon: faChartBar, text: "Chart Builder", link: "/workbench/chart-builder" },
    { icon: faDashboard, text: "Dashboard Builder", link: "/workbench/dashboard-builder" },
    { icon: faBook, text: "Page Builder", link: "/workbench/page-builder" },
    { icon: faBox, text: "Workspace / Desk", link: "/workbench/workspace-builder" },
    { icon: faBars, text: "Navigation / Menu", link: "/workbench/navigation-builder" },
    { icon: faTools, text: "Automation / Rule", link: "/workbench/automation-builder" },
    { icon: faGlobe, text: "Integration / Webhook", link: "/workbench/integration-builder" },
    { icon: faMoneyBillTransfer, text: "Import / Export Mapping", link: "/workbench/import-export-builder" },
    { icon: faDiagnoses, text: "Query / Dataset", link: "/workbench/query-builder" },
    { icon: faCogs, text: "Theme / UI Token", link: "/workbench/theme-builder" },
    { icon: faGlobe, text: "Localization", link: "/workbench/localization-builder" },
    { icon: faFlask, text: "API Workbench", link: "/workbench/api-workbench" },
  ];
  const adminNavItems = [
    { icon: faDashboard, text: "Admin Overview", link: "/admin" },
    { icon: faDiagnoses, text: "Platform Monitoring", link: "/admin/platform-monitoring" },
    { icon: faBookOpen, text: "Logs & Audit", link: "/admin/logs-audit" },
    { icon: faDriversLicense, text: "License Monitoring", link: "/admin/license-monitoring" },
    { icon: faBell, text: "Announcements", link: "/admin/announcements" },
    { icon: faChartBar, text: "Landing Analytics", link: "/admin/landing-analytics" },
  ];
  const publisherNavItems = [
    { icon: faSailboat, text: "Publisher Overview", link: "/publisher" },
    { icon: faBox, text: "Apps", link: "/publisher/apps" },
    { icon: faTruckLoading, text: "Deployments", link: "/publisher/deployments" },
    { icon: faMoneyBillTransfer, text: "Revenue", link: "/publisher/revenue" },
    { icon: faTools, text: "Integrations", link: "/publisher/integrations" },
    { icon: faHeadset, text: "Support", link: "/publisher/support" },
  ];

  return (
    <>
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      <aside
        className={`${
          !sidebarHidden ? "" : "hidden"
        } -mt-[8vh] pt-2 md:pt-0 md:mt-0 w-fit relative z-100 flex flex-col`}
        ref={sidebarRef}
      >
        {isCollapsed && (
          <button
            onClick={toggleSidebar}
            className={`w-fit fixed z-100 text-slate-700 py-2 px-2 group text-sm md:text-xl top-2 md:top-16 bg-gray-50 rounded ${isRtl ? "left-2" : "right-2"}`}
          >
            {/* Default icon (faBars) */}
            <FontAwesomeIcon
              icon={faBars}
              className="transition-all duration-300 ease-in-out group-hover:hidden" // Hide on hover
            />
            {/* Hover icon (faAngleDoubleRight) */}
            <FontAwesomeIcon
              icon={isRtl ? faAngleDoubleRight : faAngleDoubleLeft}
              className="transition-all duration-300 ease-in-out hidden group-hover:block" // Show on hover
            />
          </button>
        )}

        <div
          className={`w-fit h-[110vh] md:max-h-[92vh] overflow-auto ease-nav-brand block -translate-x-full flex-wrap flex-grow items-center justify-between border-0 p-1 antialiased transition-transform duration-200 ${
            isRtl ? "right-0 md:right-auto md:left-auto" : "left-0 md:left-auto md:right-auto"
          } translate-x-0 ${
            !isCollapsed ? "fixed md:relative" : "hidden"
          }`}
        >
          <div className={`h-fit flex items-center ${isRtl ? "justify-end" : "justify-start"} gap-2 px-3 py-1`}>
            <Link href="/home" className="block py-2 m-0 text-sm text-slate-700">
              <div className={`flex items-center ${isRtl ? "flex-row-reverse text-right" : "flex-row text-left"} gap-2 transition-all duration-200 ease-nav-brand`}>
                <img
                  src={companyLogo}
                  alt="Company Logo"
                  className="h-6 w-6 rounded-md object-cover shrink-0"
                />
                <span className={`font-semibold text-xs leading-tight ${isRtl ? "text-right" : "text-left"}`}>
                  {companyName}
                </span>
              </div>
            </Link>
            <button
              onClick={toggleSidebar}
              className="group text-sm md:text-xl flex py-2 px-1"
            >
              <FontAwesomeIcon
                icon={faBars}
                className="transition-all duration-300 ease-in-out group-hover:hidden"
              />
              <FontAwesomeIcon
                icon={isRtl ? faAngleDoubleLeft : faAngleDoubleRight}
                className="transition-all duration-300 ease-in-out hidden group-hover:block"
              />
            </button>
          </div>

          <hr className="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent" />

          <div className={`items-center block w-auto h-fit grow basis-full scrollbar scrollbar-thin scrollbar-thumb-slate-50 scrollbar-track-slate-100 ${isRtl ? "pl-2" : "pr-2"}`}>
            <ul className="flex flex-col mb-4">
              <SidebarList
                icon={faDashboard}
                text="Home"
                link="/home"
                active={dashboardText === "Home"}
              />

              {/* Dynamically add links from sidebar.json */}
              {sidebarLinks.map((link) => (
                <SidebarList
                  key={link?.id} // Use text as key or any unique identifier
                  icon={link?.icon} // Adjust the icon or load dynamically from sidebar.json
                  text={link?.label}
                  link={link?.url}
                />
              ))}

              {isAccountRoute ? (
                <>
                  <li className={`w-full mb-2 mt-6 ${isRtl ? "pl-2" : "pr-2"}`}>
                    <h6 className={`${isRtl ? "pr-3 mr-2 text-right" : "pl-3 ml-2 text-left"} text-xs font-bold leading-tight uppercase opacity-60`}>
                      Account
                    </h6>
                  </li>
                  {accountNavItems.map((item) => (
                    <SidebarList key={item.link} icon={item.icon} text={item.text} link={item.link} />
                  ))}
                </>
              ) : isWorkspaceEntryRoute || isPlatformRoute ? (
                <>
                  <li className={`w-full mb-2 mt-6 ${isRtl ? "pl-2" : "pr-2"}`}>
                    <h6 className={`${isRtl ? "pr-3 mr-2 text-right" : "pl-3 ml-2 text-left"} text-xs font-bold leading-tight uppercase opacity-60`}>
                      Workspace
                    </h6>
                  </li>
                  {workspaceNavItems.map((item) => (
                    <SidebarList key={item.link} icon={item.icon} text={item.text} link={item.link} />
                  ))}
                </>
              ) : isWorkbenchRoute ? (
                <>
                  <li className={`w-full mb-2 mt-6 ${isRtl ? "pl-2" : "pr-2"}`}>
                    <h6 className={`${isRtl ? "pr-3 mr-2 text-right" : "pl-3 ml-2 text-left"} text-xs font-bold leading-tight uppercase opacity-60`}>
                      Workbench
                    </h6>
                  </li>
                  {workbenchNavItems.map((item) => (
                    <SidebarList key={item.link} icon={item.icon} text={item.text} link={item.link} />
                  ))}
                </>
              ) : isAdminRoute ? (
                <>
                  <li className={`w-full mb-2 mt-6 ${isRtl ? "pl-2" : "pr-2"}`}>
                    <h6 className={`${isRtl ? "pr-3 mr-2 text-right" : "pl-3 ml-2 text-left"} text-xs font-bold leading-tight uppercase opacity-60`}>
                      Admin
                    </h6>
                  </li>
                  {adminNavItems.map((item) => (
                    <SidebarList key={item.link} icon={item.icon} text={item.text} link={item.link} />
                  ))}
                </>
              ) : isPublisherRoute ? (
                <>
                  <li className={`w-full mb-2 mt-6 ${isRtl ? "pl-2" : "pr-2"}`}>
                    <h6 className={`${isRtl ? "pr-3 mr-2 text-right" : "pl-3 ml-2 text-left"} text-xs font-bold leading-tight uppercase opacity-60`}>
                      Publisher
                    </h6>
                  </li>
                  {publisherNavItems.map((item) => (
                    <SidebarList key={item.link} icon={item.icon} text={item.text} link={item.link} />
                  ))}
                </>
              ) : (
                <>
                  <li className={`w-full mb-2 mt-6 ${isRtl ? "pl-2" : "pr-2"}`}>
                    <h6 className={`${isRtl ? "pr-3 mr-2 text-right" : "pl-3 ml-2 text-left"} text-xs font-bold leading-tight uppercase opacity-60`}>
                      Admin
                    </h6>
                  </li>
                  <SidebarList
                    icon={faUser}
                    text="Account Setup"
                    link="/account/setup"
                  />
                  <SidebarList
                    icon={faUserFriends}
                    text="Users"
                    link="/app/user"
                    permission="view_user"
                  />
                  <SidebarList
                    icon={faCogs}
                    text="Rolegroup"
                    link="/app/group"
                    permission="view_rolegroup"
                  />
                  <SidebarList
                    icon={faDiagnoses}
                    text="Permissions"
                    link="/app/permission"
                    permission="view_permission"
                  />
                </>
              )}

              <Documentation />
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
