import { useState, useEffect } from "react";
import { postData, updateData } from "@/utils/Api";
import { getFromDB } from "@/utils/indexedDB";
import { toast } from "react-toastify";
import useLoadingOffloadingKeyEvents from "@/hooks/useLoadingOffloadingKeyEvents";
import { useConfig } from "@/contexts/ConfigContext";
import { useData } from "@/contexts/DataContext";
import { useRouter } from "next/router";
import PrimaryButton1 from "@/components/core/common/buttons/Primary1";

export const useStatusHandler = (dashboardText) => {
  const router = useRouter();
  const { slug, id } = router?.query;
  const { localConfig: config, localAppData } = useConfig();
  const { data } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    message: null,
    title: "",
    onProceed: () => {},
  });
  const [perms, setPerms] = useState(null);
  const [canEdit, setCanEdit] = useState(null);
  const [canDelete, setCanDelete] = useState(null);

  const currentStatusConfig = config?.workflow?.find(
    (statusConfig) =>
      statusConfig.name.toString() ===
      (typeof data?.status === "string"
        ? data.status.trim()
        : data?.status?.toString())
  );

  const currentStatus = currentStatusConfig?.name?.trim();
  const nextStatus = currentStatusConfig?.nextStatus?.trim();
  const action = currentStatusConfig?.actions[0];

  const handleErrorResponse = (res) => {
    if (res?.error) {
      const list = res?.message?.data;
      if (list) {
        setIsLoading(false);
      }
      console.log("list", list);

      const tailwindList = (
        <ul className="list-inside space-y-1.5 w-full">
          {list?.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-purple-50 border-l-4 border-pink-500 text-green-700 p-1 text-xs rounded-md shadow-sm"
            >
              <div>
                {item.id} - <span className="text-purple-900">{item.name}</span>
              </div>
              <div
                onClick={(e) => {
                  e.currentTarget.style.display = "none"; // Hide the div on click
                  handleScannedCode(item.id);
                }}
              >
                <PrimaryButton1 text={`+ Add`} />
              </div>
            </li>
          ))}
        </ul>
      );

      return new Promise((resolve) => {
        const handleModalClose = () => {
          setErrorModal({
            isOpen: false,
            onRequestClose: handleModalClose,
            message: tailwindList,
            title: res?.message?.error,
            onProceed: handleProceedAnyway,
          });
          resolve(true); // Resolves with true when the modal is closed
        };

        const handleProceedAnyway = () => {
          setErrorModal({
            isOpen: false,
            onRequestClose: handleModalClose,
            message: tailwindList,
            title: res?.message?.error,
            onProceed: handleProceedAnyway,
          });
          resolve(false); // Resolves with false when proceeding anyway
        };

        setErrorModal({
          isOpen: true,
          onRequestClose: handleModalClose,
          message: tailwindList,
          title: res?.message?.error,
          onProceed: handleProceedAnyway,
        });
      });
    }
    return Promise.resolve(false); // Return false if no error
  };

  const updateStatus = async () => {
    try {
      let postDataPayload, endpoint;
      setIsLoading(true);

      if (nextStatus === "In Transit") {
        await postData(
          { crossborder_id: id, action: "Transit" },
          "method/masafa/api/masafa/TransitCrossborder/"
        );
      } else if (nextStatus === "Offloaded") {
        postDataPayload = { crossborder_id: id, action: "Offload" };
        endpoint = "method/masafa/api/masafa/TransitCrossborder/";
      } else if (nextStatus === "Dispatched") {
        postDataPayload = { item_id: id };
        endpoint = "method/masafa/api/masafa/ItemDispatch";
      }

      if (endpoint) {
        const res = await postData(postDataPayload, endpoint);
        const shouldProceed = await handleErrorResponse(res);

        if (shouldProceed) {
          return shouldProceed;
        }
      }

      const response = await updateData(
        { status: nextStatus },
        `${localAppData?.app_id}/${slug}/${id}`
      );
      if (response?.data) router.reload();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScannedCode = async (code) => {
    const extractedCode = code.split("/").pop();
    let response;
    try {
      switch (currentStatus) {
        case "Loading":
          response = await postData(
            {
              item_id: extractedCode,
              crossborder_id: id,
              action: "Load",
            },
            "method/masafa/api/masafa/AddItemToCrossborder"
          );
          break;
        case "Offloading":
          response = await postData(
            {
              item_id: extractedCode,
              crossborder_id: id,
              action: "Offload",
            },
            "method/masafa/api/masafa/AddItemToCrossborder"
          );
          break;
        case "Adding Items":
          response = await postData(
            { item_id: extractedCode, dispatch_id: id },
            "method/masafa/api/masafa/AddItemToCrossborder"
          );
          break;
      }
      if (response?.data)
        toast.success(`${extractedCode} - ${response.data.message}`);
    } catch (error) {
      // toast.error(`Error: ${error.message}`);
    }
  };

  useLoadingOffloadingKeyEvents(currentStatus, handleScannedCode);

  useEffect(() => {
    (async () => {
      const perm = await getFromDB("permissions");
      setPerms(perm);
    })();
  }, [router]);

  useEffect(() => {
    if (perms != null) {
      setCanEdit(
        perms === "all" ||
          perms.includes(`change_${dashboardText?.toLowerCase()}`)
      );
      setCanDelete(
        perms === "all" ||
          perms.includes(`delete_${dashboardText?.toLowerCase()}`)
      );
    }
  }, [dashboardText, perms]);

  return {
    isLoading,
    errorModal,
    updateStatus,
    handleScannedCode,
    currentStatus,
    canEdit,
    canDelete,
    action,
  };
};
