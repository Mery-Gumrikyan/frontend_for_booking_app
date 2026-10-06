// import { useEffect } from "react";
// import { useNavigate } from "react-router";

import GoBackPlane from "../../components/GoBackPlane/GoBackPlane";

// import { useGetUserProfileQuery } from "../../store/api";

const AgentPage = () => {
  // const navigate = useNavigate();

  // const {
  //   data: userProfile,
  //   isLoading: profileLoading,
  //   error: profileError,
  // } = useGetUserProfileQuery("traveler");

  // useEffect(() => {
  //   if (
  //     profileError &&
  //     "status" in profileError &&
  //     profileError.status === 401
  //   ) {
  //     localStorage.removeItem("accessToken");

  //     navigate("/login", {
  //       replace: true,
  //     });
  //   }
  // }, [profileError, navigate]);

  return (
    <div>
      <GoBackPlane
        onClick={() => {
          localStorage.removeItem("accessToken");
        }}
      />
      {/* {profileLoading && <p>is loading...</p>} */}

      <p>Welcome, , you entered as travel agent</p>
    </div>
  );
};

export default AgentPage;
