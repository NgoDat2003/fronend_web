import { Col, Divider, Form, Image, Input, Modal, Row, message  } from "antd";
import { FaChevronRight } from "react-icons/fa";
import { useState } from "react";
import logon_img from "../../image/login_img.png";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./Register.scss";
import { callRegister } from "../../service/api";
function Register() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  const onFinish = async (values) => {
    console.log("Success:", values);
    if (values.password === values.passwordconfirm) {
      let { username, firstname, lastname, password} = values;
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(username)) {
        message.error("Email không hợp lệ");
        return;
      }
      let res = await callRegister(username, firstname, lastname, password);
      console.log(res);
      if (res && +res.EC === 0) {
        message.success(res.EM);
        navigate("/login");
      } else {
        message.error(res.EM);
      }
    } else {
      message.error("Mật khẩu không trùng khớp");
      return;
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="modal_register">
      <div className="register">
        <Row className="register_row">
          <Col span={16} className="register_left">
            <h3>Xin chào</h3>
            <p>Đăng nhập hoặc Tạo tài khoản</p>
            <Form
              name="wrap"
              labelCol={{ flex: "110px" }}
              labelAlign="left"
              labelWrap
              wrapperCol={{ flex: 1 }}
              colon={false}
              style={{ maxWidth: 600 }}
              className="register_form"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Username"
                name="username"
                className="register_form_item"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="First name"
                name="firstname"
                className="register_form_item"
                rules={[
                  { required: true, message: "Please input your First name!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Last name"
                name="lastname"
                className="register_form_item"
                rules={[
                  { required: true, message: "Please input your Last name!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                className="register_form_item"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="passwordconfirm"
                className="register_form_item"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item className="">
                <button className="btn_register">Đăng Ký</button>
              </Form.Item>
              <Divider plain></Divider>
              <div className="register_form_bottom">
                <div onClick={() => navigate("/")}>
                  <FaArrowLeft />
                  Quay lại trang chủ
                </div>
                <div onClick={() => navigate("/login")}>
                  Đăng nhập <FaArrowRight />
                </div>
              </div>
            </Form>
          </Col>
          <Col span={8} className="register_right">
            <img src={logon_img} alt="login_img" />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Register;
