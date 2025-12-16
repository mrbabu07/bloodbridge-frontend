// src/Components/Aside.jsx
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, Home, LogOut, FileText } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase/Firebase.config";

export default function Aside() {
  const { role, userStatus } = useContext(AuthContext);

  const handleLogOut = () => signOut(auth);

  return (
    <aside className="w-64 h-screen bg-gray-900 text-gray-100 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-semibold">
          {role === "admin" ? "Admin Dashboard" : 
           role === "volunteer" ? "Volunteer Dashboard" : 
           "Donor Dashboard"}
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <NavItem to="/dashboard" icon={<LayoutDashboard size={18} />}>
          Dashboard
        </NavItem>

        {/* Donor: only these two */}
        {role === "donor" && userStatus === "active" && (
          <>
            <NavItem to="/dashboard/add-request" icon={<FileText size={18} />}>
              Create Request
            </NavItem>
            <NavItem to="/dashboard/my-request" icon={<Package size={18} />}>
              My Requests
            </NavItem>
            
          </>
        )}

        {/* Volunteer */}
        {role === "volunteer" && (
          <>
            <NavItem to="/dashboard/add-request" icon={<FileText size={18} />}>
              Create Request
            </NavItem>
            <NavItem to="/dashboard/donation-request" icon={<Package size={18} />}>
              All Requests
            </NavItem>
            <NavItem to="/dashboard/funding-page" icon={<Package size={18} />}>
              Total Funding
            </NavItem>
          </>
        )}

        {/* Admin */}
        {role === "admin" && (
          <>
            <NavItem to="/dashboard/donation-request" icon={<Package size={18} />}>
              All Requests
            </NavItem>
            <NavItem to="/dashboard/all-users" icon={<Package size={18} />}>
              All Users
            </NavItem>
            <NavItem to="/dashboard/funding" icon={<FileText size={18} />}>
              Funding
            </NavItem>
            <NavItem to="/dashboard/funding-page" icon={<Package size={18} />}>
              Total Funding
            </NavItem>
          </>
        )}

        <NavItem to="/dashboard/profile" icon={<Home size={18} />}>
          Profile
        </NavItem>

        <NavItem to="/" icon={<Home size={18} />}>
          Back to Home
        </NavItem>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogOut}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700"
        >
          <LogOut size={18} />
          <span>Logout</span>
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
          isActive ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800"
        }`
      }
    >
      {icon}
      <span>{children}</span>
    </NavLink>
  );
}