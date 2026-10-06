import { Form, Input } from "antd";
import { MailOutlined } from "@ant-design/icons";

const EmailInput = () => {
  return (
    <Form.Item
      name="email"
      rules={[
        {
          required: true,
          message: "Խնդրում ենք մուտքագրեք էլեկտրոնային հասցեն!",
        },
        { type: "email", message: "Էլ հասցեն վավեր չէ" },
      ]}
    >
      <Input prefix={<MailOutlined />} placeholder="Էլ․ փոստ" />
    </Form.Item>
  );
};

export default EmailInput;
