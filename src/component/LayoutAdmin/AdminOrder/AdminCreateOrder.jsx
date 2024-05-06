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
  Tooltip,
  Select,
} from "antd";
import ReactSelect from "react-select";
import { useEffect, useState } from "react";
import {
  callCreateOrder,
  callGetAllProduct,
  callGetAllUser,
} from "../../../service/api";
import { MdDelete } from "react-icons/md";

const { Option } = Select;

function AdminCreateOrder({ visible, setVisible, handleRefesh }) {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([
    {
      productId: 0,
      productName: "",
      quantity: 1,
      productPrice: 0,
      productTotal: 0,
    },
  ]);
  const [users, setUsers] = useState([]);
  const [options, setOptions] = useState([]);
  const [indexTable, setIndexTable] = useState(Math.random());

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
      title: "Product Name",
      dataIndex: "productName",
      width: "30%",
      render: (text, record, index) => (
        <ReactSelect
          key={indexTable}
          defaultValue={options.find((option) => option.value === text)}
          onChange={(option) => handleProductChange(option.value, index)}
          options={options}
          isSearchable={true}
          isOptionDisabled={(option) =>
            orderItems.some((item) => item.productName === option.label)
          }
          styles={{
            option: (provided, state) => ({
              ...provided,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }),
          }}
        />
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: "20%",
      render: (text, record, index) => {
        const product = products.find(
          (p) => p.productName === record.productName
        );
        const maxQuantity = product ? product.stockQuantity : 1;
        return (
          <InputNumber
            key={indexTable}
            min={1}
            max={maxQuantity}
            defaultValue={1}
            onChange={(value) => handleQuantityChange(value, index)}
          />
        );
      },
    },
    {
      title: "Product Price",
      dataIndex: "productPrice",
      width: "20%",
      render: (text) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(text),
    },
    {
      title: "Product Total",
      dataIndex: "productTotal",
      width: "20%",
      render: (text) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(text),
    },
    {
      title: "Action",
      key: "action",
      width: "10%",
      render: (text, record, index) => (
        <button
          className="btn_danger btn"
          onClick={() => handleRemoveProduct(index)}
        >
          <MdDelete />
        </button>
      ),
    },
  ];
  const handleCancel = () => {
    setVisible(false);
  };
  const handleGetAllUsers = async () => {
    let res = await callGetAllUser();
    if (res && +res.EC === 0) {
      setUsers(
        res.DT.map((user) => ({ label: user.id + "", value: user.id + "" }))
      );
    }
  };
  const handleAddProduct = () => {
    setOrderItems([
      ...orderItems,
      { productName: "", quantity: 1, productPrice: 0, productTotal: 0 },
    ]);
  };
  const handleRemoveProduct = (index) => {
    setIndexTable(Math.random());
    if (orderItems.length === 1) {
      // If this is the only item, reset it to initial value
      setOrderItems([
        { productName: "", quantity: 1, productPrice: 0, productTotal: 0 },
      ]);
      form.setFieldsValue({ orderTotal: 0 });
    } else {
      // Otherwise, remove this item
      const newOrderItems = [...orderItems];
      newOrderItems.splice(index, 1);
      setOrderItems(newOrderItems);
      const total = newOrderItems.reduce(
        (sum, item) => sum + Number(item.productTotal),
        0
      );
      form.setFieldsValue({ orderTotal: total });
    }
  };
  const handleProductChange = (value, index) => {
    const isProductNameExists = orderItems.some(
      (item, i) => i !== index && item.productName === value
    );

    if (isProductNameExists) {
      message.error("Product is already added");
      const newOrderItems = [...orderItems];
      newOrderItems[index] = {
        ...newOrderItems[index],
        productName: "",
        productPrice: 0,
        productTotal: 0,
        productId: 0,
      };
      setOrderItems(newOrderItems);
      return;
    }

    const selectedProduct = products.find(
      (product) => product.productName === value
    );
    const newOrderItems = [...orderItems];
    newOrderItems[index] = {
      ...newOrderItems[index],
      productName: value,
      productPrice: selectedProduct.price,
      productTotal: selectedProduct.price,
      productId: selectedProduct.id,
    };
    setOrderItems(newOrderItems);
    const total = newOrderItems.reduce(
      (sum, item) => sum + Number(item.productTotal),
      0
    );
    form.setFieldsValue({ orderTotal: total });
  };
  const handleQuantityChange = (value, index) => {
    const newOrderItems = [...orderItems];
    newOrderItems[index] = {
      ...newOrderItems[index],
      quantity: value,
      productTotal: newOrderItems[index].productPrice * value,
    };
    setOrderItems(newOrderItems);
    const total = newOrderItems.reduce(
      (sum, item) => sum + Number(item.productTotal),
      0
    );
    form.setFieldsValue({ orderTotal: total });
  };
  const handleGetAllProducts = async () => {
    let res = await callGetAllProduct();
    if (res && +res.EC === 0) {
      console.log(res.DT);
      setProducts(res.DT);
      setOptions(
        res.DT.map((product) => ({
          label: product.productName,
          value: product.productName,
        }))
      );
    }
  };

  const handleCreateOrder = async () => {
    try {
      // Validate form fields
      const formData = await form.validateFields();
      // Check if userId is in users
      const userIdExists = users.some((user) => user.value === formData.userId);
      if (!userIdExists) {
        message.error("User ID is not valid");
        form.setFieldsValue({ userId: undefined }); // Reset userId
        return;
      }
      // Filter out items with empty productName
      const validOrderItems = orderItems.filter(
        (item) => item.productName !== ""
      );

      if (validOrderItems.length === 0) {
        message.error("Please add at least one product");
        return;
      }
      let productList = validOrderItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.productPrice,
        totalPrice:item.productTotal
      }));
      const data = {
        userId: formData.userId,
        orderStatus: formData.orderStatus,
        orderPayment: formData.orderPayment,
        orderTotal: formData.orderTotal,
        orderAddress: formData.orderAddress,
        orderPaymentStatus: formData.orderPaymentStatus,
        productList: productList,
      };
      console.log("Data:", data);
      let res = await callCreateOrder(data);
      if (res && +res.EC === 0) {
        message.success(res.EM);
        handleRefesh();
        setVisible(false);
        form.resetFields();
      } else {
        message.error(res.EM);
      }
      // Handle form submission here
    } catch (error) {
      // Handle form validation errors here
      console.log("Form validation error:", error);
    }
  };

  useEffect(() => {
    // Fetch products from BE and setProducts
    handleGetAllProducts();
    handleGetAllUsers();
  }, []);
  return (
    <Drawer
      title="Create Order"
      visible={visible}
      onClose={handleCancel}
      width="50%"
      placement="left"
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="userId" label="User ID">
              <Select
                showSearch
                placeholder="Search to Select"
                onBlur={(e) => form.setFieldsValue({ userId: e.target.value })}
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={users}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="orderTotal" label="Order Total">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="orderStatus"
              label="Order Status"
              rules={[{ required: true, message: "Please input Order Status" }]}
            >
              <Select
                options={optionOrderStatus}
                // defaultValue={optionOrderStatus && optionOrderStatus[0].value}
              />
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
              <Select
                options={optionPaymentStatus}
                // defaultValue={
                //   optionPaymentStatus && optionPaymentStatus[0].value
                // }
              />
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
          dataSource={orderItems}
          columns={columns}
          rowKey={(record, index) => index}
          pagination={false}
        />
        <Button
          type="dashed"
          onClick={handleAddProduct}
          style={{ width: "100%", marginTop: "20px" }}
        >
          Add Product
        </Button>
      </Form>
      <div style={{ textAlign: "right", marginTop: "15px" }}>
        <Button onClick={handleCancel} style={{ marginRight: 8 }}>
          Close
        </Button>
        <Button type="primary" onClick={handleCreateOrder}>
          Create
        </Button>
      </div>
    </Drawer>
  );
}

export default AdminCreateOrder;
