import { useNavbar } from "@/contexts/NavbarContext";
import { getFromDB } from "@/utils/indexedDB";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import * as Icons from "react-icons/fa"; // Import all Font Awesome icons

const SidebarList = ({ icon, text, link, permission }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const [perms, setPerms] = useState([]);

  const { dashboardText } = useNavbar();
  const active = dashboardText == text;

  // Generate a unique ID for each list item
  const uniqueId = crypto.randomUUID();

  useEffect(() => {
    const checkAuth = async () => {
      const perm = await getFromDB("permissions");
      setPerms(perm);
    };
    checkAuth();
  }, [router]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Check if permission is granted
  const hasPermission = () => {
    if (!permission) {
      return true;
    }
    if (perms === "all") {
      return true;
    }
    return perms?.includes(permission);
  };

  if (!hasPermission()) {
    return null;
  }
  const renderIcon = () => {
    const iconColor = isHovered || active ? "#FFFFFF" : "#701a75";

    if (typeof icon === "string" && Icons[icon]) {
      return React.createElement(Icons[icon], {
        className: "w-5 h-5",
        style: { color: iconColor },
      });
    } else {
      return <FontAwesomeIcon icon={icon} style={{ color: iconColor }} />;
    }
  };

  return (
    <li id={uniqueId} key={uniqueId} className="mt-0.5 w-full">
      <Link
        href={link}
        className={`py-2 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap rounded-lg px-2 font-semibold text-slate-700 transition-colors ${
          isHovered || active ? "shadow-soft-xl bg-white" : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5 ${
            isHovered || active
              ? "shadow-soft-xl bg-gradient-to-tl from-purple-700 to-pink-500 text-white"
              : "shadow-soft-2xl"
          }`}
        >
          {renderIcon()}
        </div>
        <span className="ml-1 duration-300 opacity-100 pointer-events-none ease-soft">
          {text}
        </span>
      </Link>
    </li>
  );
};

export default SidebarList;
