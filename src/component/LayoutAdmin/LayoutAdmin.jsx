import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Image } from "antd";
import "./LayoutAdmin.scss";
import logo from "../../image/logo.png";
import { Col, Row } from "antd";
import { GrHostMaintenance, GrUserManager } from "react-icons/gr";
import { FaBorderAll } from "react-icons/fa6";
import { IoHomeOutline } from "react-icons/io5";
import { TiShoppingCart } from "react-icons/ti";
import { NavLink } from "react-router-dom";
import "./LayoutAdmin.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminProduct from "./AdminProduct/AdminProduct";
import AdminMain from "./AdminMain/AdminMain";
import AdminUser from "./AdminUser/AdminUser";
import AdminOrder from "./AdminOrder/AdminOrder";
const { Header, Sider, Content } = Layout;

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const name = useSelector((state) => state.user.user.lastName);
  // const isAuth = useDispatch(state=>state.user.isAuth);
  // const role = useDispatch(state=>state.user.user);
  const isAuth = useSelector((state) => state.user.isAuth);
  const role = useSelector((state) => state.user.user.roleId);
  const loading = useSelector((state) => state.user.isLoading);
  const navigate = useNavigate();
  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };
  useEffect(() => {
    if (!loading) {
      if (!isAuth || role !== 1) {
        navigate("/");
      }
    }
  }, [isAuth, role, loading]); // Add role to the dependencies array

  const renderContent = () => {
    switch (selectedKey) {
      case "1":
        return <AdminMain />;
      case "2":
        return <AdminUser />;
      case "3":
        return <AdminProduct />;
      case "4":
        return <AdminOrder />;
      default:
        return <div>Content</div>;
    }
  };
  return (
    <div
      className="container_layout"
      style={{ height: "100vh", width: "100%" }}
    >
      <Header className="header_admin">
        <div className="header__logo">
          <NavLink to="/" className="header_left">
            <Image
              className="logo_img"
              preview={false}
              // width={200}
              src={logo}
            />
            <span>Electronic Shop </span>
          </NavLink>
        </div>
        <div className="header__right">
          <span>Hello, {name}</span>
        </div>
      </Header>
      <Layout className="layout">
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
