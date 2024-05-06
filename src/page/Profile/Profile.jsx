import "./Profile.scss";
import { useSelector } from "react-redux";
import { Row, Col, Form, Input, Button } from "antd";
import { FaRegUserCircle } from "react-icons/fa";
import { GoChecklist } from "react-icons/go";
import { useEffect, useState } from "react";
import { callUpdateAccount } from "../../service/api";
import { useNavigate } from "react-router-dom";
import CartManager from "../CartManager/CartManager";
import { useLocation } from 'react-router-dom';
function Profile() {
  const location = useLocation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState(location.state?.selectedMenu || "Thông tin tài khoản");
  const user = useSelector((state) => state.user);
  const isAuth = user.isAuth;
  const image = user.user?.image;
  const onFinish = (values) => {
    let { firstName, lastName, email, phoneNumber, address } = values;
    let id = user.user.id;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      message.error("Email không hợp lệ");
      return;
    }
    callUpdateUser(firstName, lastName, phoneNumber, address, email, id);
  };
  const callUpdateUser = async (
    firstName,
    lastName,
    phoneNumber,
    address,
    email,
    id
  ) => {
    let res = await callUpdateAccount(
      firstName,
      lastName,
      phoneNumber,
      address,
      email,
      id
    );
    if (res && +res.EC === 0) {
      message.success(res.EM);
    } else {
      message.error(res.EM);
    }
  };

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/");
      return;
    }
    form.setFieldsValue({
      firstName: user.user?.firstName,
      lastName: user.user?.lastName,
      email: user.user?.email,
      phoneNumber: user.user?.phoneNumber,
      address: user.user?.address,
    });
  }, [user.user, form]);
  return (
    <div className="profile_container">
      <Row className="profile">
        <Col className="profile_left" span={6}>
          <div className="profile_left_info">
            <div className="profile_left_info_avatar">
              <img src={import.meta.env.VITE_APP_BE_API_URL + image} alt="" />
            </div>
            <div className="profile_left_info_name">
              <span>
                Tài khoản của <h5>Nguyễn Văn A</h5>
              </span>
            </div>
          </div>
          <div className="profile_left_menu">
            <ul>
              <li
                className={
                  selectedMenu === "Thông tin tài khoản" ? "active" : ""
                }
                onClick={() => handleMenuClick("Thông tin tài khoản")}
              >
                <FaRegUserCircle className="profile_left-icon" />
                <span>Thông tin tài khoản</span>
              </li>
              <li
                className={selectedMenu === "Đơn hàng của tôi" ? "active" : ""}
                onClick={() => handleMenuClick("Đơn hàng của tôi")}
              >
                <GoChecklist className="profile_left-icon" />
                <span>Đơn hàng của tôi</span>
              </li>
            </ul>
          </div>
        </Col>
        <Col className="profile_right" span={18}>
          {selectedMenu === "Thông tin tài khoản" ? (
            // Your profile form here
            <div className="profile_form">
              <h3>Thông tin tài khoản</h3>
              <Form
                form={form}
                name="profile"
                onFinish={onFinish}
                layout="vertical"
                initialValues={profile}
              >
                <Row gutter={[8, 4]}>
                  <Col span={12}>
                    <Form.Item name="firstName" label="Họ">
                      <Input placeholder="Họ" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="lastName" label="Tên">
                      <Input placeholder="Tên" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="email" label="Email">
                      <Input placeholder="Email" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="phoneNumber" label="Số điện thoại">
                      <Input placeholder="Số điện thoại" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name="address" label="Địa chỉ">
                      <Input placeholder="Địa chỉ" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Cập nhật
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          ) : (
            // Your CartManager here
            <CartManager />
          )}
        </Col>
      </Row>
    </div>
  );
}

export default Profile;
