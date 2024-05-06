import {
  Col,
  Dropdown,
  Input,
  Row,
  Space,
  message,
  Popover,
  Badge,
  Menu,
} from "antd";
import "./Header.scss";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../image/logo.png";
import Search from "antd/es/input/Search";
import {
  FaUser,
  FaShoppingCart,
  FaRegUserCircle,
  FaRegCalendarCheck,
} from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { callGetCategories, callLogout } from "../../service/api";
import { logout } from "../../redux/UserSlice";
import CartPopover from "../CartPopover/CartPopover";
import { GrUserManager } from "react-icons/gr";
function Header() {
  const [listCategory, setListCategory] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.order.orders); // Replace with your actual selector

  const handleLogout = async () => {
    let res = await callLogout();
    if (res && +res.EC === 0) {
      message.success("Đăng xuất thành công");
      dispatch(logout());
    } else {
      message.error("Đăng xuất thất bại");
    }
  };

  const handleNavigation = (path, menu) => {
    navigate(path, { state: { selectedMenu: menu } });
  };
  const [content, setContent] = useState(
    <div className="content_list">
      <NavLink to="/profile" className="content_item">
        <FaRegUserCircle />
        <span>Thông tin cá nhân</span>
      </NavLink>
      <div
        onClick={() => handleNavigation("/profile", "Đơn hàng của tôi")}
        className="content_item"
      >
        <FaRegCalendarCheck />
        <span>Quản lý đơn hàng</span>
      </div>
      <button className="btn btn_primary" onClick={handleLogout}>
        Đăng xuất
      </button>
    </div>
  );
  const user = useSelector((state) => state.user);
  const isAuth = user.isAuth;
  const image = user.user?.image;

  useEffect(() => {
    if (user && user.user?.roleId === 1) {
      setContent(
        <div className="content_list">
          <NavLink to="/admin" className="content_item">
            <GrUserManager />
            <span>Quản Lý</span>
          </NavLink>
          <NavLink to="/profile" className="content_item">
            <FaRegUserCircle />
            <span>Thông tin cá nhân</span>
          </NavLink>
          <div
            onClick={() => handleNavigation("/profile", "Đơn hàng của tôi")}
            className="content_item"
          >
            <FaRegCalendarCheck />
            <span>Quản lý đơn hàng</span>
          </div>
          <button className="btn btn_primary" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      );
    }
  }, [user]);
  const handleGetCategory = async () => {
    let response = await callGetCategories();
    if (response && +response.EC === 0) {
      setListCategory(response.DT);
    }
  };
  useEffect(() => {
    handleGetCategory();
  }, []);
  const title = (
    <div className="title">
      <div className="title_avatar">
        <img src={import.meta.env.VITE_APP_BE_API_URL + image} alt="" />
      </div>
      <div className="title_info">
        <p className="title_name">{user.user?.lastName}</p>
        <p className="title_email">{user.user?.email}</p>
      </div>
    </div>
  );
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
              <Popover
                content={content}
                trigger="hover"
                title={title}
                overlayStyle={{ width: 250 }}
              >
                <Space className="header_right_space">
                  {image ? (
                    <img
                      style={{ height: 36, width: 36, borderRadius: 20 }}
                      src={import.meta.env.VITE_APP_BE_API_URL + image}
                    />
                  ) : (
                    <FaUser className="header_right-icon" />
                  )}
                  {user.isAuth ? (
                    <p className="text">
                      Xin chào,
                      <br />
                      {user.user?.lastName}
                    </p>
                  ) : (
                    <p className="text">Tài khoản</p>
                  )}
                </Space>
              </Popover>
            ) : (
              <div className="header-option">
                <FaRegUserCircle className="header-option-icon" />
                <div className="list-option">
                  <NavLink to="/login" className="text">
                    Đăng nhập
                  </NavLink>
                  <NavLink to="/register" className="text">
                    Đăng ký
                  </NavLink>
                </div>
              </div>
            )}

            <Popover content={<CartPopover />} trigger="hover">
              <div className="header_cart" onClick={() => navigate("/cart")}>
                <Badge count={cart.length} showZero>
                  <MdOutlineShoppingCart className="header_cart-icon" />
                </Badge>
                <p>Giỏ Hàng</p>
              </div>
            </Popover>
          </Col>
          <Col offset={4}>
            <div className="header__category">
              {listCategory.map((item) => (
                <NavLink
                  to={`/category/${item.id}`}
                  className="header_category"
                  activeClassName="active"
                >
                  {item.categoryName}
                </NavLink>
              ))}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Header;
