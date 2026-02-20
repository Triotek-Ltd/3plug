import React, { useState, useEffect } from "react";
import { postData } from "@/utils/Api";
import { toast } from "react-toastify";
import Modal from "@/components/core/common/modal/Modal";

// Custom styles for the modal
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "1rem",
    padding: "2rem",
    background: "#fff",
    border: "none",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "90%",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

const SendSms = ({ isOpen, onRequestClose, phone, msg }) => {
  const [message, setMessage] = useState(msg);
  const [phoneNumber, setPhoneNumber] = useState(phone);

  useEffect(() => {
    // Update state when props change
    setMessage(msg);
    setPhoneNumber(phone);
  }, [phone, msg]);

  const handleSendSms = async () => {
    // Show sending toast
    const toastId = toast.info("Sending SMS...", { autoClose: false });

    try {
      await postData(
        {
          phone_numbers: [phoneNumber],
          message,
        },
        "sendsms"
      );
      toast.update(toastId, {
        render: "SMS sent successfully!",
        type: "success", // Use "success" directly
        autoClose: 5000, // Close after 5 seconds
        isLoading: false,
      });
      onRequestClose(); // Close the modal on success
    } catch (error) {
      console.error("Failed to send SMS:", error);
      toast.update(toastId, {
        render: "Failed to send SMS. Please try again.",
        type: "error", // Use "error" directly
        autoClose: 5000, // Close after 5 seconds
        isLoading: false,
      });
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onRequestClose}>
      <h2 className="text-2xl font-semibold mb-6">Send SMS</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Phone Number</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows="4"
        />
      </div>
      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={onRequestClose}
          className="uppercase align-middle transition-all border border-solid rounded-lg shadow-none cursor-pointer leading-pro ease-soft-in text-xs bg-150 active:opacity-85 hover:scale-102 tracking-tight-soft bg-x-25 bg-slate-100 text-xl text-slate-700 font-bold px-4 py-2 rounded-lg shadow"
        >
          Cancel
        </button>
        <button
          onClick={handleSendSms}
          className="uppercase align-middle transition-all border border-solid rounded-lg shadow-none cursor-pointer leading-pro ease-soft-in text-xs bg-150 active:opacity-85 hover:scale-102 tracking-tight-soft bg-x-25 bg-fuchsia-500 text-xl text-white font-bold px-4 py-2 rounded-lg shadow"
        >
          Send
        </button>
      </div>
    </Modal>
  );
};

export default SendSms;
