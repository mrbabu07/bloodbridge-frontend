import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import Loading from "../Pages/Loading";

const PrivateRoute = ({ children }) => {
  const { user, loading, userStatus } = useContext(AuthContext);
  if(loading){
    return <div><Loading/></div>
  }

  if (!user || userStatus !== "active") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
