import { postData } from "@/utils/Api";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Confirmation from "@/components/core/common/modal/Confirmation";
import ConfirmationModal from "../common/modal/CustomConfirmationModal";

const Logout = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleLogout = async () => {
    try {
      const response = await postData({}, "logout");
      if (response) {
        destroyCookie(null, "token");
        destroyCookie(null, "username");
        // Refresh the page after logout using window.location.reload()
        // window.location.reload();
        router.push("/login");
      } else {
        toast.info("", {
          render: `Logout failed: ${response?.message}`,
          type: "error",
          autoClose: false,
        });
      }
    } catch (error) {
      toast.info("", {
        render: `Logout failed: ${error}`,
        type: "error",
        autoClose: false,
      });
    }
  };

  return (
    <ConfirmationModal
      title={"Logout"}
      content={"Are you sure?"}
      onConfirm={handleLogout}
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
    />
  );
};

export default Logout;
