import { useData } from "@/contexts/DataContext";
import Link from "next/link";
import React from "react";
import { formatDistanceToNow } from "date-fns";

const ProfileMessages = () => {
  const { notifications } = useData();

  return (
    <div className="w-full px-4 lg-max:mt-6">
      <div className="relative flex flex-col h-full min-w-0 break-words bg-white border-0 shadow-lg rounded-2xl bg-clip-border">
        <div className="p-4 pb-0 mb-0 bg-pink-50 border-b-0 rounded-t-2xl">
          <h6 className="mb-0 text-lg font-semibold text-blue-800">
            Profile Messages
          </h6>
        </div>
        <div className="flex-auto p-4 overflow-auto max-h-[calc(100vh-30rem)]">
          {notifications && notifications.length > 0 ? (
            <ul className="flex flex-col pl-0 mb-0 rounded-lg space-y-2">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className="relative flex items-center px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
                >
                  <div
                    className="flex-shrink-0 w-12 h-12 mr-4 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{
                      backgroundColor: getNotificationColor(notification),
                    }}
                  >
                    {notification.name
                      ? notification.name.charAt(0).toUpperCase()
                      : "N"}
                  </div>
                  <div className="flex flex-col flex-grow">
                    <h6 className="mb-1 text-base font-medium text-blue-700">
                      {notification.name || "Notification"}
                    </h6>
                    <p className="text-sm text-gray-800 mt-1">
                      {notification.message ||
                        "No additional details available."}
                    </p>
                    {notification.next_run && (
                      <p className="text-xs italic text-green-900 mt-1">
                        {new Date(notification.next_run).toLocaleString()} (
                        {formatDistanceToNow(new Date(notification.next_run))}{" "}
                        from now)
                      </p>
                    )}
                  </div>
                  <Link
                    className="ml-auto py-1 px-3 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 transition-all duration-200"
                    href={`/app/reminder/${notification.id}`}
                  >
                    View
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">
              No notifications available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const getNotificationColor = (notification) => {
  if (notification.name?.toLowerCase().includes("alert")) return "#fecaca"; // Red
  if (notification.name?.toLowerCase().includes("update")) return "#bfdbfe"; // Blue
  if (notification.name?.toLowerCase().includes("delivered")) return "#bbf7d0"; // Green
  return "#e0e7ff"; // Default
};

export default ProfileMessages;
