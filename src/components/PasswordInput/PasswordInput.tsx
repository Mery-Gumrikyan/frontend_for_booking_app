import { Form, Input } from "antd";
import { LockOutlined } from "@ant-design/icons";

const PasswordInput = () => {
  return (
    <Form.Item
      name="password"
      rules={[
        {
          required: true,
          message: "Please enter your password.",
        },
        { min: 8, message: "The password must be at least 8 characters long." },
      ]}
    >
      <Input.Password
        prefix={<LockOutlined />}
        type="password"
        placeholder="Password"
      />
    </Form.Item>
  );
};

export default PasswordInput;
