import {
  Drawer,
  Table,
  Form,
  Input,
  InputNumber,
  Button,
  Row,
  Col,
  message,
  Select,
} from "antd";
import ReactSelect from "react-select";
import { useEffect, useState } from "react";
import {
  //   callUpdateOrder,
  callGetAllProduct,
  callGetAllUser,
  callGetOrderDetails,
  callUpdateOrder,
} from "../../../service/api";
import { MdDelete } from "react-icons/md";

const { Option } = Select;

function AdminUpdateOrder({
  visibleUpdateOrder,
  setVisibleUpdateOrder,
  handleRefesh,
  order,
}) {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [options, setOptions] = useState([]);
  const [indexTable, setIndexTable] = useState(Math.random());
  const [orderDetails, setOrderDetails] = useState(null);
  const [isChange, setIsChange] = useState(false);
  const orderId = order.id || "";
  const onFormChange = () => {
    setIsChange(true);
  };
  

  const optionOrderStatus = [
    { label: "Đã giao hàng", value: "Đã giao hàng" },
    { label: "Đã hủy", value: "Đã hủy" },
    { label: "Đã đặt hàng", value: "Đã đặt hàng" },
    { label: "Đang giao hàng", value: "Đang giao hàng" },
  ];
  const optionPaymentStatus = [
    { label: "Chưa thanh toán", value: "Chưa thanh toán" },
    { label: "Đã thanh toán", value: "Đã thanh toán" },
  ];
  const optionPayment = [
    { label: "Chuyển khoản", value: "Chuyển khoản" },
    { label: "Tiền mặt", value: "Tiền mặt" },
  ];
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
      render: (text) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(text),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      render: (text) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(text),
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
    setVisibleUpdateOrder(false);
    setIsChange(false);
  };
  const handleGetAllUsers = async () => {
    let res = await callGetAllUser();
    if (res && +res.EC === 0) {
      setUsers(
        res.DT.map((user) => ({ label: user.id + "", value: user.id + "" }))
      );
    }
  };
  const fetchOrderDetails = async () => {
    let res = await callGetOrderDetails(orderId);
    if (res && +res.EC === 0) {
      setOrderDetails(res.DT);
    }
  };
  const handleGetAllProducts = async () => {
    let res = await callGetAllProduct();
    if (res && +res.EC === 0) {
      setProducts(res.DT);
      setOptions(
        res.DT.map((product) => ({
          label: product.productName,
          value: product.productName,
        }))
      );
    }
  };

  const handleUpdateOrder = async () => {
    try {
      setIsChange(false);
      const formData = await form.validateFields();
      console.log("formData", formData);
      let res = await callUpdateOrder(formData.id, {
        orderStatus: formData.orderStatus,
        orderPaymentStatus: formData.orderPaymentStatus,
        orderAddress: formData.orderAddress,
        orderPayment: formData.orderPayment,
      });
      if(res && +res.EC === 0){
        message.success("Update order success");
        handleRefesh();
        handleCancel();
      }else{
        message.error("Update order fail");
      }
    } catch (error) {
      console.log("Form validation error:", error);
    }
  };

  useEffect(() => {
    handleGetAllProducts();
    handleGetAllUsers();
  }, []);
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
      title="Update Order"
      visible={visibleUpdateOrder}
      onClose={handleCancel}
      width="50%"
      placement="right"
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={() => setIsChange(true)}
      >
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
            <Form.Item name="orderTotal" label="Order Total">
              <InputNumber
                style={{ width: "100%" }}
                disabled
                formatter={(value) =>
                  `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\₫\s?|(,*)/g, "")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="orderStatus"
              label="Order Status"
              rules={[{ required: true, message: "Please input Order Status" }]}
            >
              <Select options={optionOrderStatus} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="orderPaymentStatus"
              label="Payment Status"
              rules={[
                { required: true, message: "Please input Payment Status" },
              ]}
            >
              <Select options={optionPaymentStatus} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="orderAddress"
              label="Order Address"
              rules={[
                { required: true, message: "Please input Order Address" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="orderPayment"
              label="Payment"
              rules={[{ required: true, message: "Please input Payment" }]}
            >
              <Select
                options={optionPayment}
                // defaultValue={optionPayment && optionPayment[0].value}
              />
            </Form.Item>
          </Col>
        </Row>
        <Table
          dataSource={orderDetails}
          columns={columns}
          rowKey={(record, index) => index}
          pagination={false}
        />
      </Form>
      <div style={{ textAlign: "right", marginTop: "15px" }}>
        <Button onClick={handleCancel} style={{ marginRight: 8 }}>
          Close
        </Button>
        <Button type="primary" onClick={handleUpdateOrder} disabled={!isChange}>
          Update
        </Button>
      </div>
    </Drawer>
  );
}

export default AdminUpdateOrder;
