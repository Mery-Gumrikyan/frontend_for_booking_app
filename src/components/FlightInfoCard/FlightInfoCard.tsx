import { Card, Row, Col, Space, Typography, Tag, Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const FlightInfoCard = ({ flight }) => {
  return (
    <Card>
      <Row align="middle" gutter={24}>
        <Col flex="auto">
          <Space vertical>
            <Typography.Text strong>
              {flight.from} → {flight.to}
            </Typography.Text>

            <Space>
              <Typography.Text>{flight.dateOfFlight}</Typography.Text>
              <ArrowRightOutlined />
              <Typography.Text>{flight.timeOfFlight}</Typography.Text>
            </Space>

            <Space>
              <Tag color="green">Ուղիղ</Tag>
              <Typography.Text type="secondary">
                5ժ 50ր · FlyOne
              </Typography.Text>
            </Space>
          </Space>
        </Col>

        <Col>
          <Space vertical align="end">
            <Typography.Title level={4} style={{ margin: 0 }}>
              {flight.price} AMD
            </Typography.Title>

            <Button type="primary">Ստանալ առաջարկը</Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default FlightInfoCard;
