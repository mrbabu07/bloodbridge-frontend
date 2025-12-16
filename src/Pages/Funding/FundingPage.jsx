// src/Pages/Funding/Funding.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const FundingPage = () => {
  const { user } = useContext(AuthContext);
  const axios = useAxiosSecure();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalFunds, setTotalFunds] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data when currentPage changes
  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      try {
        // ✅ Fetch paginated records + total funds
        const [recordsRes, summaryRes] = await Promise.all([
          axios.get(`/payment-records?page=${currentPage}&size=8`),
          axios.get("/funding/summary"),
        ]);

        setDonations(recordsRes.data.donations || []);
        setTotalFunds(summaryRes.data.total || 0);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load funding data");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [axios, currentPage]); // ✅ currentPage in dependency array

  const handleGiveFund = () => {
    if (!user) {
      toast.error("Please log in to donate");
      navigate("/login");
      return;
    }
    navigate("/funding/donate");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Support Our Mission</h1>
          <p className="text-gray-600">
            Your donation helps us maintain this platform and support blood donation drives across Bangladesh.
          </p>
        </div>
        <button
          onClick={handleGiveFund}
          className="btn btn-error text-white px-6"
        >
          💉 Give Fund
        </button>
      </div>

      {/* Total Funds Banner (from haikei.app style) */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded">
        <p className="text-red-800 font-medium">
          🩸 Total Funds Raised: <span className="text-xl font-bold">৳{totalFunds.toLocaleString()}</span>
        </p>
      </div>

      {/* Donations Table (from devmeetsdevs.com → "Featured Testimonials") */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>Donor</th>
              <th>Amount (BDT)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-8">
                  <span className="loading loading-spinner text-primary"></span>
                </td>
              </tr>
            ) : donations.length > 0 ? (
              donations.map((donation, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td>
                    <div className="font-medium">{donation.donorName || "Anonymous"}</div>
                    <div className="text-sm text-gray-500">{donation.donorEmail}</div>
                  </td>
                  <td className="font-bold">৳{donation.amount?.toLocaleString()}</td>
                  <td>
                    {donation.createdAt
                      ? new Date(donation.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-8 text-gray-500">
                  No donations yet. Be the first supporter!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination (from devmeetsdevs.com → "Pagination" section) */}
      {donations.length > 0 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            className="btn btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            ← Prev
          </button>

          {[1, 2, 3].map((pageNum) => (
            <button
              key={pageNum}
              className={`btn btn-sm ${currentPage === pageNum ? "btn-error" : "btn-outline"}`}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </button>
          ))}

          <button
            className="btn btn-sm"
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default FundingPage;