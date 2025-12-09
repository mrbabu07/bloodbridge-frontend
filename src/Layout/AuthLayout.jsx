// src/layout/AuthLayout.jsx
import React from "react";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
