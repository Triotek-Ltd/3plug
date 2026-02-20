import { useNavbar } from "@/contexts/NavbarContext";
import config from "@/modules/core/print-format.json";
import React, { useEffect } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import { ConfigProvider } from "@/contexts/ConfigContext";
import DoctypeForm from "@/components/pages/form";
import { useData } from "@/contexts/DataContext";
import { fetchData, postData, updateData } from "@/utils/Api";
import { useRouter } from "next/router";

const Newdocument = () => {
  const {
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
  } = useNavbar();
  const { setLoading, setData, setForm } = useData();
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    updateDashboardText("Print Format");
    updatePagesText("Core");
    updateTextColor("text-white");
    updateIconColor("text-blue-200");
    const fetchAppData = async () => {
      // Remove await here to allow the code to continue without waiting for the response
      const response = await fetchData({}, `print_format/${slug}`);

      if (response.data) {
        setData(response.data);
        setForm(response.data);
      }
    };
    if (slug) {
      fetchAppData();
    }
  }, [slug]);

  const saveData = async (form) => {
    try {
      setLoading(true);

      const response = await updateData(form, `print_format`);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider initialConfig={config}>
      <DoctypeForm handleSave={saveData} config={config} />
    </ConfigProvider>
  );
};

export default Newdocument;
