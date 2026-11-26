import { Card, Typography, Row, Col, Tag } from "antd";
import { DownOutlined } from "@ant-design/icons";

import "./flightRouteHeader.css";

interface FlightRouteHeaderProps {
  departure: string;
  arrival: string;
  count: number;
  title: string;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const FlightRouteHeader = ({
  departure,
  arrival,
  count,
  title,
  isExpanded = false,
  onToggle,
}: FlightRouteHeaderProps) => {
  return (
    <Card
      className={`flightRouteHeader${isExpanded ? " isExpanded" : " isCollapsed"}`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      onKeyDown={(e) => {
        if (onToggle && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <Row className="routeTitleRow">
        <div className="routeTitleLeft">
          <Typography.Text className="routeTitle">{title}</Typography.Text>
          <Tag color="blue">
            {count} {count === 1 ? "flight" : "flights"} found
          </Tag>
        </div>

        <div className="routeToggleHint">
          <span className="routeToggleText">
            {isExpanded ? "Hide flights" : "Show flights"}
          </span>
          <DownOutlined
            className={`routeToggleChevron${isExpanded ? " isExpanded" : ""}`}
          />
        </div>
      </Row>

      <Row className="routeContent">
        <Col>
          <Typography.Title level={3}>{departure}</Typography.Title>
        </Col>

        <Col className="routeLine">
          <i className="fa-solid fa-plane"></i>
        </Col>

        <Col className="routeArrival">
          <Typography.Title level={3}>{arrival}</Typography.Title>
        </Col>
      </Row>
    </Card>
  );
};

export default FlightRouteHeader;
