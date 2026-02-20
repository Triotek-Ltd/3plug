import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { postData } from "@/utils/Api";
import PrimaryButton from "@/components/core/common/buttons/Primary";
import DocumentForm from "@/components/pages/new/DocumentForm";
import useKeySave from "@/hooks/useKeySave";
import Loading from "@/components/core/account/Loading";
import { useData } from "@/contexts/DataContext";
import { getFromDB } from "@/utils/indexedDB";

const NewDocument = ({ config, initialData }) => {
  const { data, setData } = useData();
  const router = useRouter();
  const formRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mergedInitialData, setMergedInitialData] = useState(initialData);
  const [perms, setPerms] = useState(null);

  const { slug } = router.query;

  useEffect(() => {
    const checkAuth = async () => {
      const perm = await getFromDB("permissions");
      setPerms(perm);
    };
    checkAuth();
  }, [router]);

  const hasPermission = () => {
    const permission = `add_${config?.name?.toLowerCase()}`;

    if (permission == "add_document") {
      return true;
    }

    if (!permission) {
      return true;
    }

    if (perms === "all") {
      return true;
    }

    return perms?.includes(permission);
  };

  if (perms != null && !hasPermission()) {
    router.push("/403");
  }

  useEffect(() => {
    if (initialData && initialData.id) {
      setIsEditing(true);
    }

    const query = router.query;

    if (query && Object.keys(query).length > 0) {
      const updatedData = { ...initialData, ...query };
      setMergedInitialData(updatedData);
    }
  }, [initialData, router.query]);

  const handleSubmit = async (formData) => {
    setLoading(true);

    const parsedData = {};

    Object.keys(formData).forEach((key) => {
      const { type, value } = formData[key];

      if (value === "" && (type === "date" || type === "datetime-local")) {
        parsedData[key] = null;
        return;
      }

      switch (type) {
        case "float":
        case "decimal":
          parsedData[key] = value === "" ? null : parseFloat(value);
          break;
        case "boolean":
          parsedData[key] = value === "on";
          break;
        case "date":
          const date = new Date(value);
          parsedData[key] = isNaN(date.getTime())
            ? null
            : date.toISOString().split("T")[0];
          break;
        case "datetime-local":
          const datetime = new Date(value);
          parsedData[key] = isNaN(datetime.getTime())
            ? null
            : datetime.toISOString();
          break;
        case "time":
          parsedData[key] = value === "" ? null : value;
          break;
        case "file":
          if (value instanceof File) {
            parsedData[key] = value;
          }
          break;
        default:
          parsedData[key] = value === "" ? null : value;
      }
    });

    try {
      const response = await postData(parsedData, config.endpoint, true);

      if (response.data) {
        const docid = response.data.id;
        router.push(`${slug}/${docid}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClick = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  useKeySave(handleSaveClick);

  return (
    <div className="mx-4 -mt-28">
      {loading && <Loading />}
      <div
        className="relative flex items-center p-0 mt-6 overflow-hidden bg-center bg-cover min-h-32 rounded-2xl"
        style={{
          backgroundImage: `url('/img/curved-images/curved0.jpg')`,
          backgroundPositionY: "50%",
        }}
      >
        <span className="absolute inset-y-0 w-full h-full bg-center bg-cover bg-gradient-to-tl from-purple-700 to-pink-500 opacity-60"></span>
      </div>

      <div className="relative flex flex-col flex-auto min-w-0 p-4 mx-6 -mt-12 overflow-hidden break-words border-0 shadow-blur rounded-2xl bg-white/80 bg-clip-border backdrop-blur-2xl backdrop-saturate-200">
        <div className="flex flex-wrap -mx-3">
          <div className="flex-none w-auto max-w-full px-3">
            <div className="text-base ease-soft-in-out h-8.5 w-8.5 relative inline-flex items-center justify-center rounded-xl text-white transition-all duration-200">
              <img
                src="/img/favicon.png"
                alt="profile_image"
                className="w-full shadow-soft-sm rounded-xl"
              />
            </div>
          </div>
          <div className="flex-none w-auto max-w-full px-3 my-auto">
            <div className="h-full">
              <h5 className="mb-1">New {config.name}</h5>
            </div>
          </div>
          <div className="w-fit max-w-full px-3 mx-auto mt-4 sm:my-auto sm:mr-0">
            <button type="button" onClick={handleSaveClick} disabled={loading}>
              <PrimaryButton text={loading ? "Saving..." : "Save"} />
            </button>
          </div>
        </div>
      </div>

      <DocumentForm
        ref={formRef}
        config={config}
        initialData={mergedInitialData}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default NewDocument;
