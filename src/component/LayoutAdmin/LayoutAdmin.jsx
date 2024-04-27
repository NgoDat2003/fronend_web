import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import "./LayoutAdmin.scss";
import logo from "../../image/logo.png";
import { Col, Row } from "antd";
import { GrHostMaintenance, GrUserManager } from "react-icons/gr";
import { FaBorderAll } from "react-icons/fa6";
import { IoHomeOutline } from "react-icons/io5";
import { TiShoppingCart } from "react-icons/ti";
import { NavLink } from "react-router-dom";
import "./LayoutAdmin.scss";
import AdminMain from "../../page/AdminMain/AdminMain";
import AdminUser from "../../page/AdminUser/AdminUser";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const { Header, Sider, Content } = Layout;

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  // const isAuth = useDispatch(state=>state.user.isAuth);
  // const role = useDispatch(state=>state.user.user);
  const isAuth = useSelector((state) => state.user.isAuth);
  const role = useSelector((state) => state.user.user.roleId);
  const navigate = useNavigate();
  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };
  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
    console.log(role);
    if(role !== 1){
      navigate("/");
    }
  }, [isAuth]);


  const renderContent = () => {
    switch (selectedKey) {
      case "1":
        return <AdminMain />;
      case "2":
        return <AdminUser />;
      case "3":
        return <div>Layout with content 3</div>;
      case "4":
        return <div>Layout with content 4</div>;
      default:
        return <div>Content</div>;
    }
  };
  return (
    <div
      className="container_layout"
      style={{ height: "100vh", width: "100%" }}
    >
      <Header style={{ padding: 0 }}>
        <Row>
          <Col span={4}>
            <NavLink
              to="/"
              style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
              <img className="logo_img" src={logo} alt="" />{" "}
              <span>Tên Logo</span>
            </NavLink>
          </Col>
        </Row>
      </Header>
      <Layout>
        <Sider
          trigger={null}
          width={collapsed ? 80 : 250}
          collapsible
          collapsed={collapsed}
          style={{ background: "white" }}
        >
          <div className="demo-logo-vertical" />
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <Menu
              theme="light"
              mode="inline"
              defaultSelectedKeys={["1"]}
              style={{ fontSize: 16 }}
              onClick={handleMenuClick}
            >
              <Menu.Item key="1" icon={<IoHomeOutline />}>
                Trang Chủ
              </Menu.Item>
              <Menu.Item key="2" icon={<GrUserManager />}>
                Quản Lý Người Dùng
              </Menu.Item>
              <Menu.Item key="3" icon={<FaBorderAll />}>
                Quản Lý Sản Phẩm
              </Menu.Item>
              <Menu.Item key="4" icon={<TiShoppingCart />}>
                Quản Lý Đơn Hàng
              </Menu.Item>
            </Menu>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                marginTop: "auto",
              }}
            />
          </div>
        </Sider>
        <Layout className="layout_form">
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: "80vh",
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default LayoutAdmin;
