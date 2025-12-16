// src/Pages/Donate/DonationRequest.jsx
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios"; // ⚠️ useAxios (not secure) for public page
import { AuthContext } from "../../Context/AuthProvider";

const DonationRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const axios = useAxios(); // Public API → no auth needed
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/donation-requests?status=pending&page=${currentPage}&size=8`);
        setRequests(res.data.requests);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [axios, currentPage]);

  const handleView = (id) => {
    if (!user) {
      navigate("/login", { state: { from: `/donation-request/${id}` } });
    } else {
      navigate(`/donation-request/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-red-800 mb-2">
            🩸 Pending Blood Requests
          </h1>
          <p className="text-gray-600">
            These lives are waiting for your help.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner text-red-600"></span>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No pending requests found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th>Recipient</th>
                    <th>Location</th>
                    <th>Blood Group</th>
                    <th>Date & Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req._id} className="hover:bg-gray-50">
                      <td className="font-medium">{req.recipientName}</td>
                      <td>{req.district}, {req.upazila}</td>
                      <td>
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          {req.blood_group}
                        </span>
                      </td>
                      <td>
                        <div>{req.donation_date}</div>
                        <div className="text-xs text-gray-500">{req.donation_time}</div>
                      </td>
                      <td>
                        <button
                          onClick={() => handleView(req._id)}
                          className="btn btn-xs btn-error text-white"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ✅ Pagination (UX Improvement) */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 py-6">
              <button
                className="btn btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                ← Prev
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                return (
                  <button
                    key={pageNum}
                    className={`btn btn-sm ${currentPage === pageNum ? "btn-error" : "btn-outline"}`}
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
    </div>
  );
};

export default DonationRequest;