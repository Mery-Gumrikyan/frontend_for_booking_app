import { Typography } from "antd";

import LogOutPlane from "../../components/GoBackPlane/LogOutPlane";

import "./errorPage.css";

const { Text } = Typography;

const ErrorPage = () => {
  return (
    <div className="errorPage">
      <Text className="errorText">Sorry, something went wrong.</Text>
      <LogOutPlane />
    </div>
  );
};

export default ErrorPage;
