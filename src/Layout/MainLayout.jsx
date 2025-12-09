// src/layout/MainLayout.jsx
import React from "react";
import Navbar from "../Component/Navbar";
import { Outlet } from "react-router";
import Footer from "../Component/Footer";


const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-140px)]"> 
        <Outlet /> 
        
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;