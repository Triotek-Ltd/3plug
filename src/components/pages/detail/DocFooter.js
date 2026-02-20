import { fetchData } from "@/utils/Api";
import { timeAgo } from "@/utils/DateFormat";
import React, { useEffect, useState } from "react";

const DocFooter = ({ data }) => {
  const [user, setUser] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetchData({ user: data?.creater_user }, "getuser");
      if (response.data) {
        setUser(response.data);
      }
    };
    fetchUser();
  }, [data.creater_user]);

  return (
    <>
      <div className="p-2 align-middle bg-transparent border-t flex items-center text-xs whitespace-nowrap shadow-transparent">
        <span className="inline-block w-1 h-1 rounded-full bg-green-600 mr-1"></span>
        Last edit at {data?.modified_at ? timeAgo(data?.modified_at) : ""}&nbsp;
      </div>
      <div className="p-2 align-middle bg-transparent flex items-center text-xs whitespace-nowrap shadow-transparent">
        <span className="inline-block w-1 h-1 rounded-full bg-orange-600 mr-1"></span>
        Created at {data?.created_at ? timeAgo(data?.created_at) : ""}&nbsp; by{" "}
        {user?.first_name
          ? `${user.first_name} ${user.last_name} (${user?.username})`
          : user?.username}
      </div>
    </>
  );
};

export default DocFooter;
