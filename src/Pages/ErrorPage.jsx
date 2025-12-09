// Pages/ErrorPage.jsx
import React from "react";
import { useRouteError, Link } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 dark:bg-red-900 text-center p-4">
      <h1 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">Oops!</h1>
      <p className="text-lg text-red-800 dark:text-red-200 mb-6">
        {error.statusText || error.message || "Page not found"}
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default ErrorPage;
