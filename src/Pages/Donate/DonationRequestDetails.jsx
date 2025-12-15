// src/Pages/Donate/DonationRequestDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../Context/AuthProvider";
import { useContext } from "react";
import toast from "react-hot-toast";

const DonationRequestDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    axiosSecure
      .get(`/donation-request/${id}`)
      .then((res) => {
        setRequest(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading request:", err);
        setLoading(false);
        toast.error("Failed to load request");
      });
  }, [id, axiosSecure]);

  const handleDonate = () => {
    if (!user) {
      toast.error("Please log in to donate");
      navigate("/login");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmDonation = async () => {
    if (!user || !request) return;

    setConfirming(true);
    try {
      // Send donation confirmation to backend
      await axiosSecure.patch(`/donation-request/${id}/donate`, {
        donorName: user.displayName,
        donorEmail: user.email,
        donation_status: "inprogress",
      });

      // Update local state
      setRequest((prev) => ({
        ...prev,
        donation_status: "inprogress",
        donorName: user.displayName,
        donorEmail: user.email,
      }));

      toast.success("Donation confirmed! Status updated to In Progress.");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Donation error:", error);
      toast.error("Failed to confirm donation");
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-error">Request not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Blood Request Details
        </h1>

        <div className="space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Requester:</span>
            <span>{request.requesterName}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Recipient:</span>
            <span>{request.recipientName}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Blood Group:</span>
            <span className="badge badge-error">{request.blood_group || "N/A"}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Location:</span>
            <span>{request.district}, {request.upazila}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Hospital:</span>
            <span>{request.hospital || "N/A"}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Address:</span>
            <span className="text-sm text-gray-600">{request.address || "N/A"}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Donation Date:</span>
            <span>{request.donation_date || "Not set"}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Donation Time:</span>
            <span>{request.donation_time || "Not set"}</span>
          </div>

          <div className="flex justify-between pb-2">
            <span className="font-semibold">Status:</span>
            <span
              className={`badge ${
                request.donation_status === "pending"
                  ? "badge-warning"
                  : request.donation_status === "inprogress"
                  ? "badge-info"
                  : request.donation_status === "done"
                  ? "badge-success"
                  : "badge-error"
              }`}
            >
              {request.donation_status}
            </span>
          </div>

          {request.request_message && (
            <div className="pt-2">
              <span className="font-semibold">Message:</span>
              <p className="mt-1 text-gray-700">{request.request_message}</p>
            </div>
          )}

          {/* Donate Button (only for pending requests and logged-in users) */}
          {request.donation_status === "pending" && user && (
            <div className="pt-4 text-center">
              <button
                onClick={handleDonate}
                className="btn btn-primary"
              >
                Donate Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Your Donation</h3>
            <p className="py-4">
              You are about to confirm your willingness to donate blood for this request.
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-sm font-medium">Donor Name</label>
                <input
                  type="text"
                  readOnly
                  value={user?.displayName || ""}
                  className="input input-bordered w-full mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Donor Email</label>
                <input
                  type="email"
                  readOnly
                  value={user?.email || ""}
                  className="input input-bordered w-full mt-1"
                />
              </div>
            </div>

            <div className="modal-action">
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDonation}
                disabled={confirming}
                className="btn btn-primary"
              >
                {confirming ? "Confirming..." : "Confirm Donation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationRequestDetails;