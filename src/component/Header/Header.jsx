import { Col, Dropdown, Input, Row, Space,message } from "antd";
import "./Header.scss";
import { NavLink } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import logo from "../../image/logo.png";
import Search from "antd/es/input/Search";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { callLogout } from "../../service/api";
import { logout } from "../../redux/UserSlice";
function Header() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    let res = await callLogout();
    if(res && +res.EC === 0){
      message.success("Đăng xuất thành công");
      dispatch(logout())
    }else{
      message.error("Đăng xuất thất bại");
    }

  }
  const user = useSelector((state) => state.user);
  const items = [
    {
      key: "1",
      label: <NavLink to="/login">Đăng nhập</NavLink>,
    },
    {
      key: "2",
      label: <NavLink to="/register">Đăng ký</NavLink>,
    },
  ];
  const items2 = [
    {
      key: "1",
      label: <NavLink to="/login">Thông tin cá nhân</NavLink>,
    },
    {
      key: "2",
      label: <div onClick={handleLogout}>Đăng xuất</div>,
    },
  ]
  useEffect(() => {
    console.log(user);
    if(user && user.user?.roleId === 1){
      items2.push({
        key: "3",
        label: <NavLink to="/admin">Quản trị</NavLink>,
      })
    }
    if(user && user.isAuth){
      items.splice(0,2);
      items.push(...items2);
    }
  }, [user]);

  const category_header = ["Laptop AI", "macbook"];
  return (
    <div className="header">
      <div className="header_container">
        <Row className="header_row" gutter={48}>
          <Col span={4}>
            <div className="header__logo">
              <NavLink to="/">
                <img className="logo_img" src={logo} alt="" />
              </NavLink>
            </div>
          </Col>
          <Col span={14}>
            <div className="header_center">
              <Search
                placeholder="input search text"
                enterButton
                size="large"
              />
              <ul className="header_category">
                {category_header.map((item, index) => (
                  <li key={index}>
                    <NavLink to="/" className="header_item">
                      {item}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
          <Col span={6} className="header_right">
            <Dropdown menu={{ items }} trigger={["click"]}>
              <Space style={{ fontSize: "18px" }}>
                <FaUser />
                {user.isAuth ? user.user?.lastName : "Tài khoản"}
                <DownOutlined />
              </Space>
            </Dropdown>
            <div className="header_cart">
              <FaShoppingCart />
              Giỏ Hàng
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Header;
