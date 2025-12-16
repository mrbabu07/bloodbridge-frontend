// src/Dashboard/AddProduct/EditRequest.jsx
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../Context/AuthProvider";

const EditRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [formData, setFormData] = useState({
    recipientName: "",
    blood_group: "",
    district: "",
    upazila: "",
    hospital: "",
    address: "",
    request_message: "",
    donation_date: "",
    donation_time: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load districts & upazilas
  useEffect(() => {
    axios.get("/district.json").then(res => setDistricts(res.data.districts || []));
    axios.get("/upazila.json").then(res => setUpazilas(res.data.upazilas || []));
  }, []);

  // Load request data
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await axiosSecure.get(`/donation-request/${id}`);
        setFormData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load request", err);
        toast.error("Failed to load request");
        navigate("/dashboard/my-donation-requests");
      }
    };
    fetchRequest();
  }, [id, axiosSecure, navigate]);

  const filteredUpazilas = upazilas.filter(u => u.district_id === formData.district);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axiosSecure.put(`/requests/${id}`, formData);
      toast.success("Request updated successfully!");
      navigate("/dashboard/my-request");
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update request");
    } finally {
      setSubmitting(false);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg border p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Edit Blood Request
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipient Name */}
          <div>
            <label className="block mb-1">Recipient Name</label>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName || ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          {/* Blood Group */}
          <div>
            <label className="block mb-1">Blood Group</label>
            <select
              name="blood_group"
              value={formData.blood_group || ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            >
              <option value="">Select Blood Group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block mb-1">District</label>
            <select
              name="district"
              value={formData.district || ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Upazila */}
          <div>
            <label className="block mb-1">Upazila</label>
            <select
              name="upazila"
              value={formData.upazila || ""}
              onChange={handleChange}
              disabled={!formData.district}
              className="w-full border rounded-lg px-4 py-2"
              required
            >
              <option value="">Select Upazila</option>
              {filteredUpazilas.map((u) => (
                <option key={u.id} value={u.name}>{u.name}</option>
              ))}
            </select>
          </div>

          {/* Hospital */}
          <div>
            <label className="block mb-1">Hospital Name</label>
            <input
              type="text"
              name="hospital"
              value={formData.hospital || ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1">Full Address</label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          {/* Donation Date */}
          <div>
            <label className="block mb-1">Donation Date</label>
            <input
              type="date"
              name="donation_date"
              value={formData.donation_date || ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          {/* Donation Time */}
          <div>
            <label className="block mb-1">Donation Time</label>
            <input
              type="time"
              name="donation_time"
              value={formData.donation_time || ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          {/* Request Message */}
          <div>
            <label className="block mb-1">Request Message</label>
            <textarea
              name="request_message"
              value={formData.request_message || ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              rows="3"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 btn btn-primary"
            >
              {submitting ? "Updating..." : "Update Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRequest;