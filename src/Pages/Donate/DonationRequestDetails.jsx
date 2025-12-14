import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const DonationRequestDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure
      .get(`/donation-request/${id}`)
      .then((res) => {
        setRequest(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [axiosSecure, id]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!request) {
    return <div className="text-center mt-10">Request not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Donation Request Details 🩸
      </h2>

      <div className="card bg-base-100 shadow-md">
        <div className="card-body space-y-3">
          <p>
            <strong>Recipient Name:</strong> {request.recipientName}
          </p>

          <p>
            <strong>Blood Group:</strong>{" "}
            <span className="badge badge-error">
              {request.blood_group}
            </span>
          </p>

          <p>
            <strong>Location:</strong>{" "}
            {request.district}, {request.upazila}
          </p>

          <p>
            <strong>Hospital Name:</strong> {request.hospital_name}
          </p>

          <p>
            <strong>Donation Date:</strong> {request.donation_date}
          </p>

          <p>
            <strong>Donation Time:</strong> {request.donation_time}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`badge ${
                request.donation_status === "pending"
                  ? "badge-warning"
                  : request.donation_status === "done"
                  ? "badge-success"
                  : request.donation_status === "canceled"
                  ? "badge-error"
                  : "badge-info"
              }`}
            >
              {request.donation_status}
            </span>
          </p>

          <p>
            <strong>Message:</strong> {request.request_message}
          </p>

          {/* Optional action button */}
          {request.donation_status === "pending" && (
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-primary">
                Donate Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationRequestDetails;
