import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const statuses = ["all", "pending", "inprogress", "done", "canceled"];

const MyRequest = () => {
  const [myRequest, setMyRequest] = useState([]);
  const [totalRequest, setTotalRequest] = useState(0);
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 5;

  const axiosSecure = useAxiosSecure();

  const fetchMyRequest = async (page = 0, size = requestsPerPage) => {
    try {
      const res = await axiosSecure.get(
        `/my-request?page=${page}&size=${size}`
      );
      setMyRequest(res.data.request);
      setTotalRequest(res.data.totalRequest);
    } catch (err) {
      console.error("Failed to load requests", err);
    }
  };

  useEffect(() => {
    fetchMyRequest(currentPage -1);
  }, [axiosSecure, currentPage]);

  // Filtered requests
  const filteredRequests =
    filteredStatus === "all"
      ? myRequest
      : myRequest.filter((req) => req.donation_status === filteredStatus);

  const totalPages = Math.ceil(totalRequest / requestsPerPage);

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Blood Requests 🩸</h2>

      {/* Status Filter */}
      <div className="mb-4 flex gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            className={`btn btn-sm ${
              filteredStatus === status ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => {
              setFilteredStatus(status);
              setCurrentPage(1); // reset page when filter changes
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Recipient</th>
            <th>Blood</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredRequests.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                No requests found
              </td>
            </tr>
          ) : (
            filteredRequests.map((req, index) => (
              <tr key={req._id}>
                <td>{(currentPage - 1) * requestsPerPage + index + 1}</td>
                <td>{req.recipientName}</td>
                <td>{req.blood_group}</td>
                <td>
                  {req.district}, {req.upazila}
                </td>
                <td>{req.donation_date}</td>
                <td>{req.donation_time}</td>
                <td>
                  <span
                    className={`badge ${
                      req.donation_status === "pending"
                        ? "badge-warning"
                        : req.donation_status === "done"
                        ? "badge-success"
                        : req.donation_status === "canceled"
                        ? "badge-error"
                        : "badge-info"
                    }`}
                  >
                    {req.donation_status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        <button
          className="btn btn-sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`btn btn-sm ${
              currentPage === i + 1 ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="btn btn-sm"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MyRequest;
