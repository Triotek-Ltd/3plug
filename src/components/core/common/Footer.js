import { useData } from "@/contexts/DataContext";
import Link from "next/link";
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const { websiteSettings } = useData();
  const productName =
    websiteSettings?.site_title || websiteSettings?.app_name || "3plug Platform";

  // Split footer_powered into name and URL
  const [poweredName, poweredUrl] =
    websiteSettings?.footer_powered?.split(",") || ["Triotek Systems Ltd", "triotek.com"];

  // Ensure URLs in the ul have "https://"
  const formatUrl = (url) => (url?.startsWith("http") ? url : `https://${url}`);

  const platformLinks = [
    { label: "Platform Home", href: "/home" },
    { label: "Launcher", href: "/launcher" },
    { label: "Builder Desk", href: "/builder" },
    { label: "Publisher Desk", href: "/publisher" },
    { label: "Admin Desk", href: "/admin" },
  ];

  return (
    <footer className="py-1">
      <div className="w-full px-2 mx-auto text-xs">
        <div className="hidden md:flex md:flex-row items-center gap-2 -mx-3 lg:justify-between">
          <div className="w-fit px-3 mt-0 shrink-0">
            <div className="text-sm leading-normal text-center text-slate-500 lg:text-left">
              Built by
              <a
                href={formatUrl(poweredUrl)}
                className="font-semibold text-blue-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                &nbsp;{poweredName}&nbsp;
              </a>
              for the {productName} runtime and portal.
            </div>
          </div>
          <div>
            &copy; {currentYear} {productName}. All rights reserved.
          </div>
          <div className="w-fit px-3 mt-0 shrink-0">
            <ul className="flex flex-wrap justify-center pl-0 mb-0 list-none gap-x-1 lg:justify-end">
              {platformLinks.map((item) => (
                <li className="nav-item" key={item.label}>
                  <Link
                    href={item.href}
                    className="block px-3 pt-0 pb-1 text-sm font-normal transition-colors ease-soft-in-out text-slate-500 hover:text-slate-700"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
