import React from "react";

import { useRouter } from "next/router";
import PrimaryButton from "./buttons/Primary";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="text-6xl text-red-500">
        <i className="fas fa-exclamation-triangle"></i>
      </div>
      <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>

      <PrimaryButton text="Go Home" onClick={() => router.push("/")} />
    </div>
  );
};

export default NotFoundPage;
