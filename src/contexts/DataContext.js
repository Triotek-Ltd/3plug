import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [data, setData] = useState({});
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [doc, setDoc] = useState(null);
  const [websiteSettings, setWebsiteSettings] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (!url.endsWith("/new")) {
        setData({});
        setForm({});
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        form,
        setForm,
        loading,
        setLoading,
        notifications,
        setNotifications,
        doc,
        setDoc,
        websiteSettings,
        setWebsiteSettings,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
