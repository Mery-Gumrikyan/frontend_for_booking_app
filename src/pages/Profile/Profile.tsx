import { useEffect } from "react";
import { useGetProfileQuery } from "../../store/authApi";
import { useNavigate } from "react-router";
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

  console.log(profile);
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

  if (isError) {
    return <div>Could not load profile</div>;
  }

  return <Loading />;
};

export default Profile;
