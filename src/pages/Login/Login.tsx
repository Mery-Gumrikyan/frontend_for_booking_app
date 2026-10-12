import { Button, Form, Typography, Alert } from "antd";
import { Link, useNavigate } from "react-router";
import { useState } from "react";

import EmailInput from "../../components/EmailInput/EmailInput";
import PasswordInput from "../../components/PasswordInput/PasswordInput";

import { useLoginMutation } from "../../store/authApi";
import type { LoginRequest } from "../../store/authApi";

const { Text } = Typography;

const Login = () => {
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (values: LoginRequest) => {
    setErrorMessage("");

    try {
      const loginResp = await login(values).unwrap();
      if (!loginResp.accessToken) {
        setErrorMessage("Invalid server response");
        return;
      }

      localStorage.setItem("accessToken", loginResp.accessToken);

      navigate(`/profile`);
    } catch (error) {
      console.error("Login error:", error);

      setErrorMessage("Սխալ email կամ password");
    }
  };

  return (
    <div className="formWrapper">
      <Form name="login" size="large" className="form" onFinish={handleLogin}>
        <EmailInput />

        <PasswordInput />

        {errorMessage && (
          <Form.Item>
            <Alert title={errorMessage} type="error" banner />
          </Form.Item>
        )}

        <Form.Item>
          <Button block type="primary" htmlType="submit" className="button">
            Մուտք
          </Button>
        </Form.Item>
        <Text className="formBottomText">
          կամ <Link to="/register">գրանցվիր հիմա!</Link>
        </Text>
      </Form>
    </div>
  );
};

export default Login;
