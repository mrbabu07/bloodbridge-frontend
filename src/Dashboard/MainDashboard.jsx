// src/Dashboard/MainDashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";

const MainDashboard = () => {
  const { role } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFunding: 0,
    totalRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only admin/volunteer see stats (but donor sees welcome msg too)
    const fetchStats = async () => {
      try {
        const [usersRes, fundingRes, requestsRes] = await Promise.all([
          axiosSecure.get("/users"),
          axiosSecure.get("/funding/summary"),
          axiosSecure.get("/donation-request?field=count"),
        ]);

        setStats({
          totalUsers: usersRes.data.length,
          totalFunding: fundingRes.data.total || 0,
          totalRequests: requestsRes.data.count || 0,
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to load stats", err);
        setLoading(false);
      }
    };

    if (role === "admin" || role === "volunteer") {
      fetchStats();
    } else {
      setLoadinG(false); 
    }
  }, [role, axiosSecure]);

  return (
    <div>
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome to your Dashboard!
        </h1>
        <p className="text-gray-600">Manage your blood donation activities here.</p>
      </div>

      {/* Stats Cards (Admin & Volunteer Only) */}
      {(role === "admin" || role === "volunteer") && (
        <div>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <span className="loading loading-spinner text-primary"></span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Users */}
              <div className="bg-white p-6 rounded-lg shadow flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-6-6v1z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
              </div>

              {/* Total Funding */}
              <div className="bg-white p-6 rounded-lg shadow flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500">Total Funding (USD)</p>
                  <p className="text-2xl font-bold">${stats.totalFunding.toLocaleString()}</p>
                </div>
              </div>

              {/* Total Requests */}
              <div className="bg-white p-6 rounded-lg shadow flex items-center">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500">Total Requests</p>
                  <p className="text-2xl font-bold">{stats.totalRequests}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Donor: No stats, just welcome */}
      {role === "donor" && (
        <div className="text-center py-8 text-gray-600">
          <p>You can manage your blood donation requests from the sidebar.</p>
        </div>
      )}
    </div>
  );
};

export default MainDashboard;