import React, { useEffect, useState } from "react";
import { fetchData } from "@/utils/Api";
import { toast } from "react-toastify";
import { toCamelCase } from "@/utils/textConvert";
import { timeAgo } from "@/utils/DateFormat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faUser, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { findDocDetails } from "@/utils/findDocDetails";
import { motion } from "framer-motion";
import DocFooter from "./FormFooter";
import { useData } from "@/contexts/DataContext";

const DocumentLogs = () => {
  const [logs, setLogs] = useState([]);
  const { data } = useData();

  const router = useRouter();
  const { slug, id } = router.query;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const docData = findDocDetails(slug);
        if (!docData) throw new Error("Failed to fetch document details");
        if (docData) {
          const response = await fetchData(
            {
              model_name: docData?.doc?.model,
              object_id: id,
              _sort_field: "timestamp",
            },
            `changelogs`
          );
          if (response?.data) {
            setLogs(response.data.data);
          }
        }
      } catch (error) {
        toast.error(`Failed to fetch logs, ${error.message || error}`);
      }
    };

    fetchLogs();
  }, [id, slug]);

  return (
    <motion.div
      className="p-4 my-4 bg-white rounded-lg shadow-lg border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
        <FontAwesomeIcon icon={faEdit} className="text-blue-500 mr-2" />
        Logs
      </h2>
      <ul className="space-y-2">
        {logs?.length > 0 ? (
          logs?.map((log, index) => (
            <motion.li
              key={index}
              className={`p-4 border border-gray-300 rounded-lg shadow-sm ${
                index % 2 === 0 ? "bg-pink-50" : "bg-slate-50"
              } hover:bg-gray-100 transition-colors`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 flex items-center">
                  <FontAwesomeIcon
                    icon={faClock}
                    className="text-gray-500 mr-1"
                  />
                  {new Date(log.timestamp).toLocaleString()} &nbsp;
                  <span className="text-purple-600 font-medium">
                    ({timeAgo(log.timestamp)})
                  </span>
                </span>
                <span className="text-sm text-yellow-500 font-medium flex items-center">
                  <FontAwesomeIcon icon={faUser} className="mr-1" />
                  {log.user}
                </span>
              </div>
              <div className="text-xs text-gray-800">
                {Object.entries(log.changes).map(([field, change], index) => (
                  <div key={index}>
                    <strong className="font-semibold text-gray-900">
                      {field}
                    </strong>{" "}
                    changed from{" "}
                    <span className="text-red-600 font-medium">
                      {change?.old || "Null"}
                    </span>{" "}
                    to{" "}
                    <span className="text-green-600 font-medium">
                      {change.new}
                    </span>
                  </div>
                ))}
              </div>
            </motion.li>
          ))
        ) : (
          <li className="text-gray-500 text-center py-2">
            <FontAwesomeIcon icon={faEdit} className="text-gray-400 mr-2" />
            No logs available
          </li>
        )}
      </ul>
      <DocFooter data={data} />
    </motion.div>
  );
};

export default DocumentLogs;
