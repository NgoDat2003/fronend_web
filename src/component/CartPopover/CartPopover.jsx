import "./CartPopover.scss";
import empty_cart from "../../image/empty_cart.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
function CartPopover() {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.order.orders);
  const total = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart_popover_container">
      <div className="cart_main">
        {cart && cart.length > 0 ? (
          <>
            <div className="cart_content">
              {cart.map((item, index) => (
                <div className="cart_content-item" key={index}>
                  <img
                    src={import.meta.env.VITE_APP_BE_API_URL + item.imageUrl}
                    alt="product"
                    className="cart_item-image"
                  />
                  <div className="cart_content-info">
                    <span className="cart_content-name">
                      {item.productName}
                    </span>
                    <div className="cart_content-quantity">
                      Số Lượng : {item.quantity}
                    </div>
                    <span className="cart_content-price">
                      {Number(item.price).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart_footer">
              <div className="cart_footer-total">
                <span className="cart_footer-total-text">
                  Tổng cộng ({cart.length || 0}) sản phẩm:
                </span>
                <span className="cart_footer-total-price">{Number(total).toLocaleString("vi-VN")}đ</span>
              </div>
              <button
                className="btn_cart btn btn_primary"
                onClick={() => navigate("/cart")}
              >
                Xem giỏ hàng
              </button>
            </div>
          </>
        ) : (
          <div className="cart_emty">
            <img src={empty_cart} alt="empty_cart" className="cart-empy" />
            <span className="cart-empty-text">
              Giỏ hàng chưa có sản phẩm nào
            </span>
            <button className="btn btn_primary" onClick={() => navigate("/")}>
              Mua sắm ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPopover;
