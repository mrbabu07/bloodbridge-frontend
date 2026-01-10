import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, Tooltip, Badge } from "antd";
import { AuthContext } from "../Context/AuthProvider";
import { useTheme } from "../Context/ThemeContext";
import { useSocket } from "../Context/SocketContext";
import {
  LayoutDashboard,
  FilePlus,
  List,
  User,
  Home,
  LogOut,
  DollarSign,
  Users,
  Heart,
  MessageSquare,
  BarChart3,
  Droplet,
  Mail,
} from "lucide-react";

const Aside = ({ collapsed = false }) => {
  const { user, role, userStatus, logout } = useContext(AuthContext);
  const { theme } = useTheme();
  const { messageUnreadCount } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Menu items based on role
  const getMenuItems = () => {
    const commonItems = [
      { key: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      {
        key: "/dashboard/messages",
        icon: Mail,
        label: "Messages",
        badge: messageUnreadCount,
      },
    ];

    const donorItems = [
      {
        key: "/dashboard/add-request",
        icon: FilePlus,
        label: "Create Request",
      },
      { key: "/dashboard/my-request", icon: List, label: "My Requests" },
    ];

    const volunteerItems = [
      {
        key: "/dashboard/add-request",
        icon: FilePlus,
        label: "Create Request",
      },
      { key: "/dashboard/donation-request", icon: List, label: "All Requests" },
      { key: "/dashboard/funding-page", icon: DollarSign, label: "Funding" },
    ];

    const adminItems = [
      { key: "/dashboard/donation-request", icon: List, label: "All Requests" },
      { key: "/dashboard/all-users", icon: Users, label: "All Users" },
      { key: "/dashboard/funding", icon: DollarSign, label: "Funding" },
      { key: "/dashboard/funding-page", icon: BarChart3, label: "Reports" },
      {
        key: "/dashboard/contacts",
        icon: MessageSquare,
        label: "Contact Messages",
      },
    ];

    let roleItems = [];
    if (role === "admin") roleItems = adminItems;
    else if (role === "volunteer") roleItems = volunteerItems;
    else if (role === "donor" && userStatus === "active")
      roleItems = donorItems;

    return [...commonItems, ...roleItems];
  };

  const bottomItems = [
    { key: "/dashboard/profile", icon: User, label: "My Profile" },
    { key: "/", icon: Home, label: "Back to Home" },
  ];

  const menuItems = getMenuItems();

  const MenuItem = ({ item }) => {
    const isActive = location.pathname === item.key;
    const Icon = item.icon;

    const buttonContent = (
      <button
        onClick={() => navigate(item.key)}
        className={`
          w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200
          ${
            isActive
              ? "bg-red-500 text-white shadow-md"
              : "text-gray-300 hover:bg-white/10 hover:text-white"
          }
          ${collapsed ? "justify-center px-2" : ""}
        `}
      >
        <Badge
          count={item.badge}
          size="small"
          offset={collapsed ? [0, 0] : [-5, 0]}
        >
          <Icon
            size={20}
            className={isActive ? "text-white" : "text-gray-300"}
          />
        </Badge>
        {!collapsed && <span className="font-medium">{item.label}</span>}
      </button>
    );

    if (collapsed) {
      return (
        <Tooltip
          title={`${item.label}${item.badge ? ` (${item.badge})` : ""}`}
          placement="right"
        >
          <div className="mx-2 my-1">{buttonContent}</div>
        </Tooltip>
      );
    }

    return <div className="mx-2 my-1">{buttonContent}</div>;
  };

  const getRoleColor = () => {
    if (role === "admin") return "#ef4444";
    if (role === "volunteer") return "#3b82f6";
    return "#22c55e";
  };

  const getRoleLabel = () => {
    if (role === "admin") return "Admin";
    if (role === "volunteer") return "Volunteer";
    return "Donor";
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className={`p-4 ${collapsed ? "px-2" : ""}`}>
        {/* Logo */}
        <div
          className={`flex items-center gap-3 mb-6 ${
            collapsed ? "justify-center" : "px-2"
          }`}
        >
          <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Heart className="text-white" size={20} fill="white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-white font-bold text-lg">BloodBridge</h1>
              <span className="text-gray-500 text-xs">Save Lives</span>
            </div>
          )}
        </div>

        {/* User Info */}
        {collapsed ? (
          <Tooltip
            title={`${user?.name} (${getRoleLabel()})`}
            placement="right"
          >
            <div className="flex justify-center mb-4">
              <Avatar
                src={user?.photoURL || undefined}
                size={40}
                className="border-2 border-red-500"
                icon={<User size={18} />}
              />
            </div>
          </Tooltip>
        ) : (
          <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-white/5 mb-4">
            <Avatar
              src={user?.photoURL || undefined}
              size={40}
              className="border-2 border-red-500 flex-shrink-0"
              icon={<User size={18} />}
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate text-sm">
                {user?.name || "User"}
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${getRoleColor()}30`,
                    color: getRoleColor(),
                  }}
                >
                  {getRoleLabel()}
                </span>
                {user?.isDemo && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">
                    Demo
                  </span>
                )}
                {user?.bloodGroup && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Droplet size={10} className="text-red-400" />
                    {user.bloodGroup}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        {!collapsed && (
          <div className="px-4 mb-2">
            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
              Menu
            </span>
          </div>
        )}
        {menuItems.map((item) => (
          <MenuItem key={item.key} item={item} />
        ))}

        {!collapsed && (
          <div className="px-4 mt-6 mb-2">
            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
              Account
            </span>
          </div>
        )}
        {collapsed && <div className="my-4 border-t border-white/10 mx-4" />}
        {bottomItems.map((item) => (
          <MenuItem key={item.key} item={item} />
        ))}
      </div>

      {/* Logout */}
      <div
        className={`p-4 border-t border-white/10 ${collapsed ? "px-2" : ""}`}
      >
        {collapsed ? (
          <Tooltip title="Logout" placement="right">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
            >
              <LogOut size={18} />
            </button>
          </Tooltip>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Aside;
