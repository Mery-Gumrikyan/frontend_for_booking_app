import { useState } from "react";
import { useNavigate } from "react-router";

import { Form, Input, Select, Button, Typography, Radio } from "antd";
import {
  UserOutlined,
  GlobalOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";

import EmailInput from "../../components/EmailInput/EmailInput";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import GoBackPlane from "../../components/GoBackPlane/GoBackPlane";
import { useRegisterMutation } from "../../store/authApi";
import { UserRole } from "../../type";

import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

const { Paragraph, Text } = Typography;

interface RegistrationFormValues {
  name: string;
  surname: string;
  citizenship?: string;
  chronicDiseases?: boolean;
  email: string;
  password: string;
}
type RegistrationError = FetchBaseQueryError | SerializedError;

const Registration = () => {
  const navigate = useNavigate();
  const [register, { error, isLoading }] = useRegisterMutation();
  const [role, setRole] = useState<UserRole>(UserRole.Traveler);

  const onFinish = async (values: RegistrationFormValues) => {
    const body = {
      role,
      name: values.name,
      surname: values.surname,
      citizenship: role === UserRole.Traveler ? values.citizenship : undefined,
      chronicDiseases:
        role === UserRole.Traveler ? values.chronicDiseases : undefined,
      email: values.email,
      password: values.password,
    };

    try {
      await register(body).unwrap();

      navigate("/login");
    } catch {
      // Error is displayed through `error`
    }
  };

  return (
    <div className="formWrapper">
      <Form
        name="registration"
        size="large"
        className="form"
        onFinish={onFinish}
        clearOnDestroy
      >
        <div className="authHeader">
          <div className="authIconBadge">
            <i className="fa-solid fa-user-plus" />
          </div>
          <span className="authTitle">Registration</span>
          <span className="authSubtitle">
            Create an account and begin your journey
          </span>
        </div>

        <Radio.Group
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="roleChooser"
        >
          <Radio.Button
            value={UserRole.Traveler}
            className={role === UserRole.Traveler ? "chooseRole" : "role"}
          >
            Traveler
          </Radio.Button>
          <Radio.Button
            value={UserRole.Agent}
            className={role === UserRole.Agent ? "chooseRole" : "role"}
          >
            Agent
          </Radio.Button>
        </Radio.Group>

        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please enter your name." }]}
        >
          <Input prefix={<UserOutlined />} placeholder="First Name" />
        </Form.Item>

        <Form.Item
          name="surname"
          rules={[
            {
              required: true,
              message: "Please enter your last name.",
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Last Name" />
        </Form.Item>

        <EmailInput />

        <PasswordInput />

        {role !== UserRole.Agent && (
          <>
            <Form.Item
              name="citizenship"
              rules={[
                {
                  required: true,
                  message: "Please enter your nationality.",
                },
              ]}
            >
              <Select
                prefix={<GlobalOutlined />}
                placeholder="Nationality"
                options={[
                  { label: "ARM", value: "ARM" },
                  { label: "RUS", value: "RUS" },
                  { label: "USA", value: "USA" },
                  { label: "FRA", value: "FRA" },
                  { label: "IRN", value: "IRN" },
                ]}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              name="chronicDiseases"
              rules={[
                {
                  required: true,
                  message:
                    "Please indicate whether you have any chronic medical conditions.",
                },
              ]}
            >
              <Select
                allowClear
                placeholder="Do you have any chronic medical conditions?"
                options={[
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ]}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </>
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
            Registration
          </Button>
        </Form.Item>

        {error && <RegistrationResponse error={error} />}

        <GoBackPlane />
      </Form>
    </div>
  );
};

function RegistrationResponse({ error }: { error: RegistrationError }) {
  const errorMsg =
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
      ? error.data.message
      : undefined;

  const status = "status" in error ? error.status : undefined;

  if (status === 409 || errorMsg === "the user has already registered") {
    return (
      <Paragraph className="errorAlert">
        <CloseCircleFilled />
        <Text className="errorAlert">You are already registered!</Text>
      </Paragraph>
    );
  }
  if (errorMsg) {
    return (
      <Paragraph className="errorAlert">
        <CloseCircleFilled />
        <Text className="errorAlert">{errorMsg}</Text>
      </Paragraph>
    );
  }
  if (status === 500) {
    return (
      <Paragraph className="errorAlert">
        <Text className="errorAlert">
          Registration failed. Please try again.
        </Text>
      </Paragraph>
    );
  }
  return (
    <Paragraph className="errorAlert">
      <Text className="errorAlert">Something went wrong.</Text>
    </Paragraph>
  );
}

export default Registration;
