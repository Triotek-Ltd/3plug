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

  return <Head>{parsedHead}</Head>;
};

export default DynamicHead;
