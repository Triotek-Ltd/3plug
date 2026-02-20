import React, { useEffect, useRef, useState } from "react";
import DocHeader from "@/components/core/common/header/DocHeader";
import DetailForm from "./DetailForm";
import { useConfig } from "@/contexts/ConfigContext";
import { useData } from "@/contexts/DataContext";
import { useRouter } from "next/router";
import { useModal } from "@/contexts/ModalContext";
import SendEmail from "@/components/functions/communication/SendEmail";
import SendSms from "@/components/functions/communication/SendSms";
import { useFormEvents } from "@/hooks/useFormEvents";
import { useFormLogic } from "@/hooks/useFormLogic";
import { useFormButtons } from "@/hooks/useFormButtons";

const DoctypeForm = ({ handleSave, config, title }) => {
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const { localConfig, localAppData } = useConfig();
  const { form, setForm, setLoading, data, setData, doc, setDoc } = useData();
  const router = useRouter();
  const { openModal } = useModal();
  const { slug, id } = router.query;
  const formRef = useRef(null);

  const { initializeFormEvents } = useFormEvents(form, setForm, doc, setDoc);
  const { isEditing, handleSaveClick } = useFormLogic(
    form,
    setForm,
    data,
    localConfig,
    handleSave
  );
  const { buttons } = useFormButtons(
    form,
    setForm,
    router,
    openModal,
    localAppData?.endpoint,
    setLoading,
    data,
    setData,
    slug,
    setSmsModalOpen,
    setEmailModalOpen,
    setDoc
  );

  useEffect(() => {
    if (slug) {
      initializeFormEvents(slug);
    }
  }, [slug]);

  // if (!slug || !localConfig) {
  //   return null;
  // }

  const ComponentBefore = doc?.componentBefore || null;
  const ComponentAfter = doc?.componentAfter || null;
  const ComponentReplace = doc?.componentReplace || null;

  return (
    <div className="flex flex-col">
      <DocHeader
        isEditing={isEditing}
        handleSaveClick={handleSaveClick}
        title={id || slug || title}
        buttons={buttons}
      />
      <div className="relative z-1 px-4 flex flex-col mt-2 w-full">
        {ComponentBefore && <ComponentBefore />}
        <div className="h-full shadow-md shadow-slate-300">
          {ComponentReplace ? <ComponentReplace /> : <DetailForm />}
        </div>
        {ComponentAfter && <ComponentAfter />}
      </div>
      <SendEmail
        isOpen={emailModalOpen}
        msg="Hi,"
        email={form?.email}
        onRequestClose={() => setEmailModalOpen(false)}
      />
      <SendSms
        isOpen={smsModalOpen}
        msg="Hi,"
        phone={form?.phone}
        onRequestClose={() => setSmsModalOpen(false)}
      />
    </div>
  );
};

export default DoctypeForm;
