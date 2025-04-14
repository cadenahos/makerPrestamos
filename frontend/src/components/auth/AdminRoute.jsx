import { Navigate } from "react-router-dom";

const AdminRoute = ({ children, isAuthenticated, user }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
