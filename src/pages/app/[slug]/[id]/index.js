import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ConfigProvider } from "@/contexts/ConfigContext";
import Loading from "@/components/core/account/Loading";
import DoctypeForm from "@/components/pages/form";
import { useDocumentData } from "@/hooks/useDocumentData";
import { handleSave } from "@/utils/handleSave";
import { useData } from "@/contexts/DataContext";

const DocumentDetail = () => {
  const router = useRouter();
  const { slug, id } = router.query;
  const [config, setConfig] = useState(null);
  const { data, form, setData, setForm, loading, setLoading } = useData();

  useEffect(() => {
    if (!slug && !id) {
      setData(null); // Reset data before fetching new document details
      setForm(null); // Reset form to avoid stale data
    }
  }, [slug, id]);

  const { appData } = useDocumentData(slug, id, setConfig);

  const saveData = async (f) => {
    await handleSave({
      data,
      form,
      appData,
      slug,
      id,
      setData,
      setForm,
      setLoading,
      config,
    });
  };

  if (!config) {
    return <Loading />;
  }
  if (config?.issingle && typeof window !== "undefined") {
    const path = window.location.pathname
      .split("/")
      .filter(Boolean)
      .slice(0, -1)
      .join("/");
    window.location.replace(`${window.location.origin}/${path}`);
  }

  return (
    <ConfigProvider initialConfig={config} initialAppData={appData}>
      <DoctypeForm handleSave={saveData} config={config} />
    </ConfigProvider>
  );
};

export default DocumentDetail;
