import { useNavbar } from "@/contexts/NavbarContext";
import config from "@/modules/core/print-format.json";
import React, { useEffect } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import { ConfigProvider } from "@/contexts/ConfigContext";
import DoctypeForm from "@/components/pages/form";
import { useData } from "@/contexts/DataContext";
import { postData } from "@/utils/Api";
import { useRouter } from "next/router";

const Newdocument = () => {
  const {
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
  } = useNavbar();
  const { setSidebarHidden } = useSidebar();
  const { setLoading } = useData();
  const router = useRouter();

  useEffect(() => {
    updateDashboardText("Print Format");
    updatePagesText("Core");
    updateTextColor("text-white");
    updateIconColor("text-blue-200");
  }, []);

  const saveData = async (form) => {
    try {
      setLoading(true);

      const response = await postData(form, `print_format`, true);

      if (
        response.data.additional &&
        response.data.additional.type === "newprintformat"
      ) {
        const documentname = response.data.id;
        const app = response.data.app.name;
        const module1 = response.data.module.name;
        addDoc({ name: documentname, app, module: module1 }); // Don't wait for the response
        router.push(`${router.pathname.replace("/new", "")}/${documentname}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const addDoc = (data) => {
    // Remove await here to allow the code to continue without waiting for the response
    postData(data, "newprintformat")
      .then((response) => {
        // Handle successful response if necessary (you can log or process the response)
      })
      .catch((error) => {
        console.error("Error starting module:", error);
      });
  };

  return (
    <ConfigProvider initialConfig={config}>
      <DoctypeForm handleSave={saveData} config={config} is_doc={false} />
    </ConfigProvider>
  );
};

export default Newdocument;
