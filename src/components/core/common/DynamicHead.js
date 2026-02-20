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

  return (
    <Head>
      <title>3plug by Triotek Ltd</title>
      <meta name="description" content="3plug platform by Triotek Ltd" />
      <meta property="og:title" content="3plug by Triotek Ltd" />
      <meta property="og:description" content="3plug platform by Triotek Ltd" />
      <meta property="og:image" content="/brand/logo-3plug.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="3plug by Triotek Ltd" />
      <meta name="twitter:description" content="3plug platform by Triotek Ltd" />
      <meta name="twitter:image" content="/brand/logo-3plug.png" />
      {parsedHead}
    </Head>
  );
};

export default DynamicHead;
