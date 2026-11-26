import { useEffect } from "react";
import { useGetUserQuery } from "../../store/authApi";
import { Navigate, useNavigate } from "react-router";
import Loading from "../../components/Loading/Loading";

const Profile = () => {
  const navigate = useNavigate();
  const {
    data: user,
    isLoading,
    isError,
  } = useGetUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const timer = setTimeout(() => {
      navigate(`/profile/${user.role}`, {
        replace: true,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("accessToken");
    }
  }, [isError]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Navigate to="/login" replace />;
  }

  return <Loading />;
};

export default Profile;
