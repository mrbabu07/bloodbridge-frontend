import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import CreateFirstAdmin from "./CreateFirstAdmin";
import axios from "axios";

const AdminSetup = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [needsAdmin, setNeedsAdmin] = useState(false);

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    try {
      const response = await axios.get(`${apiBase}/check-admin-exists`);
      setNeedsAdmin(!response.data.adminExists);
    } catch (error) {
      console.error("Failed to check admin status:", error);
      // If we can't check, assume we need admin setup
      setNeedsAdmin(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminCreated = () => {
    setNeedsAdmin(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (needsAdmin) {
    return <CreateFirstAdmin onAdminCreated={handleAdminCreated} />;
  }

  return children;
};

export default AdminSetup;
