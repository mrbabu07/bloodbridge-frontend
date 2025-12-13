// PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";

const PrivateRoute = ({ children }) => {
  const { user, loading, roleLoading, userStatus } = useContext(AuthContext);
  if(loading || roleLoading){
    return <p>loading...</p>
  }

  if (!user || !userStatus == 'active') {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
