import { Col, Dropdown, Input, Row, Space, message } from "antd";
import "./Header.scss";
import { NavLink } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import logo from "../../image/logo.png";
import Search from "antd/es/input/Search";
import { FaUser, FaShoppingCart,FaRegUserCircle } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { callLogout } from "../../service/api";
import { logout } from "../../redux/UserSlice";
function Header() {
  
  const dispatch = useDispatch();

  const handleLogout = async () => {
    let res = await callLogout();
    if (res && +res.EC === 0) {
      message.success("Đăng xuất thành công");
      dispatch(logout());
    } else {
      message.error("Đăng xuất thất bại");
    }
  };
  const user = useSelector((state) => state.user);
  const isAuth = user.isAuth;
  const image = user.user?.image;
  let items = [
    {
      key: "1",
      label: <NavLink to="/profile">Thông tin cá nhân</NavLink>,
    },
    {
      key: "2",
      label: <div onClick={handleLogout}>Đăng xuất</div>,
    },
  ];
  useEffect(() => {
    if (user && user.user?.roleId === 1) {
      items.unshift({
        key: "3",
        label: <NavLink to="/admin">Quản Lý</NavLink>,
      });
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
                placeholder="Nhập thông tin sản phẩm cần tìm kiếm ...."
                enterButton
                size="large"
              />
            </div>
          </Col>
          <Col span={6} className="header_right">
            {isAuth ? (
              <Dropdown menu={{ items }} trigger={["click"]} className="header_right-dropdown">
                <Space className="header_right_space">
                  {console.log(import.meta.env.VITE_APP_BE_API_URL+image)}
                  {image ? (<img style={{height:36,width:36,borderRadius:20}} src={import.meta.env.VITE_APP_BE_API_URL+image}/>) : <FaUser className="header_right-icon" />}
                  {user.isAuth ? <p className="text">Xin chào,<br />{user.user?.lastName}</p>: <p className="text">Tài khoản</p>}
                </Space>
              </Dropdown>
            ) : (
              <div className="header-option">
                <FaRegUserCircle  className="header-option-icon" />
                <div className="list-option">
                  <NavLink to="/login" className="text">Đăng nhập</NavLink>
                  <NavLink to="/register" className="text">Đăng ký</NavLink>
                </div>
              </div>
            )}

            <div className="header_cart">
              <MdOutlineShoppingCart className="header_cart-icon"/>
              <p>Giỏ Hàng</p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Header;
