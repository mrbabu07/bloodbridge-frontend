import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { useTheme } from "../Context/ThemeContext";
import {
  Menu,
  Button,
  Drawer,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Badge,
} from "antd";
import {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  HeartFilled,
  SearchOutlined,
  FundOutlined,
  LoginOutlined,
  BarChartOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  TeamOutlined,
  FileTextOutlined,
  SettingOutlined,
  BellOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  DownOutlined,
} from "@ant-design/icons";
import NotificationBell from "./Notifications/NotificationBell";
import ThemeToggle from "./ThemeToggle";

const { Text } = Typography;

const Navbar = () => {
  const { user, role, logout } = useContext(AuthContext);
  const { isDarkMode, theme } = useTheme();
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Logged out menu items (3+ routes)
  const publicMenuItems = [
    {
      key: "/",
      icon: <HeartFilled />,
      label: <Link to="/">Home</Link>,
    },
    {
      key: "/donation-request",
      icon: <UnorderedListOutlined />,
      label: <Link to="/donation-request">Blood Requests</Link>,
    },
    {
      key: "/search",
      icon: <SearchOutlined />,
      label: <Link to="/search">Find Donors</Link>,
    },
    {
      key: "about-dropdown",
      icon: <InfoCircleOutlined />,
      label: "About",
      children: [
        {
          key: "/about",
          icon: <TeamOutlined />,
          label: <Link to="/about">About Us</Link>,
        },
        {
          key: "/contact",
          icon: <FileTextOutlined />,
          label: <Link to="/contact">Contact</Link>,
        },
        {
          key: "/faq",
          icon: <QuestionCircleOutlined />,
          label: <Link to="/faq">FAQ</Link>,
        },
      ],
    },
  ];

  // Logged in menu items (5+ routes)
  const privateMenuItems = [
    {
      key: "/",
      icon: <HeartFilled />,
      label: <Link to="/">Home</Link>,
    },
    {
      key: "/donation-request",
      icon: <UnorderedListOutlined />,
      label: <Link to="/donation-request">Blood Requests</Link>,
    },
    {
      key: "/search",
      icon: <SearchOutlined />,
      label: <Link to="/search">Find Donors</Link>,
    },
    {
      key: "/funding",
      icon: <FundOutlined />,
      label: <Link to="/funding">Funding</Link>,
    },
    {
      key: "/statistics",
      icon: <BarChartOutlined />,
      label: <Link to="/statistics">Statistics</Link>,
    },
    {
      key: "more-dropdown",
      icon: <InfoCircleOutlined />,
      label: "More",
      children: [
        {
          key: "/about",
          icon: <TeamOutlined />,
          label: <Link to="/about">About Us</Link>,
        },
        {
          key: "/contact",
          icon: <FileTextOutlined />,
          label: <Link to="/contact">Contact</Link>,
        },
        {
          key: "/faq",
          icon: <QuestionCircleOutlined />,
          label: <Link to="/faq">FAQ</Link>,
        },
      ],
    },
  ];

  const menuItems = user ? privateMenuItems : publicMenuItems;

  // Profile dropdown menu
  const profileMenuItems = [
    {
      key: "profile-header",
      label: (
        <div
          className="px-2 py-2 border-b"
          style={{ borderColor: theme.colors.border }}
        >
          <Text strong style={{ color: theme.colors.text, display: "block" }}>
            {user?.name || "User"}
          </Text>
          <Text style={{ color: theme.colors.textSecondary, fontSize: "12px" }}>
            {user?.email}
          </Text>
          <Badge
            count={role?.toUpperCase()}
            style={{
              backgroundColor:
                role === "admin"
                  ? "#dc2626"
                  : role === "volunteer"
                  ? "#2563eb"
                  : "#16a34a",
              marginTop: 4,
            }}
          />
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/dashboard"),
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "My Profile",
      onClick: () => navigate("/dashboard/profile"),
    },
    {
      key: "my-requests",
      icon: <UnorderedListOutlined />,
      label: "My Requests",
      onClick: () => navigate("/dashboard/my-request"),
    },
    {
      key: "add-request",
      icon: <PlusOutlined />,
      label: "Create Request",
      onClick: () => navigate("/dashboard/add-request"),
    },
    ...(role === "admin"
      ? [
          { type: "divider" },
          {
            key: "admin-section",
            label: (
              <Text
                style={{ color: theme.colors.textSecondary, fontSize: "11px" }}
              >
                ADMIN
              </Text>
            ),
            disabled: true,
          },
          {
            key: "all-users",
            icon: <TeamOutlined />,
            label: "Manage Users",
            onClick: () => navigate("/dashboard/all-users"),
          },
          {
            key: "settings",
            icon: <SettingOutlined />,
            label: "Settings",
            onClick: () => navigate("/dashboard"),
          },
        ]
      : []),
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <nav
      className={`shadow-sm sticky top-0 z-50 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gray-900 border-b border-gray-800"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
              <HeartFilled style={{ fontSize: "20px", color: "white" }} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-red-600">
                BloodBridge
              </span>
              <span
                className={`text-[10px] -mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Save Lives Together
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center flex-1 justify-center">
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={menuItems}
              style={{
                borderBottom: "none",
                minWidth: user ? "600px" : "450px",
                justifyContent: "center",
                backgroundColor: "transparent",
              }}
              theme={isDarkMode ? "dark" : "light"}
            />
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <ThemeToggle />

            {user && <NotificationBell />}

            {!user ? (
              <Space>
                <Link to="/login">
                  <Button type="text" style={{ color: theme.colors.text }}>
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    type="primary"
                    className="bg-red-500 border-red-500 rounded-lg"
                  >
                    Register
                  </Button>
                </Link>
              </Space>
            ) : (
              <Dropdown
                menu={{ items: profileMenuItems }}
                placement="bottomRight"
                trigger={["click"]}
                overlayStyle={{ minWidth: 220 }}
              >
                <div
                  className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-colors ${
                    isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                  }`}
                >
                  <Avatar
                    src={user.photoURL || undefined}
                    icon={<UserOutlined />}
                    style={{ border: "2px solid #dc2626" }}
                  />
                  <div className="flex flex-col">
                    <Text
                      strong
                      style={{
                        fontSize: "13px",
                        lineHeight: "1.2",
                        color: theme.colors.text,
                      }}
                    >
                      {user.name?.split(" ")[0] || "User"}
                    </Text>
                    <Text
                      style={{
                        fontSize: "10px",
                        color: theme.colors.textSecondary,
                      }}
                    >
                      {role}
                    </Text>
                  </div>
                  <DownOutlined
                    style={{ fontSize: 10, color: theme.colors.textSecondary }}
                  />
                </div>
              </Dropdown>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            {user && <NotificationBell />}
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: 20 }} />}
              onClick={() => setOpenMobileMenu(true)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <HeartFilled style={{ color: "white", fontSize: 16 }} />
            </div>
            <span className="font-bold text-red-600">BloodBridge</span>
          </div>
        }
        placement="right"
        onClose={() => setOpenMobileMenu(false)}
        open={openMobileMenu}
        width={300}
      >
        {user && (
          <div className="mb-4 pb-4 border-b flex items-center gap-3">
            <Avatar
              size={48}
              src={user.photoURL || undefined}
              icon={<UserOutlined />}
            />
            <div>
              <Text strong style={{ display: "block" }}>
                {user.name}
              </Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {user.email}
              </Text>
              <Badge
                count={role?.toUpperCase()}
                style={{
                  backgroundColor:
                    role === "admin"
                      ? "#dc2626"
                      : role === "volunteer"
                      ? "#2563eb"
                      : "#16a34a",
                  marginTop: 4,
                }}
              />
            </div>
          </div>
        )}

        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={() => setOpenMobileMenu(false)}
          style={{ borderRight: "none" }}
        />

        <div className="mt-4 pt-4 border-t space-y-3">
          {!user ? (
            <>
              <Link to="/login" onClick={() => setOpenMobileMenu(false)}>
                <Button block size="large">
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={() => setOpenMobileMenu(false)}>
                <Button
                  type="primary"
                  block
                  size="large"
                  className="bg-red-500 border-red-500"
                >
                  Register
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" onClick={() => setOpenMobileMenu(false)}>
                <Button block icon={<DashboardOutlined />}>
                  Dashboard
                </Button>
              </Link>
              <Link
                to="/dashboard/profile"
                onClick={() => setOpenMobileMenu(false)}
              >
                <Button block icon={<UserOutlined />}>
                  My Profile
                </Button>
              </Link>
              <Button
                block
                danger
                icon={<LogoutOutlined />}
                onClick={() => {
                  handleLogout();
                  setOpenMobileMenu(false);
                }}
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </Drawer>
    </nav>
  );
};

export default Navbar;
