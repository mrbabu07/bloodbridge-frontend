// src/Pages/AddRequest.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../../Context/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AddRequest = () => {
  const { user } = useContext(AuthContext);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);

  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [district, setDistrict] = useState("");

  const [selectedUpazilaId, setSelectedUpazilaId] = useState("");
  const [upazila, setUpazila] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const axiosSecure = useAxiosSecure(); 

  // Load districts and upazilas
  useEffect(() => {
    axios
      .get("/district.json")
      .then((res) => {
        if (res.data?.districts) setDistricts(res.data.districts);
      })
      .catch((err) => console.error("District load error:", err));

    axios
      .get("/upazila.json")
      .then((res) => {
        if (res.data?.upazilas) setUpazilas(res.data.upazilas);
      })
      .catch((err) => console.error("Upazila load error:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const requesterName = e.target.requesterName.value.trim();
    const requesterEmail = e.target.requesterEmail.value.trim();
    const recipientName = e.target.recipientName.value.trim();
    const hospital = e.target.hospital.value.trim();
    const address = e.target.address.value.trim();
    const request_message = e.target.request_message.value.trim();
    const blood_group = e.target.blood_group.value;
    const donation_date = e.target.donation_date.value;
    const donation_time = e.target.donation_time.value;

    if (
      !requesterName ||
      !requesterEmail ||
      !recipientName ||
      !district ||
      !upazila ||
      !hospital ||
      !address ||
      !blood_group ||
      !donation_date ||
      !donation_time
    ) {
      toast.error("Please fill all required fields.");
      setIsLoading(false);
      return;
    }

    try {
      await axiosSecure.post("/requests", {
        requesterName,
        requesterEmail,
        recipientName,
        district,
        upazila,
        hospital,
        address,
        request_message,
        blood_group,
        donation_date,
        donation_time,
        donation_status: "pending",
        createdAt: new Date(),
      });

      toast.success("Blood request submitted!");
      e.target.reset();

      setDistrict("");
      setUpazila("");
      setSelectedDistrictId("");
      setSelectedUpazilaId("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg border p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add Blood Request
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Requester Name */}
          <div>
            <label className="block mb-1">Requester Name</label>
            <input
              type="text"
              value={user?.displayName}
              readOnly
              name="requesterName"
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          {/* Requester Email */}
          <div>
            <label className="block mb-1">Requester Email</label>
            <input
              type="email"
              value={user?.email}
              readOnly
              name="requesterEmail"
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          {/* Recipient Name */}
          <div>
            <label className="block mb-1">Recipient Name</label>
            <input
              type="text"
              name="recipientName"
              placeholder="Recipient full name"
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          {/* Recipient Blood Group */}
          <div>
            <label className="block mb-1">Recipient Blood Group</label>
            <select
              name="blood_group"
              required
              defaultValue=""
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="" disabled>
                Select Blood Group
              </option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block mb-1">District</label>
            <select
              value={selectedDistrictId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedDistrictId(id);
                setUpazila("");
                setSelectedUpazilaId("");

                const selected = districts.find((d) => d.id === id);
                setDistrict(selected?.name || "");
              }}
              className="w-full border rounded-lg px-4 py-2"
              required
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Upazila */}
          <div>
            <label className="block mb-1">Upazila</label>
            <select
              value={selectedUpazilaId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedUpazilaId(id);

                const selected = upazilas.find((u) => u.id === id);
                setUpazila(selected?.name || "");
              }}
              className="w-full border rounded-lg px-4 py-2"
              required
            >
              <option value="">Select Upazila</option>

              {upazilas
                .filter((u) => u.district_id === selectedDistrictId)
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Hospital */}
          <div>
            <label className="block mb-1">Hospital Name</label>
            <input
              type="text"
              name="hospital"
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Hospital name"
              required
            />
          </div>

          {/* Full Address */}
          <div>
            <label className="block mb-1">Full Address</label>
            <input
              type="text"
              name="address"
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Full address (street, area)"
              required
            />
          </div>

          {/* Donation Date */}
          <div>
            <label className="block mb-1">Donation Date</label>
            <input
              type="date"
              name="donation_date"
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
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          {/* Request Message */}
          <div>
            <label className="block mb-1">Request Message</label>
            <textarea
              name="request_message"
              placeholder="Any additional info"
              className="w-full border rounded-lg px-4 py-2"
              rows="4"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold"
          >
            {isLoading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRequest;
