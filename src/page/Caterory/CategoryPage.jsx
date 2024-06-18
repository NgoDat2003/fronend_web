import {
  Card,
  Col,
  Menu,
  Row,
  Pagination,
  Slider,
  InputNumber,
  Space,
  Select,
  Radio,
  Divider,
  Spin,
  Drawer,
} from "antd";
import { MdOutlineFilterAlt } from "react-icons/md";
import "./CategoryPage.scss";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdRefresh } from "react-icons/io";
import {
  callFilterProduct,
  callGetProducts,
  callGetProductsByCategory,
} from "../../service/api";
const { Option } = Select;
const CategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const checkLogin = useSelector((state) => state.user.isAuth);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalItem, setTotalItem] = useState(0);
  const apiUrl = import.meta.env.VITE_APP_BE_API_URL;
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [screenBrand, setScreenBrand] = useState(null);
  const [screenSize, setScreenSize] = useState(null);
  const [resolution, setResolution] = useState(null);
  const [panelType, setPanelType] = useState(null);
  const [pcBrand, setPcBrand] = useState(null);
  const [cpuSeries, setCpuSeries] = useState(null);
  const [ramSize, setRamSize] = useState(null);
  const [laptopBrand, setLaptopBrand] = useState(null);
  const [color, setColor] = useState(null);
  const [laptopCpuSeries, setLaptopCpuSeries] = useState(null);
  const [audioBrand, setAudioBrand] = useState(null);
  const [microphoneType, setMicrophoneType] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  // Add more state variables as needed
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const handlePriceChange = (value) => {
    setMinPrice(value[0] * 500000);
    setMaxPrice(value[1] * 500000);
  };

  useEffect(() => {
    handleFilter();
  }, [currentPage, limit, total, id]);
  // const dispatch = useDispatch();
  const onChange = (page) => {
    setCurrentPage(page);
    // getProduct();
  };
  useEffect(() => {
    handleReload();
  }, [id]);
  const onShowSizeChange = (current, size) => {
    // Update the page size state
    // setPageSize(size);
    // Fetch new data based on the new page size
    // fetchProducts(current, size);
  };
  useEffect(() => {
    handleReload();
  }, []);
  const componentFilter = () => {
    return (
      <div className="filter">
        {id && +id === 1 && (
          <div className="filter-item">
            <h3>Screen Brand</h3>
            <Radio.Group
              className="raido_list"
              onChange={(e) => setScreenBrand(e.target.value)}
              value={screenBrand}
            >
              <Radio.Button value="MSI">MSI</Radio.Button>
              <Radio.Button value="SAMSUNG">SAMSUNG</Radio.Button>
              <Radio.Button value="Dell">Dell</Radio.Button>
              <Radio.Button value="ACER">ACER</Radio.Button>
              <Radio.Button value="ASUS">ASUS</Radio.Button>
              <Radio.Button value="AOC">AOC</Radio.Button>
              <Radio.Button value="LG">LG</Radio.Button>
            </Radio.Group>
            <Divider />
            <h3>Screen Size</h3>
            <Radio.Group
              className="raido_list"
              onChange={(e) => setScreenSize(e.target.value)}
              value={screenSize}
            >
              <Radio.Button value="21.45">21.45</Radio.Button>
              <Radio.Button value="23.8">23.8</Radio.Button>
              <Radio.Button value="24">24</Radio.Button>
              <Radio.Button value="24.5">24.5</Radio.Button>
              <Radio.Button value="27">27</Radio.Button>
            </Radio.Group>
            <Divider />
            <h3>Resolution</h3>
            <Radio.Group
              className="raido_list"
              onChange={(e) => setResolution(e.target.value)}
              value={resolution}
            >
              <Radio.Button value="1920 x 1080">1920 x 1080</Radio.Button>
              <Radio.Button value="2560 x 1440">2560 x 1440</Radio.Button>
              <Radio.Button value="3840 x 2160">3840 x 2160</Radio.Button>
            </Radio.Group>
            <Divider />
            <h3>Panel Type</h3>
            <Radio.Group
              className="raido_list"
              onChange={(e) => setPanelType(e.target.value)}
              value={panelType}
            >
              <Radio.Button value="IPS">IPS</Radio.Button>
              <Radio.Button value="VA">VA</Radio.Button>
              <Radio.Button value="TN">TN</Radio.Button>
            </Radio.Group>
          </div>
        )}
        {id && +id === 3 && (
          <div className="filter-item">
            <h3>PC Brand</h3>
            <Radio.Group
              className="raido_list"
              onChange={(e) => setPcBrand(e.target.value)}
              value={pcBrand}
            >
              <Radio.Button value="Phong Vũ">Phong Vũ</Radio.Button>
              <Radio.Button value="ACER">ACER</Radio.Button>
              <Radio.Button value="Dell">Dell</Radio.Button>
              <Radio.Button value="ASUS">ASUS</Radio.Button>
            </Radio.Group>
            <Divider />
            <h3>CPU Series</h3>
            <Radio.Group
              className="raido_list"
              onChange={(e) => setCpuSeries(e.target.value)}
              value={cpuSeries}
            >
              <Radio.Button value="Core i3">Core i3</Radio.Button>
              <Radio.Button value="Core i5">Core i5</Radio.Button>
              <Radio.Button value="Core i7">Core i7</Radio.Button>
              <Radio.Button value="Core i9">Core i9</Radio.Button>
            </Radio.Group>
            <Divider />
            <h3>RAM Size</h3>
            <Radio.Group
              className="raido_list"
              onChange={(e) => setRamSize(e.target.value)}
              value={ramSize}
            >
              <Radio.Button value="8GB">8GB</Radio.Button>
              <Radio.Button value="16GB">16GB</Radio.Button>
              <Radio.Button value="32GB">32GB</Radio.Button>
              <Radio.Button value="64GB">64GB</Radio.Button>
            </Radio.Group>
          </div>
        )}
        {id && +id === 2 && (
          <div className="filter-item">
            <h3>Laptop Brand</h3>
            <Radio.Group
              className="raido_list"
              onChange={(e) => setLaptopBrand(e.target.value)}
              value={laptopBrand}
            >
              <Radio.Button value="Acer">Acer</Radio.Button>
              <Radio.Button value="ASUS">ASUS</Radio.Button>
              <Radio.Button value="Dell">Dell</Radio.Button>
              <Radio.Button value="HP">HP</Radio.Button>
              <Radio.Button value="Lenovo">Lenovo</Radio.Button>
            </Radio.Group>
            <Divider />
            <h3>Color</h3>
            <Radio.Group
              className="raido_list"
              onChange={(e) => setColor(e.target.value)}
              value={color}
            >
              <Radio.Button value="Bạc">Bạc</Radio.Button>
              <Radio.Button value="Xanh">Xanh</Radio.Button>
              <Radio.Button value="Xám">Xám</Radio.Button>
            </Radio.Group>
            <Divider />
            <h3>Laptop CPU Series</h3>
            <Radio.Group
              className="raido_list"
              onChange={(e) => setLaptopCpuSeries(e.target.value)}
              value={laptopCpuSeries}
            >
              <Radio.Button value="AMD Ryzen 5 7520U">
                AMD Ryzen 5 7520U
              </Radio.Button>
              <Radio.Button value="Intel Core i7-1360P">
                Intel Core i7-1360P
              </Radio.Button>
            </Radio.Group>
          </div>
        )}
        {id && +id === 4 && (
          <div className="filter-item">
            <h3>Audio Brand</h3>
            <Radio.Group
              className="raido_list"
              onChange={(e) => setAudioBrand(e.target.value)}
              value={audioBrand}
            >
              <Radio.Button value="STEELSERIES">STEELSERIES</Radio.Button>
              <Radio.Button value="LOGITECH">LOGITECH</Radio.Button>
              <Radio.Button value="JBL">JBL</Radio.Button>
            </Radio.Group>
            <Divider />
            <h3>Microphone Type</h3>
            <Radio.Group
              className="raido_list"
              onChange={(e) => setMicrophoneType(e.target.value)}
              value={microphoneType}
            >
              <Radio.Button value="Không dây">Không dây</Radio.Button>
              <Radio.Button value="Có dây">Có dây</Radio.Button>
            </Radio.Group>
          </div>
        )}
      </div>
    );
  };
  const handleReload = () => {
    setScreenBrand(null);
    setScreenSize(null);
    setResolution(null);
    setPanelType(null);
    setPcBrand(null);
    setCpuSeries(null);
    setRamSize(null);
    setLaptopBrand(null);
    setColor(null);
    setLaptopCpuSeries(null);
    setAudioBrand(null);
    setMicrophoneType(null);
    setMinPrice(0);
    setMaxPrice(50000000);
    setReloadKey((prevKey) => prevKey + 1);
  };
  const handleFilter = async () => {
    setIsLoading(true);
    let res = await callFilterProduct(
      screenBrand,
      screenSize,
      resolution,
      panelType,
      pcBrand,
      cpuSeries,
      ramSize,
      laptopBrand,
      color,
      laptopCpuSeries,
      audioBrand,
      microphoneType,
      minPrice,
      maxPrice,
      id,
      limit,
      currentPage
    );
    if (res && +res.EC === 0) {
      setProducts(res.DT.data);
      setTotal(res.DT.totalPage);
      setTotalItem(res.DT.totalItems);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    handleFilter();
  }, [
    screenBrand,
    screenSize,
    resolution,
    panelType,
    pcBrand,
    cpuSeries,
    ramSize,
    laptopBrand,
    color,
    laptopCpuSeries,
    audioBrand,
    microphoneType,
    minPrice,
    maxPrice,
  ]);
  return (
    <Spin spinning={isLoading}>
      <div className="home_page">
        <div className="main_home container">
          <Row gutter={16}>
            <Col xs={0} sm={0} md={8} lg={6} xl={6} className="category_left">
              <div className="category_left_container">
                <div className="category_left_title">
                  <h3>Danh sách sản phẩm</h3>
                  <IoMdRefresh
                    style={{ fontSize: 24, cursor: "pointer" }}
                    onClick={handleReload}
                  />
                </div>
                <Divider />
                <h3>Khoảng giá</h3>
                <Slider
                  range
                  key={reloadKey}
                  defaultValue={[0, 50000000]}
                  onChange={handlePriceChange}
                />
                <Space className="category_space">
                  <InputNumber
                    className="category_space-input"
                    min={0}
                    max={50000000}
                    value={minPrice}
                    onChange={(value) => setMinPrice(value)}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ₫"
                    }
                    parser={(value) => value.replace(/\₫\s?|(,*)/g, "")}
                  />
                  <InputNumber
                    className="category_space-input"
                    min={0}
                    max={50000000}
                    value={maxPrice}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ₫"
                    }
                    parser={(value) => value.replace(/\₫\s?|(,*)/g, "")}
                    onChange={(value) => setMaxPrice(value)}
                  />
                </Space>
                <Divider />
                {componentFilter()}
              </div>
            </Col>
            <Col xs={24} sm={24} md={0} lg={0} xl={0}>
              <div className="category_left_mobile">
                <div className="category_left_mobile-left">
                  <h3>Danh sách sản phẩm</h3>
                  <IoMdRefresh
                    style={{ fontSize: 24, cursor: "pointer" }}
                    onClick={handleReload}
                  />
                </div>
                <button
                  className="category_left_mobile-right btn"
                  onClick={showDrawer}
                >
                  Bộ lọc
                  <MdOutlineFilterAlt />
                </button>
              </div>
            </Col>
            <Col xs={24} sm={24} md={14} lg={16} xl={16}>
              <Row gutter={[8, 8]}>
                {products.map((item, index) => (
                  <Col  xs={12} sm={12} md={12} lg={8} xl={8} className="product_card" key={index}>
                    <NavLink
                      to={`/product/${item.id}`}
                      className="product_link"
                    >
                      <Card
                        hoverable
                        style={{ minHeight: "250px" }}
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
                          <div className="product_price">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.price)}{" "}
                          </div>
                        </div>
                      </Card>
                    </NavLink>
                  </Col>
                ))}
                <Col span={24} className="product_pagination">
                  <Pagination
                    current={currentPage}
                    total={totalItem}
                    pageSize={limit}
                    onChange={onChange}
                    onShowSizeChange={onShowSizeChange}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
      <Drawer
        title="Bộ lọc sản phẩm"
        placement="right"
        onClose={onClose}
        open={open}
        width="80%"
      >
        <div className="category_left_container">
          <h3>Khoảng giá</h3>
          <Slider
            range
            key={reloadKey}
            defaultValue={[0, 50000000]}
            onChange={handlePriceChange}
          />
          <Space className="category_space">
            <InputNumber
              className="category_space-input"
              min={0}
              max={50000000}
              value={minPrice}
              onChange={(value) => setMinPrice(value)}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ₫"
              }
              parser={(value) => value.replace(/\₫\s?|(,*)/g, "")}
            />
            <InputNumber
              className="category_space-input"
              min={0}
              max={50000000}
              value={maxPrice}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ₫"
              }
              parser={(value) => value.replace(/\₫\s?|(,*)/g, "")}
              onChange={(value) => setMaxPrice(value)}
            />
          </Space>
          <Divider />
          {componentFilter()}
        </div>
      </Drawer>
    </Spin>
  );
};
export default CategoryPage;
