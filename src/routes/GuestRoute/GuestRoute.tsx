import { Navigate, Outlet } from "react-router";

const GuestRouter = () => {
  const isAuthenticated = !!localStorage.getItem("accessToken");

  return isAuthenticated ? <Navigate to="/profile" replace /> : <Outlet />;
};

export default GuestRouter;
