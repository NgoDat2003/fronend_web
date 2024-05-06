import "./CartManager.scss";
import { Row, Col, Tag, Image, Spin } from "antd";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { doAddOrder, doRemoveOrder } from "../../redux/OrderSlice";
import empty_cart from "../../image/empty_cart.png";
import {
  callCreateOrder,
  callGetOrderById,
  callGetOrderDetails,
  callGetProductByID,
} from "../../service/api";

function CartManager() {
  const cart = useSelector((state) => state.order.orders);
  const user = useSelector((state) => state.user);
  const [limit, setLimit] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState({ field: "updatedAt", order: "desc" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [activeStatus, setActiveStatus] = useState("Đang giao hàng");

  const handleStatusClick = (status) => {
    setActiveStatus(status);
    setOrderDetails([]);
  };
  const handleRefesh = () => {
    const newLimit = 4;
    const newCurrentPage = 1;

    if (limit !== newLimit) {
      setLimit(newLimit);
    }

    if (currentPage !== newCurrentPage) {
      setCurrentPage(newCurrentPage);
    }
    if (sort.field !== "updatedAt" || sort.order !== "desc") {
      setSort({ field: "updatedAt", order: "desc" });
      setTableKey(Math.random());
    }

    if (limit === newLimit && currentPage === newCurrentPage) {
      getOrder(newCurrentPage, newLimit);
    }
  };
  const getOrder = async () => {
    let res = await callGetOrderById(
      limit,
      currentPage,
      sort.field,
      sort.order,
      user.user.id,
      activeStatus
    );
    if (res && +res.EC === 0) {
      setTotal(res.DT.totalItems);
      setOrders(res.DT.data);
    }
  };

  useEffect(() => {
    getOrder();
  }, [limit, currentPage, sort, activeStatus]);
  useEffect(() => {
    const handleGetOrderDetail = async (id) => {
      let res = await callGetOrderDetails(id);
      if (res && +res.EC === 0) {
        return res.DT;
      }
      return [];
    };

    const fetchOrderDetails = async () => {
      if (orders.length > 0) {
        const allOrderDetails = [];
        for (const order of orders) {
          const details = await handleGetOrderDetail(order.id);
          allOrderDetails.push(...details);
        }
        setOrderDetails(allOrderDetails);
      }
    };

    fetchOrderDetails();
  }, [orders]);
  const getOrderStatusTag = (status) => {
    switch (status) {
      case "Đang giao hàng":
        return <Tag color="gold">{status}</Tag>;
      case "Đã đặt hàng":
        return <Tag color="green">{status}</Tag>;
      case "Đã giao":
        return <Tag color="blue">{status}</Tag>;
      case "Đã hủy":
        return <Tag color="red">{status}</Tag>;
      default:
        return status;
    }
  };
  return (
    <Spin spinning={isLoading}>
      <div className="cart_mangager_page">
        <div className="cart_container">
          <div className="cart_header">
            <h3>Quản lý đơn hàng</h3>
            <div className="cart_status">
              <div
                className={`cart_status-item ${
                  activeStatus === "Đã đặt hàng" ? "active" : ""
                }`}
                onClick={() => handleStatusClick("Đã đặt hàng")}
              >
                Đã đặt hàng
              </div>
              <div
                className={`cart_status-item ${
                  activeStatus === "Đang giao hàng" ? "active" : ""
                }`}
                onClick={() => handleStatusClick("Đang giao hàng")}
              >
                Đang giao hàng
              </div>
              <div
                className={`cart_status-item ${
                  activeStatus === "Đã giao hàng" ? "active" : ""
                }`}
                onClick={() => handleStatusClick("Đã giao hàng")}
              >
                Đã giao hàng
              </div>
              <div
                className={`cart_status-item ${
                  activeStatus === "Đã hủy" ? "active" : ""
                }`}
                onClick={() => handleStatusClick("Đã hủy")}
              >
                Đã hủy
              </div>
            </div>
          </div>
          {orders && orders.length <= 0 ? (
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
              {orders &&
                orders.map((order) => {
                  const date = new Date(order.createdAt);
                  const formattedDate = date.toLocaleDateString("vi-VN");
                  return (
                    <Col
                      span={24}
                      className="cart_item"
                      key={"order" + order.id}
                    >
                      <div className="cart_item-header">
                        <div className="cart_item-header-left">
                          <span>
                            <b>Mã đơn hàng:</b> {order.id}
                          </span>
                          <span>Đơn hàng vào lúc: {formattedDate}</span>
                        </div>
                        <div className="cart_item-header-right">
                          <span>
                            Trạng thái: {getOrderStatusTag(order.orderStatus)}
                          </span>
                        </div>
                      </div>
                      <div className="cart_item-details">
                        {orderDetails.map((detail, index) => {
                          const date = new Date(detail.createdAt);
                          const formattedDate =
                            date.toLocaleDateString("vi-VN");
                          if (detail.orderId === order.id) {
                            return (
                              <div
                                className="cart_item-detail"
                                key={"detail" + detail.id}
                              >
                                <div className="cart_item-detail-left">
                                  <Image
                                    src={
                                      import.meta.env.VITE_APP_BE_API_URL +
                                      detail.Product.mainImage
                                    }
                                    alt="product"
                                    width={100}
                                  />
                                </div>
                                <div className="cart_item-detail-right">
                                  <div className="cart_item-detail-info">
                                    <span>{detail.Product.productName}</span>
                                    <span>Số lượng: {detail.quantity}</span>
                                  </div>
                                  <div className="cart_item-detail-quantity">
                                    <span>
                                      Tổng tiền:{" "}
                                      {(detail.totalPrice * 1).toLocaleString(
                                        "vi-VN"
                                      )}
                                      đ
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          } else {
                            return null;
                          }
                        })}
                      </div>
                      <div className="cart_item-footer">
                        <span>
                          Tổng đơn hàng:{" "}
                          {(order.orderTotal * 1).toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </Col>
                  );
                })}
            </Row>
          )}
        </div>
      </div>
    </Spin>
  );
}

export default CartManager;
