// components/core/DocHeader.js

import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavbar } from "@/contexts/NavbarContext";
import { getFromDB } from "@/utils/indexedDB";
import Loading from "@/components/core/account/Loading";
import { useRouter } from "next/navigation";
import ButtonGroup from "../buttons/ButtonGroup";
import PrimaryButton from "../buttons/Primary";
import Link from "next/link";
import { toTitleCase } from "@/utils/textConvert";
import { useRouter as useRt } from "next/router";
import { toast } from "react-toastify";
import { postData } from "@/utils/Api";
import { useStatusHandler } from "@/custom/masafa";
import useLoadingOffloadingKeyEvents from "@/hooks/useLoadingOffloadingKeyEvents";
import CustomMessageModal from "../modal/CustomMessageModal";

const DocHeader = ({
  title,
  link = "#",
  subtitle,
  tabs,
  handleTabClick,
  selectedTab,
  isEditing,
  handleSaveClick,
  actions = [],
  buttons = [],
  config,
  data,
}) => {
  const componentRef = useRef();
  const { dashboardText } = useNavbar();
  const [perms, setPerms] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const rt = useRt();

  const { slug, id } = rt?.query;

  const { errorModal, currentStatus, action, updateStatus, handleScannedCode } =
    useStatusHandler(dashboardText);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const perm = await getFromDB("permissions");
      setPerms(perm);
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (perms != null && perms === "all") {
      setCanEdit(true);
      setCanDelete(true);
    } else if (perms != null) {
      const permission = `${dashboardText?.toLowerCase()}_change`;
      setCanEdit(perms?.includes(permission));
      setCanDelete(perms?.includes(`${dashboardText?.toLowerCase()}_delete`));
    }
  }, [perms, dashboardText]);

  useLoadingOffloadingKeyEvents("Loading", handleScannedCode);

  return (
    <>
      {isLoading && <Loading />}
      <div
        className="relative flex items-center mx-4 mt-4 md:mt-0 p-0 bg-center bg-cover min-h-14 rounded-2xl"
        style={{
          backgroundImage: `url('/img/curved-images/curved0.jpg')`,
          backgroundPositionY: "50%",
        }}
      >
        <span className="absolute inset-y-0 w-full h-full bg-center bg-cover bg-gradient-to-tl from-purple-700 to-pink-500 opacity-60 rounded-xl"></span>
      </div>
      <div
        style={{
          zIndex: 2,
        }}
        className="relative flex flex-col flex-auto min-w-0 px-4 py-1 mx-6 -mt-10 break-words border-0 shadow-blur rounded-2xl bg-white/80 bg-clip-border backdrop-blur-2xl backdrop-saturate-200"
      >
        <div className="flex flex-wrap -mx-3 min-h-12 justify-between">
          {/* <div className="flex-none w-auto max-w-full px-3">
            <div className="text-base ease-soft-in-out h-8.5 w-8.5 relative inline-flex items-center justify-center rounded-xl text-white transition-all duration-200">
              <img
                src="/img/favicon.png"
                alt="profile_image"
                className="w-full shadow-soft-sm rounded-xl"
              />
            </div>
          </div> */}
          <div className="flex-none w-auto max-w-full px-3 my-auto">
            <div className="h-full">
              <Link href={link}>
                <h5 className="mb-1 text-gray-900 font-bold">
                  {toTitleCase(title)}
                </h5>
              </Link>
              <p className="mb-0 font-semibold leading-normal text-sm">
                {subtitle}
              </p>
            </div>
          </div>
          <div className="px-2 md:px-3 flex flex-wrap items-center justify-end w-fit">
            <div className="relative right-0 flex flex-wrap items-center justify-end w-full">
              <ul className="relative flex flex-wrap p-1 list-none bg-transparent">
                {tabs?.map((tab) => (
                  <li
                    key={tab.name}
                    className="z-30 flex-auto text-center cursor-pointer"
                  >
                    <a
                      onClick={() => handleTabClick(tab.name)}
                      className={`z-30 block w-full px-4 py-1 mb-0 transition-all border-0 rounded-lg ease-soft-in-out ${
                        selectedTab === tab.name
                          ? "bg-white text-slate-700"
                          : "bg-inherit text-slate-700"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={tab.icon}
                        className="text-slate-700"
                      />
                      <span className="ml-1">{tab.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap space-x-2 w-full items- w-fit justify-start md:justify-end">
                {action && (
                  <PrimaryButton text={action} onClick={updateStatus} />
                )}
                {/* Pass buttons array to ButtonGroup */}
                <ButtonGroup buttons={buttons} />
                {isEditing && handleSaveClick && (
                  <button type="button" onClick={handleSaveClick}>
                    <PrimaryButton
                      text="Save"
                      className="flex items-center justify-center p-1"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {errorModal.isOpen && (
        <CustomMessageModal
          isOpen={errorModal.isOpen}
          onRequestClose={errorModal.onRequestClose}
          message={errorModal.message}
          title={errorModal.title}
          onProceed={errorModal.onProceed}
        />
      )}
    </>
  );
};

export default DocHeader;
