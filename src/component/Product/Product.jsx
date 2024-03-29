import "./Product.scss";
import { useState } from "react";
import product1 from "../../image/product1.png";
import product2 from "../../image/product2.png";
import product3 from "../../image/product3.png";
import product4 from "../../image/product4.png";

import { Col, Image, InputNumber, Rate, Row } from "antd";
function Product() {
  const [mainImage, setMainImage] = useState(product2);

  const images = [product1, product2, product3, product4]; // thay thế bằng danh sách URL hình ảnh thực tế của bạn

  return (
    <div className="product">
      <div className="container">
        <Row gutter={16}>
          <Col span={10}>
            <div className="product_image">
              <Row>
                <Col span={24} className="product_image_main">
                  <Image.PreviewGroup items={images}>
                    <Image src={mainImage} />
                  </Image.PreviewGroup>
                </Col>
                <div className="product_image_list">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={
                        image === mainImage
                          ? "active product_image_item"
                          : " product_image_item"
                      }
                    >
                      <Image
                        preview={false}
                        src={image}
                        onClick={() => setMainImage(image)}
                      />
                    </div>
                  ))}
                </div>
              </Row>
            </div>
          </Col>
          <Col span={14}>
            <div className="product_info">
              <h1 className="product_name">
                Laptop AI ASUS Zenbook 14 OLED - UX3405MA-PP152W (Ultra
                7-155H/RAM 32GB/1TB SSD/ Windows 11)
              </h1>
              <div className="product_description">
                <div className="product_brand">
                  Thương hiệu : <span>ASUS</span>
                </div>
                <div className="product_sku">| SKU: 240103583</div>
              </div>
              <div className="social">
                <Rate defaultValue={3} allowClear={false} />
                <div className="product_sold">| Đã bán 1000+</div>
              </div>
              <div className="product_price">20.990.000 ₫</div>
              <div className="product_number">
                <span>Số lượng </span>
                <InputNumber min={1} max={10} defaultValue={1} />
              </div>
              <Row className="product_button" gutter={12}>
                <Col span={12}>
                  <button className="btn btn-primary">Mua ngay</button>
                </Col>
                <Col span={12}>
                  <button className="btn btn-secondary">
                    Thêm vào giỏ hàng
                  </button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Product;
