import { useEffect } from "react";
import { useGetProfileQuery } from "../../store/authApi";
import { Navigate, useNavigate } from "react-router";
import Loading from "../../components/Loading/Loading";

const Profile = () => {
  const navigate = useNavigate();
  const {
    data: profile,
    isLoading,
    isError,
  } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });


  useEffect(() => {
    if (!profile) {
      return;
    }

    const timer = setTimeout(() => {
      navigate(`/profile/${profile.userRole}`, {
        replace: true,
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [profile, navigate]);

  if (isLoading) {
    return <Loading />;
  }

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("accessToken");
    }
  }, [isError]);

  if (isError) {
    return <Navigate to="/login" replace />;
  }

  return <Loading />;
};

export default Profile;
