import { useSelector, useDispatch } from "react-redux";
import { Outlet, Navigate } from "react-router";
import type { RootState } from "../../store/store";
import { useEffect } from "react";
import { useGetUserQuery } from "../../store/authApi";
import { addUser } from "../../store/userSlice";
import ErrorPage from "../../pages/ErrorPage/ErrorPage";

const GetUser = () => {
  const token = localStorage.getItem("accessToken");
  const user = useSelector((state: RootState) => state.user.user);

  const dispatch = useDispatch();

  const { data: fetchedUser, isError } = useGetUserQuery(undefined, {
    skip: !token || !!user,
  });

  useEffect(() => {
    if (fetchedUser) {
      dispatch(addUser(fetchedUser));
    }
  }, [fetchedUser, dispatch]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return <Outlet />;
};

export default GetUser;
