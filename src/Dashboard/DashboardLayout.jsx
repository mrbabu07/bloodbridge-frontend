import React, { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router";
import { Layout, Button, Drawer, Tooltip } from "antd";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import Aside from "../Components/Aside";
import { useTheme } from "../Context/ThemeContext";
import ThemeToggle from "../Components/ThemeToggle";

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const [mobileVisible, setMobileVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { isDarkMode, theme } = useTheme();
  const sidebarRef = useRef(null);

  // Click outside to collapse sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !collapsed
      ) {
        setCollapsed(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [collapsed]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        onClose={() => setMobileVisible(false)}
        open={mobileVisible}
        width={280}
        styles={{
          body: { padding: 0, backgroundColor: "#111827" },
          header: { display: "none" },
        }}
        closable={false}
      >
        <div className="relative h-full">
          <button
            onClick={() => setMobileVisible(false)}
            className="absolute top-4 right-4 z-50 text-white bg-red-500 hover:bg-red-600 rounded-full p-1.5 transition-colors"
          >
            <X size={16} />
          </button>
          <Aside collapsed={false} />
        </div>
      </Drawer>

      {/* Desktop Collapsible Sidebar */}
      <div ref={sidebarRef}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          trigger={null}
          width={280}
          collapsedWidth={80}
          className="hidden lg:block"
          style={{
            backgroundColor: "#111827",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            height: "100vh",
            overflow: "hidden",
            zIndex: 100,
            transition: "all 0.3s ease",
          }}
        >
          <Aside collapsed={collapsed} />

          {/* Collapse Toggle Button */}
          <Tooltip
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            placement="right"
          >
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-12 bg-red-500 hover:bg-red-600 text-white rounded-r-lg flex items-center justify-center shadow-lg transition-all duration-200 z-50 hover:w-8"
            >
              {collapsed ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronLeft size={16} />
              )}
            </button>
          </Tooltip>
        </Sider>
      </div>

      {/* Main Content Area */}
      <Layout
        style={{
          marginLeft: 0,
          backgroundColor: theme.colors.background,
          transition: "all 0.3s ease",
        }}
        className={collapsed ? "lg:ml-[80px]" : "lg:ml-[280px]"}
      >
        {/* Mobile Header */}
        <Header
          className="lg:hidden flex items-center justify-between px-4 h-14 sticky top-0 z-50"
          style={{
            backgroundColor: theme.colors.card,
            borderBottom: `1px solid ${theme.colors.border}`,
            padding: "0 16px",
          }}
        >
          <div className="flex items-center gap-3">
            <Button
              type="text"
              icon={<Menu size={22} />}
              onClick={() => setMobileVisible(true)}
              style={{ color: theme.colors.text }}
            />
            <span
              className="font-semibold"
              style={{ color: theme.colors.text }}
            >
              Dashboard
            </span>
          </div>
          <ThemeToggle />
        </Header>

        {/* Page Content - Centered */}
        <Content
          style={{
            backgroundColor: theme.colors.background,
            minHeight: "100vh",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
