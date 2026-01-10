import React from "react";
import { Layout } from "antd";
import Navbar from "../Components/Navbar";
import { Outlet } from "react-router";
import Footer from "../Components/Footer";
import { useTheme } from "../Context/ThemeContext";

const { Content } = Layout;

const MainLayout = () => {
  const { isDarkMode, theme } = useTheme();

  return (
    <Layout
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.colors.background }}
    >
      <Navbar />
      <Content>
        <div className="min-h-[calc(100vh-140px)]">
          <Outlet />
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default MainLayout;
