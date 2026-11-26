import { Typography } from "antd";

import "./welcomeText.css";

const { Text } = Typography;

interface WelcomeTextProps {
  name?: string;
  role?: string;
}

const WelcomeText = ({ name, role }: WelcomeTextProps) => {
  return (
    <Text className="welcomeText">
      Welcome, <Text className="welcomeTextBold">{name}</Text>! You are logged
      in as <Text className="welcomeTextBold">{role}</Text>.
    </Text>
  );
};

export default WelcomeText;
