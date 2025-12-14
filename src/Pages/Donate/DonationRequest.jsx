import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../Context/AuthProvider";

const DonationRequest = () => {
  const [request, setRequest] = useState([]);
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axiosSecure
      .get("/donation-requests?status=pending")
      .then((res) => {
        setRequest(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [axiosSecure]);

  const handleView = (id) => {
    if (!user) {
      navigate("/login", { state: { from: `/donation-request/${id}` } });
    } else {
      navigate(`/donation-request/${id}`);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Pending Blood Donation Requests
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Recipient</th>
              <th>Location</th>
              <th>Blood Group</th>
              <th>Date</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {request.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No pending requests found
                </td>
              </tr>
            ) : (
              request.map((req, index) => (
                <tr key={req._id}>
                  <td>{index + 1}</td>
                  <td>{req.recipientName}</td>
                  <td>
                    {req.district}, {req.upazila}
                  </td>
                  <td>
                    <span className="badge badge-error">
                      {req.blood_group}
                    </span>
                  </td>
                  <td>{req.donation_date}</td>
                  <td>{req.donation_time}</td>
                  <td>
                    <button
                      onClick={() => handleView(req._id)}
                      className="btn btn-sm btn-primary"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationRequest;
