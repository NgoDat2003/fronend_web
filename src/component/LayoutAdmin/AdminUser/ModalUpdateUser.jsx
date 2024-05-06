import {
  Drawer,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  message,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import {
  callGetAllRole,
  callUpdateAccount,
  callUploadFileUser,
} from "../../../service/api";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

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
function ModalUpdateUser({ visibleUpdateUser, setVisibleUpdateUser, user,handleRefesh }) {
  const [form] = Form.useForm();
  const [role, setRole] = useState([]);
  const [userConfirm, setUserConfirm] = useState({});
  const [loading, setLoading] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  const onFormChange = () => {
    setFormChanged(true);
  };
  const handleUpdateUser = async (values) => {
    let { firstName, lastName, email, phoneNumber, address, roleId } =
      values;
    let image = userConfirm.image;
    let res = await callUpdateAccount(
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      roleId,
      image,
      user.id
    );
    if (res && +res.EC === 0) {
      form.resetFields();
      message.success("Update user successfully");
      setVisibleUpdateUser(false);
      setFormChanged(false);
      handleRefesh();
    } else {
      message.error("Update user failed");
    }
  };
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        handleUpdateUser(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setVisibleUpdateUser(false);
    setUserConfirm({});
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
  useEffect(() => {
    if (user !== null && user !== undefined && Object.keys(user).length > 0) {
      setUserConfirm({ ...user, roleId: user.Role.id, image: user.image });
      form.setFieldsValue({ ...user, roleId: user.Role.id, image: user.image });
    }
  }, [user]);

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setUserConfirm(()=>({ ...userConfirm, image: "/user/" + res.DT.filename }));
      });
    }
  };
  const handleUpload = async ({ file }) => {
    let res = await callUploadFileUser(file);
    if (res && +res.EC === 0) {
      setUserConfirm(()=>({ ...userConfirm, image: "/user/" + res.DT.filename }));

    }
  };
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  return (
    <Drawer
      title="Update User"
      visible={visibleUpdateUser}
      onClose={handleCancel}
      width={720}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: "public" }}
        onValuesChange={onFormChange} // Listen for form changes
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
              <Input disabled={true} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phoneNumber"
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
              rules={[{ required: true, message: "Please select a category!" }]}
            >
              <Select
                // defaultValue={userConfirm.roleId}
                // onChange={handleChange}
                options={role}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="image"
              label="Avatar"
              valuePropName="file"
              rules={[
                { required: true, message: "Please confirm your avatar!" },
                {
                  validator: (_, value) => {
                    if (!userConfirm.image && !value) {
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
                {userConfirm?.image ? (
                  <img
                    src={
                      import.meta.env.VITE_APP_BE_API_URL + userConfirm.image
                    }
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
      <div style={{ textAlign: "right", marginTop: "15px" }}>
        <Button onClick={handleCancel} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button
          onClick={handleOk}
          type="primary"
          disabled={!formChanged} // Disable the button when user equals userConfirm
        >
          OK
        </Button>
      </div>
    </Drawer>
  );
}

export default ModalUpdateUser;
