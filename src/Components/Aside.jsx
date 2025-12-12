import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Package, Home, LogOut } from "lucide-react";

export default function Aside() {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-semibold">Admin Panel</h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        <NavItem to="/dashboard/main" icon={<LayoutDashboard size={18} />}>
          Dashboard
        </NavItem>

        <NavItem to="/dashboard/add-request" icon={<Package size={18} />}>
          Add Request
        </NavItem>

        <NavItem to="/dashboard/manage-product" icon={<Package size={18} />}>
          Manage Donor
        </NavItem>

        <NavItem to="/dashboard/users" icon={<Users size={18} />}>
          Users
        </NavItem>

        <NavItem to="/" icon={<Home size={18} />}>
          Back to Home
        </NavItem>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

function NavItem({ to, icon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
          isActive
            ? "bg-gray-800 text-white"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }`
      }
    >
      {icon}
      <span>{children}</span>
    </NavLink>
  );
}
