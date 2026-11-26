import { useState } from "react";
import { useNavigate } from "react-router";
import { Button, Tooltip } from "antd";
import "./GoBackPlane.css";

const LogOutPlane = () => {
  const navigate = useNavigate();
  const [isFlying, setIsFlying] = useState(false);

  const handleLogOut = () => {
    setIsFlying(true);

    setTimeout(() => {
      navigate(-1);
    }, 350);

    localStorage.removeItem("accessToken");
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
