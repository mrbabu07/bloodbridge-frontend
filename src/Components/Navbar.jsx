import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase/Firebase.config";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  const logout = () => {
    signOut(auth);
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      {/* Left */}
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl font-bold">
          Blood Donation
        </Link>
      </div>

      {/* Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-2">
          <li>
            <Link to={"/donation-request"}>Donation Requests</Link>
          </li>

          {user && (
            <li>
              <Link to="/funding">Funding</Link>
            </li>
          )}
        </ul>
      </div>

      {/* Right */}
      <div className="navbar-end">
        {!user ? (
          <Link to="/login" className="btn btn-primary btn-sm">
            Login
          </Link>
        ) : (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  src={
                    user.photoURL ||
                    "https://i.ibb.co/4pDNDk1/avatar.png"
                  }
                  alt="user avatar"
                />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li className="font-semibold text-center">
                {user.displayName || "User"}
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <button onClick={logout} className="text-error">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
