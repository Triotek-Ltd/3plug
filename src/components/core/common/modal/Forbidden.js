import React from "react";
import Modal from "react-modal";
import Link from "next/link";
import { useRouter } from "next/router";

const ForbiddenModal = ({ isOpen = true }) => {
  const router = useRouter();

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      width: "100vw",
      height: "100vh",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "1rem",
      padding: "2rem",
      background: "#fff",
      border: "none",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(100px)", // Blur effect to the background
    },
  };

  // Close function to go back to the previous page
  const handleClose = () => {
    router.back();
  };

  return (
    <Modal isOpen={isOpen} style={customStyles} contentLabel="Forbidden Modal">
      {/* Forbidden Error Message */}
      <h2 className="text-3xl font-semibold mb-4 text-red-600">
        Forbidden Error
      </h2>
      <p className="mb-6 text-lg">
        You don&apos;t have permission to access this resource.
      </p>

      {/* Confirmation Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleClose}
          className="uppercase align-middle transition-all border border-solid rounded-lg shadow-none cursor-pointer leading-pro ease-soft-in text-xs bg-150 active:opacity-85 hover:scale-102 tracking-tight-soft bg-x-25 bg-gray-500 text-xl text-white font-bold px-4 py-2 rounded-lg shadow"
        >
          Close
        </button>
        {/* Link to Home using Next.js Link */}
        <div className="">
          <Link href="/">
            <div className="text-fuchsia-500 hover:underline text-lg font-semibold">
              Go back to Home
            </div>
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default ForbiddenModal;
