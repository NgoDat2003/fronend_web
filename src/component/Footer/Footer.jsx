import React from "react";
import { Row, Col } from "antd";
import "./Footer.scss";
const Footer = () => {
  return (
    <div className="footer_container">
      <div className="footer_layout">
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={12} md={8} xl={6} xxl={6}>
            <h2>Hỗ trợ khách hàng</h2>
            <p>Thẻ ưu đãi</p>
            <p>Chăm sóc khách hàng</p>
            <p>Chính sách đổi trả</p>
            <p>Chính sách bảo hành</p>
            <p>Dịch vụ sửa chữa</p>
          </Col>
          <Col xs={12} sm={12} md={8} xl={6} xxl={6}>
            <h2>Chính sách mua hàng</h2>
            <p>Chính sách bảo mật</p>
            <p>Chính sách vận chuyển</p>
            <p>Chính sách thanh toán</p>
            <p>Chính sách bảo hành</p>
            <p>Chính sách đổi trả</p>
          </Col>
          <Col xs={12} sm={12} md={8} xl={6} xxl={6}>
            <h2>Thông tin công ty</h2>
            <p>Giới thiệu công ty</p>
            <p>Chính sách công ty</p>
            <p>Trung tâm bảo hành</p>
            <p>Chính sách bảo mật</p>
            <p>Tuyển dụng</p>
          </Col>
          <Col xs={12} sm={12} md={8} xl={6} xxl={6}>
            <h2>Email Liên hệ</h2>
            <p>Hỗ trợ khách hàng </p>
            <span>abc@gmail.com</span>
            <p>Liên hệ báo giá</p>
            <span>baogia@gmail.com</span>
            <p>Hợp tác phát triển</p>
            <span>hoptac@gmail.com</span>
          </Col>
        </Row>
      </div>
      <div className="footer_bottom">
        <div className="footer_bottom-layout">
          <Row gutter={[16, 16]}>
            <Col span={12} xs={24} sm={24}>
              <h1>CÔNG TY CỔ PHẦN THƯƠNG MẠI - DỊCH VỤ ABC</h1>
              <p>© 1997 - 2020 Công Ty Cổ Phần Thương Mại - Dịch Vụ ABC</p>
              <p>
                Giấy chứng nhận đăng ký doanh nghiệp: 0304998358 do Sở KH-ĐT
                TP.HCM cấp lần đầu ngày 30 tháng 05 năm 2007
              </p>
            </Col>
            <Col span={12} xs={24} sm={24}>
              <h2>Địa chỉ trụ sở chính:</h2>
              <p>
                Tầng 5, Số 117-119-121 Nguyễn Du, Phường Bến Thành, Quận 1,
                Thành Phố Hồ Chí Minh
              </p>
              <h2>Văn phòng điều hành miền Bắc:</h2>
              <p>
                Tầng 2, Số 47 Phố Thái Hà, Phường Trung Liệt, Quận Đống Đa,
                Thành phố Hà Nội
              </p>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
export default Footer;
