import { Button, Col, Divider, Form, Image, Input, Modal, Row,message } from "antd";
import "./Login.scss";
import { FaArrowLeft, FaArrowRight, FaChevronRight } from "react-icons/fa";
import { useState } from "react";
import logon_img from "../../image/login_img.png";
import { useNavigate } from "react-router-dom";
import { callLogin } from "../../service/api";
import { useDispatch } from 'react-redux';
import { login } from "../../redux/UserSlice";
function Login() {
  const dispatch = useDispatch();
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
  const onFinish = async(values) => {
    if(values.username && values.password){
      let { username, password} = values;
      let res = await callLogin(username, password);
      console.log("res login: ", res);
      if (res && +res.EC === 0) {
        dispatch(login(res.DT));
        message.success(res.EM);
        navigate("/");
      } else {
        message.error(res.EM);
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="modal_login">
      <div className="login">
        <Row className="login_row">
          <Col span={16} className="login_left">
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
              className="login_form"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Username"
                name="username"
                className="login_form_item"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                className="login_form_item"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item className="">
                <button className="btn_login">Đăng nhập</button>
              </Form.Item>
              <div className="login_forgot">Quên mật khẩu</div>

              <Divider plain></Divider>
              <div className="login_form_bottom">
                <div onClick={()=>navigate("/")}>
                  <FaArrowLeft />
                  Quay lại trang chủ
                </div>
                <div onClick={()=>navigate("/register")}>
                  Đăng ký tài khoản <FaArrowRight />
                </div>
              </div>
            </Form>
          </Col>
          <Col span={8} className="login_right">
            <img src={logon_img} alt="login_img" />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Login;
