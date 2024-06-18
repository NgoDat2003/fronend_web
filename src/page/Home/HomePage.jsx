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
  const [limit, setLimit] = useState(12);
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
  const onChange = (page) => {
    setCurrentPage(page);
    // getProduct();
  };
  const onShowSizeChange = (current, size) => {
    // Update the page size state
    // setPageSize(size);
    // Fetch new data based on the new page size
    // fetchProducts(current, size);
  };
  const onClick = (e) => {
  };
  return (
    <div className="home_page">
      <div className="header_home">
        <CaroselHomePage />
      </div>
      <div className="main_home container">
        <Row gutter={16}>
          <Col span={24}>
            <Row gutter={[16, 8]}>
              {products.map((item, index) => (
                <Col xs={12} sm={12} md={8} lg={6} xl={6} className="product_card" key={index}>
                  <NavLink to={`/product/${item.id}`} className="product_link">
                    <Card
                      hoverable
                      style={{minHeight: "250px"}}
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
