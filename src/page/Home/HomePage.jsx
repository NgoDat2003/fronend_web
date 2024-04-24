import { Card, Col, Menu, Row,Pagination } from "antd";
import CaroselHomePage from "./CaroselHomePage";
import "./HomePage.scss";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { callGetProducts } from "../../service/api";
const HomePage = () => {
  const navigate = useNavigate();
  const checkLogin = useSelector((state) => state.user.isAuth);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const apiUrl = import.meta.env.VITE_APP_BE_API_URL;
  const getProduct = async () => {
    // Gọi API để lấy thông tin sản phẩm\
    let response = await callGetProducts(limit, currentPage);
    // Xử lý dữ liệu trả về
    if (response && +response.EC === 0) {
      setProducts(response.DT.data);
      setTotal(response.DT.totalPage);
    }
  };
  useEffect(() => {
    getProduct();
  }, [currentPage,limit,total]);
  // const dispatch = useDispatch();
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
  const onChange = (page) => {
    setCurrentPage(page);
    // getProduct();
  };
  const onShowSizeChange = (current, size) => {
    console.log("Current page:", current);
    console.log("New page size:", size);
    // Update the page size state
    // setPageSize(size);
    // Fetch new data based on the new page size
    // fetchProducts(current, size);
  };
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
          <Col span={17}>
            <Row gutter={[16, 8]}>
              {products.map((item, index) => (
                <Col span={8} className="product_card" key={index}>
                  <NavLink to={`/product/${item.id}`} className="product_link">
                    <Card
                      hoverable
                      // style={{ height: "100%" , width: "100%"}}
                      cover={
                        <img
                          alt="example"
                          src={apiUrl + item.mainImage}
                          className="product_card_img"
                        />
                      }
                    >
                      <div className="product_title">
                        <h3 className="product_hang>">
                          {item.screenBrand ||
                            item.laptopBrand ||
                            item.audioBrand ||
                            item.pcBrand}
                        </h3>
                        <div className="product_name">{item.productName}</div>
                        <div className="product_price">{item.price} ₫</div>
                      </div>
                    </Card>
                  </NavLink>
                </Col>
              ))}
              <Col span={24} className="product_pagination">
                <Pagination current={currentPage} total={total*limit}  pageSize={limit} onChange={onChange} onShowSizeChange={onShowSizeChange}/>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default HomePage;
