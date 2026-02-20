import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import DocForm from "@/components/pages/new/DocForm";
import { postData } from "@/utils/Api";
import PrimaryButton from "@/components/core/common/buttons/Primary";
import useKeySave from "@/hooks/useKeySave";
import Loading from "@/components/core/account/Loading";

const NewDoc = ({ config, initialData }) => {
  const router = useRouter();
  const formRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData && initialData.id) {
      setIsEditing(true);
    }
  }, [initialData]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const response = await postData(formData, config.endpoint);
      if (response.data) {
        const appname = response.data.id;
        await startApp({ appname });
        router.push(`${router.pathname.replace("/new", "")}/${appname}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const startApp = async (data) => {
    try {
      await postData(data, "newapp");
    } catch (error) {
      console.error("Error starting app:", error);
    }
  };

  // Handle save button click
  const handleSaveClick = () => {
    if (formRef.current) {
      formRef.current.submit(); // Trigger form submission from DocForm
    }
  };

  useKeySave(handleSaveClick);

  return (
    <div className="mx-4 ">
      {isLoading && <Loading />}
      <div
        className="relative flex items-center p-0 mt-6 overflow-hidden bg-center bg-cover min-h-16 rounded-2xl"
        style={{
          backgroundImage: `url('/img/curved-images/curved0.jpg')`,
          backgroundPositionY: "50%",
        }}
      >
        <span className="absolute inset-y-0 w-full h-full bg-center bg-cover bg-gradient-to-tl from-purple-700 to-pink-500 opacity-60"></span>
      </div>

      <div className="relative flex flex-col flex-auto min-w-0 p-4 mx-6 -mt-12 overflow-hidden break-words border-0 shadow-blur rounded-2xl bg-white/80 bg-clip-border backdrop-blur-2xl backdrop-saturate-200">
        <div className="flex flex-wrap -mx-3">
          <div className="flex-none w-auto max-w-full px-3"></div>
          <div className="flex-none w-auto max-w-full px-3 my-auto">
            <div className="h-full">
              <h5 className="mb-1"> {config.name}</h5>
            </div>
          </div>
          <div className="w-fit max-w-full px-3 mx-auto mt-4 sm:my-auto sm:mr-0">
            <button type="button" onClick={handleSaveClick}>
              <PrimaryButton text={"Save"} />
            </button>
          </div>
        </div>
      </div>

      <DocForm
        ref={formRef} // Pass the ref to DocForm
        config={config}
        initialData={initialData}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default NewDoc;
