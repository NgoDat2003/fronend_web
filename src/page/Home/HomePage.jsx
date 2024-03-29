import { Card, Col, Menu, Row } from "antd";
import CaroselHomePage from "./CaroselHomePage";
import "./HomePage.scss";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import product from "../../image/product.png";
import { NavLink } from "react-router-dom";
const HomePage = () => {
  const items = [
    {
      label: "Laptop",
      key: "sub1",
      icon: <MailOutlined />,
      children: [
        {
          label: "Thương hiệu nổi tiếng",
          children: [
            { label: "Apple", key: "1" },
            { label: "Acer", key: "2" },
            { label: "Asus", key: "3" },
            { label: "Dell", key: "4" },
            { label: "HP", key: "5" },
            { label: "Lenovo", key: "6" },
            { label: "MSI", key: "7" },
            { label: "Samsung", key: "8" },
            { label: "LG", key: "9" },
            { label: "Sony", key: "10" },
            { label: "Toshiba", key: "11" },
            { label: "Vaio", key: "12" },
          ],
        },
        {
          label: "Cấu hình",
          children: [
            { label: "RTX 30 series", key: "13" },
            { label: "RTX 20 series", key: "14" },
            { label: "GTX 16 series", key: "15" },
            { label: "GTX 10 series", key: "16" },
            { label: "Intel Core i9", key: "17" },
            { label: "Intel Core i7", key: "18" },
            { label: "Intel Core i5", key: "19" },
            { label: "Intel Core i3", key: "20" },
            { label: "AMD Ryzen 9", key: "21" },
            { label: "AMD Ryzen 7", key: "22" },
            { label: "AMD Ryzen 5", key: "23" },
            { label: "AMD Ryzen 3", key: "24" },
          ],
        },
        {
          label: "Kích thước màn hình",
          children: [
            { label: "13.3 inch", key: "25" },
            { label: "14 inch", key: "26" },
            { label: "15.6 inch", key: "27" },
            { label: "17.3 inch", key: "28" },
          ],
        },
      ],
    },
    {
      label: "Sản phẩm Apple",
      key: "sub2",
      icon: <AppstoreOutlined />,
      children: [
        {
          label: "Macbook",
          key: "sub3",
          children: [
            { label: "Macbook Air", key: "29" },
            { label: "Macbook Pro", key: "30" },
          ],
        },
        {
          label: "IPhone",
          key: "sub4",
          children: [
            { label: "IPhone Air", key: "31" },
            { label: "IPhone Pro", key: "32" },
          ],
        },
      ],
    },
    {
      label: "Điện máy gia dụng",
      key: "sub4",
      icon: <SettingOutlined />,
      children: [
        {
          label: "Tivi",
          key: "sub5",
          children: [
            { label: "Tivi Samsung", key: "33" },
            { label: "Tivi LG", key: "34" },
            { label: "Tivi Sony", key: "35" },
            { label: "Tivi Panasonic", key: "36" },
            { label: "Tivi TCL", key: "37" },
            { label: "Tivi Sharp", key: "38" },
            { label: "Tivi Toshiba", key: "39" },
          ],
        },
        {
          label: "Máy giặt",
          key: "sub6",
          children: [
            { label: "Máy giặt Samsung", key: "40" },
            { label: "Máy giặt LG", key: "41" },
            { label: "Máy giặt Panasonic", key: "42" },
            { label: "Máy giặt Toshiba", key: "43" },
          ],
        },
      ],
    },
  ];
  const onClick = (e) => {
    console.log("click", e);
  };
  return (
    <div className="home_page">
      <div className="header_home">
        <CaroselHomePage />
      </div>
      <div className="main_home container">
        <Row gutter={16}>
          <Col span={7}>
            <Menu onClick={onClick} mode="inline" items={items} />
          </Col>
          <Col span={24}>
            <Row gutter={16}>
              <Col span={8} className="product_card">
                <NavLink to="/product">
                <Card
                  hoverable
                  // style={{ height: "100%" , width: "100%"}}
                  cover={<img alt="example" src={product}  className="product_card_img"/>}
                >
                  <div className="product_title">
                    <h3 className="product_hang>">MSI</h3>
                    <div className="product_name">Laptop MSI Cyborg 15 A12VE-412VN (i5-12450H) (Đen)</div>
                    <div className="product_price">20.990.000 ₫</div>
                  </div>
                </Card>
                </NavLink>
              </Col>
              <Col span={8} className="product_card">
                <Card
                  hoverable
                  // style={{ height: "100%" , width: "100%"}}
                  cover={<img alt="example" src={product}  className="product_card_img"/>}
                >
                  <div className="product_title">
                    <h3 className="product_hang>">MSI</h3>
                    <div className="product_name">Laptop MSI Cyborg 15 A12VE-412VN (i5-12450H) (Đen)</div>
                    <div className="product_price">20.990.000 ₫</div>
                  </div>
                </Card>
              </Col>
              <Col span={8} className="product_card">
                <Card
                  hoverable
                  // style={{ height: "100%" , width: "100%"}}
                  cover={<img alt="example" src={product}  className="product_card_img"/>}
                >
                  <div className="product_title">
                    <h3 className="product_hang>">MSI</h3>
                    <div className="product_name">Laptop MSI Cyborg 15 A12VE-412VN (i5-12450H) (Đen)</div>
                    <div className="product_price">20.990.000 ₫</div>
                  </div>
                </Card>
              </Col>
              <Col span={8} className="product_card">
                <Card
                  hoverable
                  // style={{ height: "100%" , width: "100%"}}
                  cover={<img alt="example" src={product}  className="product_card_img"/>}
                >
                  <div className="product_title">
                    <h3 className="product_hang>">MSI</h3>
                    <div className="product_name">Laptop MSI Cyborg 15 A12VE-412VN (i5-12450H) (Đen)</div>
                    <div className="product_price">20.990.000 ₫</div>
                  </div>
                </Card>
              </Col>
              <Col span={8} className="product_card">
                <Card
                  hoverable
                  // style={{ height: "100%" , width: "100%"}}
                  cover={<img alt="example" src={product}  className="product_card_img"/>}
                >
                  <div className="product_title">
                    <h3 className="product_hang>">MSI</h3>
                    <div className="product_name">Laptop MSI Cyborg 15 A12VE-412VN (i5-12450H) (Đen)</div>
                    <div className="product_price">20.990.000 ₫</div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default HomePage;
