import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { Button, Tooltip } from "antd";
import { clearUser } from "../../store/userSlice";
import { authApi } from "../../store/authApi";
import { flightApi } from "../../store/flightApi";
import "./GoBackPlane.css";

const LogOutPlane = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isFlying, setIsFlying] = useState(false);

  const handleLogOut = () => {
    setIsFlying(true);

    localStorage.removeItem("accessToken");
    dispatch(clearUser());
    dispatch(authApi.util.resetApiState());
    dispatch(flightApi.util.resetApiState());

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 350);
  };

  return (
    <Tooltip title="Log out">
      <Button
        type="text"
        onClick={handleLogOut}
        className={`plane-button ${isFlying ? "plane-flying" : ""}`}
      >
        <i className="fa-solid fa-plane fa-rotate-180 fa-2xl plane"></i>
      </Button>
    </Tooltip>
  );
};

export default LogOutPlane;
