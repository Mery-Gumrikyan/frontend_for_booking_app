import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import type { UserRole } from "../../type";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem("accessToken");
  const user = useSelector((state: RootState) => state.user.user);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/profile/${user.role}`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
