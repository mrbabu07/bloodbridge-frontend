// src/Dashboard/VolunteerDashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const VolunteerDashboard = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch paginated requests
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get(
          `/donation-requests?page=${currentPage}&size=8`
        );
        setRequests(res.data.requests || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Failed to load requests", err);
        toast.error("Failed to load requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [axiosSecure, currentPage]);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, <span className="text-red-600">{user?.displayName}</span>!
        </h1>
        <p className="text-gray-600">View and manage blood donation requests.</p>
      </div>

      {/* All Requests Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">All Blood Donation Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="text-left text-gray-500 text-sm">
                <th>Recipient</th>
                <th>Location</th>
                <th>Blood Group</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    <span className="loading loading-spinner text-primary"></span>
                  </td>
                </tr>
              ) : requests.length > 0 ? (
                requests.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50">
                    <td className="font-medium">{req.recipientName}</td>
                    <td>{req.district}, {req.upazila}</td>
                    <td>
                      <span className="badge badge-error">{req.blood_group}</span>
                    </td>
                    <td>
                      <div>{req.donation_date}</div>
                      <div className="text-sm text-gray-500">{req.donation_time}</div>
                    </td>
                    <td>
                      <span className={`badge ${
                        req.donation_status === "pending" ? "badge-warning" :
                        req.donation_status === "inprogress" ? "badge-info" :
                        req.donation_status === "done" ? "badge-success" : "badge-error"
                      }`}>
                        {req.donation_status}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/donation-request/${req._id}`}
                        className="btn btn-xs btn-outline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No donation requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Pagination (from devmeetsdevs.com → "Pagination" section) */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-6 bg-gray-50">
            <button
              className="btn btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              ← Prev
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  className={`btn btn-sm ${
                    currentPage === pageNum ? "btn-error" : "btn-outline"
                  }`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              className="btn btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerDashboard;