
import React from "react";
import { useRouteError, Link } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  // Determine error type
  const is404 = error?.status === 404;
  const title = is404 ? "Page Not Found" : "Something Went Wrong";
  const message = is404 
    ? "The page you're looking for doesn't exist." 
    : error?.message || "We couldn't load this page. Please try again later.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex flex-col items-center justify-center p-4">
      {/* Decorative Blob (from haikei.app style) */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-md text-center z-10">
        {/* Blood Drop Icon (symbolic for your app) */}
        <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-red-800 mb-4">
          {title}
        </h1>
        <p className="text-gray-600 mb-8 px-2">
          {message}
        </p>

        
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-red-600 text-white font-medium rounded-full shadow-lg hover:bg-red-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
        >
          ← Back to Home
        </Link>

        {/* Footer note (from devmeetsdevs.com minimalist style) */}
        <p className="mt-8 text-sm text-gray-500">
          BloodBridge • Saving lives, one drop at a time
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;