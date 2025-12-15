// src/Pages/PaymentSuccess/PaymentSuccess.jsx
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get("session_id");
  const axios = useAxios();

  useEffect(() => {
    if (session_id) {
      axios
        .post(`/payment-success?session_id=${session_id}`)
        .then((res) => {
          console.log("Payment success recorded:", res.data);
        })
        .catch((err) => {
          console.error("Error recording payment success:", err);
        });
    }
  }, [axios, session_id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-green-200">
        {/* Header with success icon */}
        <div className="bg-green-600 py-8 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 animate-pulse">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-white">Payment Successful!</h1>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <p className="text-gray-700 mb-2">
            Thank you for your generous support!
          </p>
          <p className="text-gray-600 text-sm mb-6">
            Your contribution helps save lives and support our mission.
          </p>

          {/* Optional: Show session ID (remove in production if not needed) */}
          {session_id && (
            <div className="bg-gray-100 text-gray-500 text-xs p-3 rounded-lg mb-6 font-mono">
              Session: {session_id.substring(0, 8)}...
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => window.location.href = "/"}
              className="w-full btn btn-primary"
            >
              Back to Home
            </button>
            <button
              onClick={() => window.location.href = "/funding"}
              className="w-full btn btn-outline"
            >
                Make Another Donation
            </button>
          </div>
        </div>

        {/* Decorative bottom */}
        <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
      </div>
    </div>
  );
}

export default PaymentSuccess;