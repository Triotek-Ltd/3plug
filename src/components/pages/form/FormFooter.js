import { timeAgo } from "@/utils/DateFormat";
import React from "react";

const DocFooter = ({ data }) => (
  <>
    <div className="p-2 align-middle bg-transparent border-t flex items-center text-xs whitespace-nowrap shadow-transparent">
      <span className="inline-block w-1 h-1 rounded-full bg-green-600 mr-1"></span>
      {data?.modified ? timeAgo(data?.modified) : ""}&nbsp; since last edit
    </div>
    <div className="p-2 align-middle bg-transparent flex items-center text-xs whitespace-nowrap shadow-transparent">
      <span className="inline-block w-1 h-1 rounded-full bg-orange-600 mr-1"></span>
      {data?.created ? timeAgo(data?.created) : ""}&nbsp; since creation
    </div>
  </>
);

export default DocFooter;
