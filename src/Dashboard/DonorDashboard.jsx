// src/Dashboard/DonorDashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const DonorDashboard = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch max 3 recent requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axiosSecure.get("/my-request?size=3&page=0");
        setRequests(res.data.request || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load requests", err);
        toast.error("Failed to load requests");
        setLoading(false);
      }
    };
    fetchRequests();
  }, [axiosSecure]);

  // Handle Done / Cancel
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/donation-request/${id}/update-status`, {
        donation_status: newStatus,
      });
      // Refresh
      const res = await axiosSecure.get("/my-request?size=3&page=0");
      setRequests(res.data.request || []);
      toast.success(`Request marked as ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    try {
      await axiosSecure.delete(`/requests/${id}`);
      setRequests(prev => prev.filter(r => r._id !== id));
      toast.success("Request deleted");
    } catch (err) {
      toast.error("Failed to delete request");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, <span className="text-red-600">{user?.displayName}</span>!
        </h1>
        <p className="text-gray-600">Manage your blood donation requests here.</p>
      </div>

      {/* Recent Requests */}
      {requests.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Your Recent Requests</h2>
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
                {requests.map((req) => (
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
                      <div className="flex flex-wrap gap-1">
                        <Link
                          to={`/donation-request/${req._id}`}
                          className="btn btn-xs btn-outline"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => navigate(`/dashboard/edit-request/${req._id}`)}
                          className="btn btn-xs btn-primary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(req._id)}
                          className="btn btn-xs btn-error"
                        >
                          Delete
                        </button>
                        {req.donation_status === "inprogress" && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(req._id, "done")}
                              className="btn btn-xs btn-success"
                            >
                              Done
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(req._id, "canceled")}
                              className="btn btn-xs btn-error"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View All Button */}
      <div className="text-center">
        <Link
          to="/dashboard/my-donation-requests"
          className="btn btn-primary"
        >
          View My All Requests
        </Link>
      </div>
    </div>
  );
};

export default DonorDashboard;