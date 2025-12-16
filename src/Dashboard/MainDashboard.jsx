// src/Dashboard/MainDashboard.jsx
import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import AdminDashboard from "./AdminDashboard";
import DonorDashboard from "./DonorDashboard";
import VolunteerDashboard from "./VolunteerDashboard";


const MainDashboard = () => {
  const { role } = useContext(AuthContext);

  // Role-based rendering
  if (role === "admin") {
    return <AdminDashboard />;
  }

  if (role === "volunteer") {
    return <VolunteerDashboard/>;
  }

  // Default: donor
  return <DonorDashboard />;
};

export default MainDashboard;