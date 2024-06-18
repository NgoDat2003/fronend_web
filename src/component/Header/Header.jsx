import {
  Col,
  Row,
  Space,
  message,
  Popover,
  Badge,
  Image,
  AutoComplete,
  Menu,
  Button,
  Drawer,
} from "antd";
import { CiMenuBurger } from "react-icons/ci";
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
import { Children, useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import {
  callGetCategories,
  callGetProductSearch,
  callLogout,
} from "../../service/api";
import { logout } from "../../redux/UserSlice";
import CartPopover from "../CartPopover/CartPopover";
import { GrUserManager } from "react-icons/gr";
function Header() {
  const [listCategory, setListCategory] = useState([]);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.order.orders); // Replace with your actual selector
  const [options, setOptions] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleMenuClick = () => {
    setDrawerVisible(true);
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
  };
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
  const handleGetProductSearch = async (value) => {
    let response = await callGetProductSearch(value);
    if (response && +response.EC === 0) {
      const data = response.DT.map((item) => ({
        key: item.id,
        value: item.productName,
        label: (
          <Space>
            <Row gutter={16} style={{ alignItems: "center" }}>
              <Col span={6}>
                <Image
                  src={import.meta.env.VITE_APP_BE_API_URL + item.mainImage}
                  width={100}
                />
              </Col>
              <Col span={14} className="product_search-name">
                <p>{item.productName}</p>
              </Col>
              <Col span={4}>
                <p style={{ color: "red" }}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.price)}
                </p>
              </Col>
            </Row>
          </Space>
        ),
      }));
      setOptions(data);
    }
  };
  const items = [
    {
      icon: <CiMenuBurger />,
      children: [
        {
          key: "1",
          label: "Đăng nhập",
          to: "/login",
        },
        {
          key: "2",
          label: "Đăng ký",
          to: "/register",
        },
        {
          key: "3",
          label: (
            <div className="header_cart" onClick={() => navigate("/cart")}>
              <Badge count={cart.length} showZero>
                <MdOutlineShoppingCart className="header_cart-icon" />
              </Badge>
              <p>Giỏ Hàng</p>
            </div>
          ),
        },
      ],
    },
  ];
  const menu = (
    <Menu>
      {items.map((item) => (
        <Menu.Item key={item.key}>
          {item.to ? (
            <NavLink to={item.to} className="text">
              {item.label}
            </NavLink>
          ) : (
            item.label
          )}
        </Menu.Item>
      ))}
    </Menu>
  );
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

  const items_sm = [
    {
      label: (
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
      ),
      children: [
        {
          key: "profile",
          label: "Thông tin cá nhân",
          icon: <FaRegUserCircle />,
          onClick: () => handleNavigation("/profile"),
        },
        {
          key: "orders",
          label: "Quản lý đơn hàng",
          icon: <FaRegCalendarCheck />,
          onClick: () => handleNavigation("/profile", "Đơn hàng của tôi"),
        },
        {
          key: "logout",
          label: "Đăng xuất",
          onClick: handleLogout,
        },
        {
          key: "login",
          label: (
            <NavLink to="/login" className="text">
              Đăng nhập
            </NavLink>
          ),
        },
        {
          key: "register",
          label: (
            <NavLink to="/register" className="text">
              Đăng ký
            </NavLink>
          ),
        },
      ],
    },
    {
      key: "cart",
      label: (
        <Popover content={<CartPopover />} trigger="hover">
          <div className="header_cart" onClick={() => navigate("/cart")}>
            <Badge count={cart.length} showZero>
              <MdOutlineShoppingCart className="header_cart-icon" />
            </Badge>
            <p>Giỏ Hàng</p>
          </div>
        </Popover>
      ),
    },
  ];
  return (
    <div className="header">
      <div className="header_container">
        <Row
          className="header_row"
          gutter={{ xs: 16, sm: 16, md: 32, lg: 48, xl: 48, xxl: 48 }}
        >
          <Col
            xs={{ span: 12, order: 1 }}
            md={{ span: 6, order: 1 }}
            className="header__logo"
          >
            <NavLink to="/" className="header_left">
              <Image
                className="logo_img"
                preview={false}
                // width={200}
                src={logo}
              />
              <span className="header_left-span">Electronic Shop </span>
            </NavLink>
          </Col>
          <Col
            xs={{ span: 24, order: 3 }}
            md={{ span: 11, order: 2 }}
            className="header__search-and-category"
          >
            <Row gutter={[0, 12]}>
              <Col span={24}>
                <div className="header_center">
                  <AutoComplete
                    options={options}
                    value={search}
                    onSearch={handleGetProductSearch}
                    onChange={(productName) => setSearch(productName)}
                    onSelect={(productName) => {
                      const selectedOption = options.find(
                        (option) => option.value === productName
                      );
                      if (selectedOption) {

                        // You can call your API here with the id
                        navigate(`/product/${selectedOption.key}`);
                      }
                    }}
                  >
                    <Search
                      placeholder="Nhập thông tin sản phẩm cần tìm kiếm ...."
                      enterButton
                      size="large"
                    />
                  </AutoComplete>
                </div>
              </Col>
              <Col offset={0}>
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
          </Col>
          <Col
            xs={{ span: 0, order: 2 }}
            md={{ span: 7, order: 3 }}
            className="header_right"
          >
            {isAuth ? (
              <Popover content={content} trigger="hover" title={title}>
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
          <Col
            xs={{ span: 12, order: 2 }}
            md={{ span: 0, order: 3 }}
            className="header_right-menu"
          >
            <CiMenuBurger
              onClick={handleMenuClick}
              className="header_right-icon"
            />

            <Drawer
              title="Thông tin tài khoản"
              placement="right"
              closable={true}
              onClose={handleCloseDrawer}
              visible={drawerVisible}
              className="header_drawer-sm"
            >
              <Menu mode="inline" items={items_sm} style={{height:80}} />
              {/* {isAuth ? (
              ) : (
                <div className="header-option">
                  <div className="list-option">
                    <NavLink to="/login" className="text">
                      Đăng nhập
                    </NavLink>
                    <NavLink to="/register" className="text">
                      Đăng ký
                    </NavLink>
                  </div>
                </div>
              )} */}

              {/* <Popover content={<CartPopover />} trigger="hover">
                <div className="header_cart" onClick={() => navigate("/cart")}>
                  <Badge count={cart.length} showZero>
                    <MdOutlineShoppingCart className="header_cart-icon" />
                  </Badge>
                  <p>Giỏ Hàng</p>
                </div>
              </Popover> */}
            </Drawer>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Header;
