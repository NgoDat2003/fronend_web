import {
  Drawer,
  Table,
  Form,
  Input,
  InputNumber,
  Button,
  Tag,
  Row,
  Col,
} from "antd";
import { useEffect, useState } from "react";
import { callGetOrderDetails } from "../../../../service/api";

function AdminOrderDetails({ visible, setVisible, order }) {
  const [orderDetails, setOrderDetails] = useState(null);
  const [form] = Form.useForm();
  const orderId = order.id;
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Product ID",
      dataIndex: "productId",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (date) => {
        const d = new Date(date);
        return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} ${d.getDate()}/${
          d.getMonth() + 1
        }/${d.getFullYear()}`;
      },
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      render: (date) => {
        const d = new Date(date);
        return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} ${d.getDate()}/${
          d.getMonth() + 1
        }/${d.getFullYear()}`;
      },
    },
  ];

  const handleCancel = () => {
    setVisible(false);
  };

  const fetchOrderDetails = async () => {
    let res = await callGetOrderDetails(orderId);
    if (res && +res.EC === 0) {
      setOrderDetails(res.DT);
    }
  };

  useEffect(() => {
    if (orderId) {
      form.setFieldsValue({
        id: order.id,
        userId: order.userId,
        orderStatus: order.orderStatus,
        orderTotal: order.orderTotal,
        orderAddress: order.orderAddress,
        orderPaymentStatus: order.orderPaymentStatus,
        orderPayment: order.orderPayment,
      });
      fetchOrderDetails();
    }
  }, [orderId]);

  return (
    <Drawer
      title={`Order Details - Order ID: ${orderId}`}
      visible={visible}
      onClose={handleCancel}
      width={720}
      placement="left"
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="id" label="Order ID">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="userId" label="User ID">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="orderStatus" label="Order Status">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            {" "}
            <Form.Item
              name="orderTotal"
              label="Order Total"
              style={{ width: "100%" }}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) =>
                  `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\₫\s?|(,*)/g, "")}
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="orderAddress" label="Order Address">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="orderPaymentStatus" label="Payment Status">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="orderPayment" label="Payment ">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table columns={columns} dataSource={orderDetails} />
      <div style={{ textAlign: "right", marginTop: "15px" }}>
        <Button onClick={handleCancel} style={{ marginRight: 8 }}>
          Close
        </Button>
      </div>
    </Drawer>
  );
}

export default AdminOrderDetails;
