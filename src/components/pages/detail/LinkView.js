import React, { useState, useEffect } from "react";
import { fetchLinkUrl } from "@/components/pages/detail/FetchTable";

const LinkView = ({ field, data }) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const fetchUrl = async () => {
      if (field.doc) {
        const fetchedUrl = await fetchLinkUrl(field.doc.split(".").pop());
        setUrl(fetchedUrl);
      }
    };

    fetchUrl();
  }, [field]);

  if (!url)
    return (
      <a
        className="text-blue-500 hover:text-blue-700"
        target="_blank"
        rel="noopener noreferrer"
      >
        {data[field.id]}
      </a>
    );

  return (
    <a
      href={`/${url}/${data[field.id]}`}
      className="text-blue-500 hover:text-blue-700"
      target="_blank"
      rel="noopener noreferrer"
    >
      {data[field.id]}
    </a>
  );
};

export default LinkView;
