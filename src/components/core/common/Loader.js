import React from "react";
import Loading from "../account/Loading";
import { useData } from "@/contexts/DataContext"; // Ensure correct import path

const Loader = () => {
  const { loading } = useData(); // Extract `loading` from context

  return <>{loading && <Loading />}</>;
};

export default Loader;
