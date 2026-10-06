import { Form, Input } from "antd";
import { LockOutlined } from "@ant-design/icons";

const PasswordInput = () => {
  return (
    <Form.Item
      name="password"
      rules={[
        {
          required: true,
          message: "Խնդրում ենք մուտքագրեք Ձեր գաղտնաբառը",
        },
        { min: 8, message: "Գաղտնաբառը պետք է պարունակի առնվազն 8 նիշ։" },
      ]}
    >
      <Input.Password
        prefix={<LockOutlined />}
        type="password"
        placeholder="Գաղտնաբառ"
      />
    </Form.Item>
  );
};

export default PasswordInput;
