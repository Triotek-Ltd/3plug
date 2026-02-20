import React, { useEffect, useState, useRef } from "react";
import { fetchData, updateData, deleteData } from "@/utils/Api";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import ProfileInfo from "@/components/core/account/ProfileInfo";
import ProfileEditForm from "@/components/core/account/ProfileEditForm"; // Import the new edit form component
import Messages from "@/components/core/account/ProfileMessages";
import ProfileSettings from "@/components/core/account/ProfileSettings";
import ConfirmationModal from "@/components/core/common/modal/ConfirmationModal"; // Make sure this path is correct
import PrimaryButton from "@/components/core/common/buttons/Primary";
import { useSidebar } from "@/contexts/SidebarContext";
import { useNavbar } from "@/contexts/NavbarContext";

const ProfilePage = () => {
  const {
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
  } = useNavbar();
  const { setSidebarHidden, setSidebarWidth } = useSidebar();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    bio: "",
    phone: "",
    location: "",
    password: "",
  });

  updatePagesText("Profile");
  updateDashboardText("Profile");
  updateTextColor("text-white");
  updateIconColor("text-blue-200");
  setSidebarHidden(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetchData({}, `profile`);
        if (response?.data) {
          setProfileData(response.data);
        }
      } catch (error) {
        toast.error(`Failed to fetch profile data: ${error.message || error}`);
      }
    };

    fetchProfileData();
  }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  const getChangedFields = (formData) => {
    const changedFields = {};
    Object.keys(formData).forEach((key) => {
      if (profileData[key] !== formData[key]) {
        changedFields[key] = formData[key];
      }
    });
    return changedFields;
  };

  const handleFormSubmitSuccess = (formData) => {
    handleUpdate(formData);
  };
  const handleSaveClick = () => {
    handleUpdate(formData);
  };

  const handleUpdate = async (formData) => {
    try {
      const changedFields = getChangedFields(formData);
      if (Object.keys(changedFields).length) {
        const response = await updateData(changedFields, `profile`);

        if (response?.status === 200) {
          toast.success("Profile updated successfully!");
          setIsEditing(false);
        } else {
          toast.error("Failed to update profile.");
        }
      }
    } catch (error) {
      toast.error(`Failed to update profile: ${error.message || error}`);
    }
  };

  const confirmDelete = async () => {
    setIsModalOpen(false);
    try {
      await deleteData(`/profiles/${profileData?.id}`);
      toast.success("Profile deleted successfully!");
      router.push("/profiles"); // Redirect to the profiles list or home
    } catch (error) {
      toast.error(`Failed to delete profile: ${error.message || error}`);
    }
  };

  return (
    <>
      <div className="-mt-2 overflow-auto max-h-[calc(100vh-10rem)]">
        <div className="w-full px-6 mx-auto">
          <div
            className="relative flex items-center p-0 mt-4 overflow-hidden bg-center bg-cover min-h-16 rounded-2xl"
            style={{
              backgroundImage: `url('/img/curved-images/curved0.jpg')`,
              backgroundPositionY: "50%",
            }}
          >
            <span className="absolute inset-y-0 w-full h-full bg-center bg-cover bg-gradient-to-tl from-purple-700 to-pink-500 opacity-60"></span>
          </div>
          <div className="relative flex flex-col flex-auto min-w-0 p-2 mx-2 -mt-12 overflow-hidden break-words border-0 shadow-blur rounded-2xl bg-white/80 bg-clip-border backdrop-blur-2xl backdrop-saturate-200">
            <div className="flex flex-wrap -mx-3">
              <div className="flex-none w-auto max-w-full px-3">
                {/* <div className="text-base ease-soft-in-out h-18.5 w-18.5 relative inline-flex items-center justify-center rounded-xl text-white transition-all duration-200">
                  <img
                    src={profileData?.profile_picture || "/img/bruce-mars.jpg"}
                    alt="profile_image"
                    className="w-full shadow-soft-sm rounded-xl"
                  />
                </div> */}
              </div>
              <div className="flex-none w-auto max-w-full px-3 my-auto">
                <div className="h-full">
                  <h5 className="mb-1">
                    {profileData?.first_name ||
                      profileData?.username ||
                      "John Doe"}
                  </h5>
                  <p className="mb-0 font-semibold leading-normal text-sm">
                    {profileData?.role || "Role"}
                  </p>
                </div>
              </div>
              <div className="w-full max-w-full px-3 mx-auto gap-x-4 mt-4 sm:my-auto sm:mr-0 md:w-1/2 md:flex-none lg:w-4/12 flex justify-end">
                {isEditing ? (
                  <>
                    <div onClick={handleEditClick}>
                      <PrimaryButton
                        text="Close"
                        className="flex items-center justify-center p-1"
                      />
                    </div>
                    <button type="button" onClick={handleSaveClick}>
                      <PrimaryButton
                        text="Save"
                        className="flex items-center justify-center p-1"
                      />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={isEditing ? handleSaveClick : handleEditClick}
                  >
                    <PrimaryButton
                      text={isEditing ? "Save" : "Edit"}
                      className="flex items-center justify-center p-1"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full px-6 py-2 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 -mx-3 gap-2">
            {isEditing ? (
              <ProfileEditForm
                ref={formRef}
                user={profileData}
                onSubmit={handleUpdate}
                formData={formData}
                setFormData={setFormData}
              />
            ) : (
              <>
                <ProfileInfo userData={profileData} />

                <Messages profileData={profileData} />
              </>
            )}
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default ProfilePage;
