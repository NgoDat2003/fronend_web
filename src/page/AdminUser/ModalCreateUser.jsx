import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  Row,
  Col,
  message,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  callCreateUser,
  callGetAllRole,
  callUploadFileUser,
} from "../../service/api";
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

function ModalCreateUser({ visible, setVisible,handleRefesh }) {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState([]);
  const handleCreateUser = async (
    email, firstName,lastName,phone, address,roleId,password,imageUrl
  ) => {
    let res = await callCreateUser(
      email, firstName,lastName,phone, address,roleId,password,imageUrl
    );
    if (res && +res.EC === 0) {
      setLoading(false);
      form.resetFields();
      message.success(res.EM);
      setVisible(false);
      handleRefesh()
    } else {
      form.setFields([
        {
          name: "email",
          errors: [res.EM],
        },
      ]);
      message.error(res.EM);
    }
  };
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // Handle values here
        let { email, firstName, lastName, phone, address, roleId, password } =
          values;
        handleCreateUser(
          email,
          firstName,
          lastName,
          phone,
          address,
          roleId,
          password,
          imageUrl
        );
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setVisible(false);
  };
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(imageUrl);
      });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  const handleUpload = async ({ file }) => {
    let res = await callUploadFileUser(file);
    if (res && +res.EC === 0) {
      console.log(res.DT);
      setImageUrl("/user/" + res.DT.filename);
    }
  };
  const handleGetAllRole = async () => {
    let res = await callGetAllRole();
    if (res && +res.EC === 0) {
      setRole(res.DT.map((item) => ({ value: item.id, label: item.roleName })));
    }
  };

  useEffect(() => {
    handleGetAllRole();
  }, []);

  return (
    <div>
      <Modal
        title="Thêm người dùng"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={720}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: "public" }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[
                  { required: true, message: "Please input the first name!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[
                  { required: true, message: "Please input the last name!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { type: "email", message: "The input is not valid E-mail!" },
                  { required: true, message: "Please input your E-mail!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone number!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="address"
                label="Address"
                rules={[
                  { required: true, message: "Please input your address!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roleId"
                label="RoleId"
                rules={[
                  { required: true, message: "Please select a category!" },
                ]}
              >
                <Select
                  defaultValue={role[0] && role[0].value}
                  // onChange={handleChange}
                  options={role}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The two passwords that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="image"
                label="Avatar"
                valuePropName="file"
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  {
                    validator: (_, value) => {
                      if (!imageUrl) {
                        return Promise.reject(
                          new Error("Please upload an image!")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Upload
                  name="image"
                  listType="picture-circle"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  customRequest={handleUpload}
                  maxCount={1}
                >
                  {imageUrl ? (
                    <img
                      src={import.meta.env.VITE_APP_BE_API_URL + imageUrl}
                      alt="avatar"
                      style={{ width: "100%" }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

export default ModalCreateUser;
