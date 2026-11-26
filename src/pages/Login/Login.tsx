import { Button, Form, Typography, Alert } from "antd";
import { Link, useNavigate } from "react-router";
import { useState } from "react";

import EmailInput from "../../components/EmailInput/EmailInput";
import PasswordInput from "../../components/PasswordInput/PasswordInput";

import { useLoginMutation, useLazyGetUserQuery } from "../../store/authApi";
import type { LoginRequest } from "../../store/authApi";

import { useDispatch } from "react-redux";
import { addUser } from "../../store/userSlice";

const { Text } = Typography;

const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const [getUser] = useLazyGetUserQuery();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();

  const handleLogin = async (values: LoginRequest) => {
    setErrorMessage("");

    try {
      const loginResp = await login(values).unwrap();
      if (!loginResp.accessToken) {
        setErrorMessage("Invalid server response");
        return;
      }

      localStorage.setItem("accessToken", loginResp.accessToken);

      const user = await getUser().unwrap();

      dispatch(addUser(user));

      navigate(`/profile`);
    } catch (error: unknown) {
      console.error("Login error:", error);

      const msg =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "Incorrect email or password.";

      setErrorMessage(msg);
    }
  };

  return (
    <div className="formWrapper">
      <Form name="login" size="large" className="form" onFinish={handleLogin}>
        <div className="authHeader">
          <span className="authTitle">Login</span>
          <span className="authSubtitle">Welcome, Sign in to your account</span>
        </div>

        <EmailInput />

        <PasswordInput />

        {errorMessage && (
          <Form.Item>
            <Alert message={errorMessage} type="error" showIcon />
          </Form.Item>
        )}

        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            className="button"
            loading={isLoading}
            disabled={isLoading}
          >
            Log In
          </Button>
        </Form.Item>
        <Text className="formBottomText">
          Or <Link to="/register"> Sign Up Now!</Link>
        </Text>
      </Form>
    </div>
  );
};

export default Login;
