import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useData } from "@/contexts/DataContext";
import { fetchData } from "@/utils/Api";
import parse from "html-react-parser";

const DynamicHead = () => {
  const { websiteSettings, setWebsiteSettings } = useData();
  const [parsedHead, setParsedHead] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await fetchData({}, `frappe/website_settings/1/`);
      if (settings?.data) {
        setWebsiteSettings(settings.data);
        if (settings.data.head_html) {
          const parsed = parse(settings.data.head_html);
          setParsedHead(parsed);
        }
      }
    };

    fetchSettings();
  }, []);

  const siteTitle =
    websiteSettings?.site_title || websiteSettings?.app_name || "3plug";
  const siteDescription =
    websiteSettings?.meta_description ||
    websiteSettings?.welcome_message ||
    `${siteTitle} platform`;
  const siteImage = websiteSettings?.app_logo || "/brand/logo-3plug.png";

  return (
    <Head>
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />
      {parsedHead}
    </Head>
  );
};

export default DynamicHead;
