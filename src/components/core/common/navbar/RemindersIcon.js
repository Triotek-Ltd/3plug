import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { fetchData } from "@/utils/Api"; // Assuming your fetchData method is correctly implemented
import NotificationModal from "./NotificationModal"; // Import the modal component
import { useData } from "@/contexts/DataContext";

const RemindersIcon = () => {
  const [remindersCount, setRemindersCount] = useState(0);
  const [reminders, setReminders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setNotifications } = useData();

  const fetchReminders = async () => {
    const responseData = await fetchData(
      { _sort_field: "next_run", _sort_order: "asc", page_length: 150 },
      "core/reminder"
    );

    if (responseData?.data) {
      const data = responseData?.data;
      setNotifications(data?.data);

      // Filter the reminders to get those within the next 2 weeks
      const twoWeeksFromNow = new Date();
      twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
      const upcomingReminders = data?.data?.filter((reminder) => {
        const nextRunDate = new Date(reminder.next_run);
        return nextRunDate <= twoWeeksFromNow && nextRunDate >= new Date();
      });

      // Set the number of upcoming reminders
      setRemindersCount(upcomingReminders.length);
      setReminders(upcomingReminders);
    }
  };

  useEffect(() => {
    fetchReminders(); // Initial fetch

    // Set an interval to refetch reminders every 1 minute (60000 ms)
    const interval = setInterval(() => {
      fetchReminders();
    }, 150000); // 1 minute interval

    // Cleanup the interval when the component is unmounted or when the modal is closed
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="relative flex items-center justify-center cursor-pointer"
      onClick={() => setIsModalOpen(true)}
    >
      <FontAwesomeIcon
        icon={faBell}
        className="text-indigo-600 cursor-pointer hover:text-yellow-400 transition duration-300 ease-in-out transform hover:scale-125"
        size="xl"
      />
      {remindersCount > 0 && (
        <span className="absolute bottom-2 left-2 inline-block w-4 md:w-6 h-4 md:h-6 flex items-center justify-center text-xs font-semibold text-white bg-gradient-to-r from-yellow-400 to-yellow-500 border-2 border-white rounded-full shadow-lg animate-pulse">
          {remindersCount}
        </span>
      )}

      {/* Modal component */}
      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close modal function
        reminders={reminders} // Pass reminders to the modal
      />
    </div>
  );
};

export default RemindersIcon;
