import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ConfigProvider } from "@/contexts/ConfigContext";
import Loading from "@/components/core/account/Loading";
import DoctypeForm from "@/components/pages/form";
import { useDocumentData } from "@/hooks/useDocumentData";
import { handleSave } from "@/utils/handleSave";
import { useData } from "@/contexts/DataContext";
import { postData } from "@/utils/Api";

const SingleDocumentDetail = () => {
  const router = useRouter();
  const id = "1";
  const { slug } = router.query;
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
    if (!data) {
      saveNewData(form);
      return;
    } else {
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
    }
  };

  const saveNewData = async (form) => {
    try {
      setLoading(true);

      const response = await postData(form, `${appData?.app}/${slug}`, true);

      if (response.data) {
        setData(response.data);
        setForm(response.data);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };
  if (!config) {
    return <Loading />;
  }

  return (
    <ConfigProvider initialConfig={config} initialAppData={appData}>
      <DoctypeForm handleSave={saveData} config={config} />
    </ConfigProvider>
  );
};

export default SingleDocumentDetail;
