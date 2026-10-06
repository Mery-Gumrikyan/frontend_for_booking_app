import { Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

import "./flightDestinationCard.css";

const FlightDestinationCard = ({ flight }) => {
  if (!flight) {
    return null;
  }

  return (
    <div className="flightDestinationCard">
      <i className="fa-solid fa-plane fa-float fa-lg plainIcon"></i>
      <Typography.Text className="directionText">
        {flight.from}
        <ArrowRightOutlined />
        {flight.to}
      </Typography.Text>
    </div>
  );
};

export default FlightDestinationCard;
