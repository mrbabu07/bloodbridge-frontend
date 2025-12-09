import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-md px-6">
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold">StyleDecor</Link>
      </div>

      <div className="flex gap-6">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/login" className="btn btn-sm">Login</Link>
      </div>
    </div>
  );
};

export default Navbar;
