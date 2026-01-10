import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import Loading from "../Pages/Loading";
import { Result, Button } from "antd";
import { Link } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user, loading, userStatus, role } = useContext(AuthContext);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (!user || userStatus !== "active") {
    return <Navigate to="/login" />;
  }

  if (role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page. Only administrators can view this content."
          extra={
            <Link to="/dashboard">
              <Button type="primary">Back to Dashboard</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return children;
};

export default AdminRoute;
