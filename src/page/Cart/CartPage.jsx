import "./CartPage.scss";
import {
  Row,
  Col,
  Breadcrumb,
  Image,
  InputNumber,
  Button,
  Modal,
  Steps,
  message,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { doAddOrder, doRemoveOrder } from "../../redux/OrderSlice";
import empty_cart from "../../image/empty_cart.png";
import { callCreateOrder } from "../../service/api";

function CartPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const cart = useSelector((state) => state.order.orders);
  const user = useSelector((state) => state.user);
  const [deletingItemId, setDeletingItemId] = useState(null); // Add this line
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);
  const [divider, setDivider] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isLoading, setIsLoading] = useState(false);
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  const showModal = (id) => {
    setDeletingItemId(id); // Add this line
    setIsModalVisible(true);
  };
  console.log(user);
  const handleCreateOrder = async () => {
    setIsLoading(true);
    let productList = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      unitPrice: item.price,
      totalPrice:item.quantity*item.price
    }));
    const data = {
      userId: user.user.id,
      orderStatus: "Đã đặt hàng",
      orderPayment: paymentMethod==="cash"?"Tiền mặt":"Chuyển khoản",
      orderTotal: total + divider,
      orderAddress: user.user.address,
      orderPaymentStatus: "Chưa thanh toán",
      productList: productList,
    };
    console.log("Data:", data);
    let res = await callCreateOrder(data);
    if (res && +res.EC === 0) {
      message.success(res.EM);
    } else {
      message.error(res.EM);
    }
    setIsLoading(false);
  };
  const handleOk = () => {
    setIsLoading(true);
    dispatch(doRemoveOrder({ id: deletingItemId }));
    setIsModalVisible(false);
    setIsLoading(false);
    // Handle the product deletion here
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleChangeQuantity = (id, quantity) => {
    dispatch(doAddOrder({ id: id, quantity: quantity }));
  };
  useEffect(() => {
    const value = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    if (value <= 0) {
      setDivider(0);
    } else if (value < 2000000) {
      setDivider(20000);
    } else if (value < 5000000) {
      setDivider(30000);
    } else {
      setDivider(50000);
    }
    setTotal(value);
  }, [cart]);
  const handlePay = () => {
    if (user && !user.isAuth) {
      navigate("/login");
      return;
    }
    setCurrent(1);
  };
  const handlePay1 = () => {
    if (user && !user.isAuth) {
      navigate("/login");
      return;
    }
    handleCreateOrder();
    setCurrent(2);
  };
  const steps = [
    {
      title: "Đặt hàng",
      content: (
        <>
          {cart && cart.length <= 0 ? (
            <Row gutter={12}>
              <Col span={24} className="cart_emty-container">
                <div className="cart_emty">
                  <img
                    src={empty_cart}
                    alt="empty_cart"
                    className="cart-empy"
                  />
                  <span className="cart-empty-text">
                    Giỏ hàng chưa có sản phẩm nào
                  </span>
                  <button
                    className="btn btn_primary"
                    onClick={() => navigate("/")}
                  >
                    Mua sắm ngay
                  </button>
                </div>
              </Col>
            </Row>
          ) : (
            <Row gutter={12}>
              <Col span={16} className="cart_left">
                <Row gutter={12} className="cart_header">
                  <Col span={4}>Hình ảnh</Col>
                  <Col span={8}>Tên sản phẩm</Col>
                  <Col span={3}>Giá</Col>
                  <Col span={3}>Số lượng</Col>
                  <Col span={3}>Thành tiền</Col>
                  <Col span={3}>Thao tác</Col>
                </Row>
                <Row gutter={24} className="cart_list">
                  {cart.map((item) => (
                    <Row key={item.id} gutter={12} className="cart_item">
                      <Col span={4}>
                        <Image
                          src={
                            import.meta.env.VITE_APP_BE_API_URL + item.imageUrl
                          }
                        />
                      </Col>
                      <Col span={8} className="cart_item-name">
                        {item.productName}
                      </Col>
                      <Col span={3} className="cart_item-price">
                        {Number(item.price).toLocaleString("vi-VN")}đ
                      </Col>
                      <Col span={3}>
                        <InputNumber
                          min={1}
                          defaultValue={item.quantity}
                          max={item.maxQuantity}
                          onChange={(value) =>
                            handleChangeQuantity(item.id, value)
                          }
                        />
                      </Col>
                      <Col span={3} className="cart_item-price">
                        {Number(item.price * item.quantity).toLocaleString(
                          "vi-VN"
                        )}
                        đ
                      </Col>
                      <Col span={3}>
                        <button
                          className="btn btn_danger"
                          onClick={() => showModal(item.id)}
                        >
                          Xóa
                        </button>
                        <Modal
                          title="Xác nhận"
                          visible={isModalVisible}
                          onOk={handleOk}
                          onCancel={handleCancel}
                        >
                          Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?
                        </Modal>
                      </Col>
                    </Row>
                  ))}
                </Row>
              </Col>
              <Col span={8} className="cart_right">
                <div className="cart_right-container">
                  <h3>Thông tin đơn hàng</h3>
                  <div className="cart_right-content">
                    <div className="cart_right-item">
                      <p>Tổng tạm tính</p>
                      {Number(total).toLocaleString("vi-VN")}đ
                    </div>
                    <div className="cart_right-item">
                      <p>Phí vận chuyển</p>
                      {Number(divider).toLocaleString("vi-VN")}đ
                    </div>
                    <div className="cart_right-item active">
                      <p>Thành tiền</p>
                      <span>
                        {Number(total + divider).toLocaleString("vi-VN")}đ{" "}
                      </span>
                    </div>
                    <span className="span"> (Đã tính phí VAT)</span>
                  </div>
                  <button
                    type="primary"
                    className="cart_right-button btn btn_primary"
                    onClick={handlePay}
                  >
                    Thanh toán
                    {user && user.isAuth ? null : (
                      <span style={{ display: "block" }}>
                        Bạn cần đăng nhập để thanh toán
                      </span>
                    )}
                  </button>
                </div>
              </Col>
            </Row>
          )}
        </>
      ),
    },
    {
      title: "Thanh Toán",
      content: (
        <Row gutter={12}>
          <Col span={16} className="cart_left" style={{ padding: "1rem" }}>
            <h2 className="pay_tittle">Phương thức thanh toán</h2>
            <p className="pay_text">
              Thông tin thanh toán sẽ luôn được bảo mật
            </p>
            <div className="payment-methods">
              <div
                className={`payment-method ${
                  paymentMethod === "cash" ? "active" : ""
                }`}
                onClick={() => setPaymentMethod("cash")}
              >
                <p>Thanh toán tiền mặt khi nhận hàng</p>
              </div>
              <div
                className={`payment-method ${
                  paymentMethod === "paypal" ? "active" : ""
                }`}
                onClick={() => setPaymentMethod("paypal")}
              >
                <p>
                  Thanh toán tiền bằng PayPal{" "}
                  <span className="support">Khuyên dùng</span>
                </p>
                <div className="span_paypal">
                  Thanh toán qua Internet Banking, Visa, Master, JCB, PayPal
                </div>
              </div>
            </div>
          </Col>
          <Col span={8} className="cart_right">
            <div className="cart_right-container">
              <h3>Thông tin đơn hàng</h3>
              <div className="cart_right-content">
                <div className="cart_right-item">
                  <p>Tổng tạm tính</p>
                  {Number(total).toLocaleString("vi-VN")}đ
                </div>
                <div className="cart_right-item">
                  <p>Phí vận chuyển</p>
                  {Number(divider).toLocaleString("vi-VN")}đ
                </div>
                <div className="cart_right-item active">
                  <p>Thành tiền</p>
                  <span>
                    {Number(total + divider).toLocaleString("vi-VN")}đ{" "}
                  </span>
                </div>
                <span className="span"> (Đã tính phí VAT)</span>
              </div>
              <button
                type="primary"
                className="cart_right-button btn btn_primary"
                onClick={handlePay1}
              >
                Thanh toán
                {user && user.isAuth ? null : (
                  <span style={{ display: "block" }}>
                    Bạn cần đăng nhập để thanh toán
                  </span>
                )}
              </button>
            </div>
          </Col>
        </Row>
      ),
    },
    {
      title: "Xác Nhận",
    },
  ];
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  return (
    <Spin spinning={isLoading}>
      <div className="cart_page">
        <div className="cart_container">
          <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
            <Col span={24}>
              <Breadcrumb
                separator=">"
                items={[
                  {
                    title: <NavLink to="/">Trang chủ</NavLink>,
                  },
                  {
                    title: "Giỏ hàng",
                  },
                ]}
              />
            </Col>
            <Col span={24}>
              <h3>Giỏ Hàng</h3>
            </Col>
          </Row>
          <Steps current={current} items={items} />
          {steps[current].content}
        </div>
      </div>
    </Spin>
  );
}

export default CartPage;
