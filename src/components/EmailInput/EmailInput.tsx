import { Form, Input } from "antd";
import { MailOutlined } from "@ant-design/icons";

const EmailInput = () => {
  return (
    <Form.Item
      name="email"
      rules={[
        {
          required: true,
          message: "Please enter your email address!",
        },
        { type: "email", message: "The email address is invalid." },
      ]}
    >
      <Input prefix={<MailOutlined />} placeholder="Email" />
    </Form.Item>
  );
};

export default EmailInput;
