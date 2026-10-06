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
import { useRegisterMutation, UserRole } from "../../store/authApi";

const { Paragraph, Text } = Typography;

interface RegistrationFormValues {
  name: string;
  surname: string;
  citizenship?: string;
  chronicDiseases?: boolean;
  email: string;
  password: string;
}

const Registration = () => {
  const navigate = useNavigate();
  const [register, { error }] = useRegisterMutation();
  const [role, setRole] = useState<UserRole>(UserRole.Traveler);

  const onFinish = async (values: RegistrationFormValues) => {
    const body = {
      role,
      name: values.name,
      surname: values.surname,
      citizenship: values.citizenship,
      chronicDiseases: values.chronicDiseases,
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
      >
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
          rules={[
            { required: true, message: "Խնդրում ենք մուտքագրել Ձեր անունը!" },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="անուն" />
        </Form.Item>

        <Form.Item
          name="surname"
          rules={[
            {
              required: true,
              message: "Խնդրում ենք մուտքագրել Ձեր ազգանունը!",
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="ազգանուն" />
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
                  message: "Խնդրում ենք մուտքագրել Ձեր քաղաքացիությունը!",
                },
              ]}
            >
              <Select
                prefix={<GlobalOutlined />}
                placeholder="քաղաքացիություն"
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
                  message: "Խնդրում ենք նշել՝ ունե՞ք քրոնիկ հիվանդություններ։",
                },
              ]}
            >
              <Select
                allowClear
                placeholder="Արդյո՞ք ունեք քրոնիկ հիվանդություններ։"
                options={[
                  { label: "Այո", value: true },
                  { label: "Ոչ", value: false },
                ]}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </>
        )}

        <Form.Item>
          <Button block type="primary" htmlType="submit" className="button">
            Գրանցում
          </Button>
        </Form.Item>

        {error && (
          <RegistrationResponse error={error as RegistrationResponseProps} />
        )}

        <GoBackPlane />
      </Form>
    </div>
  );
};

type RegistrationResponseProps = {
  data?: {
    message?: string;
  };
  status?: number;
};

function RegistrationResponse({ error }: { error: RegistrationResponseProps }) {
  if (
    error.data?.message === "the user has already registered" &&
    error.status === 409
  ) {
    return (
      <Paragraph className="errorAlert">
        <CloseCircleFilled />
        <Text className="errorAlert">Դուք արդեն գրանցված եք!!!</Text>
      </Paragraph>
    );
  } else if (error.status === 500) {
    return (
      <Paragraph className="errorAlert">
        <Text className="errorAlert">
          Գրանցումը ձախողվեց։ Խնդրում ենք փորձել կրկին։
        </Text>
      </Paragraph>
    );
  } else {
    return (
      <Paragraph className="errorAlert">
        <Text className="errorAlert">Ինչ-որ բան սխալ է</Text>
      </Paragraph>
    );
  }
}

export default Registration;
