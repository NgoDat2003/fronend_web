import "./Product.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Image, InputNumber, Rate, Row } from "antd";
import { callGetProductByID } from "../../service/api";
function Product() {
  const { id } = useParams();
  const [mainImage, setMainImage] = useState({});
  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const getProductByID = async () => {
    let res = await callGetProductByID(id);
    if (res && +res.EC === 0) {
      setProduct(res.DT);
      setMainImage(res.DT.mainImage);
      setImages(res.DT.Images);
      console.log(res.DT);
    }
  };
  useEffect(() => {
    getProductByID();
  }, [id]);
  return (
    <div className="product">
      <div className="container">
        <Row gutter={16}>
          <Col span={10}>
            <div className="product_image">
              <Row>
                <Col span={24} className="product_image_main">
                  <Image.PreviewGroup
                    items={images.map((image) => ({
                      src: import.meta.env.VITE_APP_BE_API_URL + image.imageUrl,
                      alt: "Product image",
                    }))}
                  >
                    <Image
                      src={import.meta.env.VITE_APP_BE_API_URL + mainImage}
                    />
                  </Image.PreviewGroup>
                </Col>
                <div className="product_image_list">
                  {images.map(
                    (image, index) => (
                      (
                        <div
                          key={index}
                          className={
                            image ===
                            import.meta.env.VITE_APP_BE_API_URL + image.imageUrl
                              ? "active product_image_item"
                              : " product_image_item"
                          }
                        >
                          <Image
                            preview={false}
                            src={
                              import.meta.env.VITE_APP_BE_API_URL +
                              image.imageUrl
                            }
                            onClick={() => setMainImage(image.imageUrl)}
                          />
                        </div>
                      )
                    )
                  )}
                </div>
              </Row>
            </div>
          </Col>
          <Col span={14}>
            <div className="product_info">
              <h1 className="product_name">
                {product.productName || "Tên sản phẩm"}
              </h1>
              <div className="product_description">
                <div className="product_brand">
                  Thương hiệu : <span>{product.screenBrand || product.pcBrand || product.audioBrand || product.laptopBrand}</span>
                </div>
                <div className="product_sku">| SKU: 240103583</div>
              </div>
              <div className="social">
                <Rate defaultValue={3} allowClear={false} />
                <div className="product_sold">| Đã bán 1000+</div>
              </div>
              <div className="product_price">{Number(product.price).toLocaleString('vi-VN')} ₫</div>
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