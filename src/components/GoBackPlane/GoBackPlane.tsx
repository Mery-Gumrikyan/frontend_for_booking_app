import { useState } from "react";
import { useNavigate } from "react-router";
import { Button, Tooltip } from "antd";
import "./GoBackPlane.css";

const GoBackPlane = () => {
  const navigate = useNavigate();
  const [isFlying, setIsFlying] = useState(false);

  const handleBack = () => {
    setIsFlying(true);

    setTimeout(() => {
      navigate(-1);
    }, 350);
  };

  return (
    <Tooltip title="Գնալ հետ">
      <Button
        type="text"
        onClick={handleBack}
        className={`plane-button ${isFlying ? "plane-flying" : ""}`}
      >
        <i className="fa-solid fa-plane fa-rotate-180 fa-2xl plane"></i>
      </Button>
    </Tooltip>
  );
};

export default GoBackPlane;
