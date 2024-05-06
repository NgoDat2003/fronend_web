import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  Row,
  Col,
  message,
  InputNumber,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  callCreateProduct,
  callCreateUser,
  callGetAllRole,
  callGetCategories,
  callUploadFileProduct,
  callUploadFileUser,
} from "../../../service/api";
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.addEventListener("error", () =>
    console.log("Error occurred during reading the file")
  );
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

function ModalCreateProduct({ visible, setVisible, handleRefesh }) {
  const [form] = Form.useForm();
  const [file, setFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [loadingSubImages, setLoadingSubImages] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(1); // Add this state
  const handleCreateProduct = async (
    productName,
    price,
    mainImage,
    description,
    stockQuantity,
    categoryId,
    screenBrand,
    screenSize,
    resolution,
    panelType,
    pcBrand,
    cpuSeries,
    ramSize,
    laptopBrand,
    color,
    audioBrand,
    microphoneType,
    laptopCpuSeries,
    fileList
  ) => {
    let res = await callCreateProduct(
      productName,
      price,
      mainImage,
      description,
      stockQuantity,
      categoryId,
      screenBrand,
      screenSize,
      resolution,
      panelType,
      pcBrand,
      cpuSeries,
      ramSize,
      laptopBrand,
      color,
      audioBrand,
      microphoneType,
      laptopCpuSeries,
      fileList
    );
    if (res && +res.EC === 0) {
      form.resetFields();
      message.success(res.EM);
      setVisible(false);
      handleRefesh();
    } else {
      message.error(res.EM);
    }
  };
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // Handle values here
        let { productName, price, stockQuantity, description } = values;
        handleCreateProduct(
          productName,
          price,
          file.name,
          description,
          stockQuantity,
          categoryId,
          values.screenBrand,
          values.screenSize,
          values.resolution,
          values.panelType,
          values.pcBrand,
          values.cpuSeries,
          values.ramSize,
          values.laptopBrand,
          values.color,
          values.audioBrand,
          values.microphoneType,
          values.laptopCpuSeries,
          fileList.map((item) => item.name)
        );
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setVisible(false);
  };
  const handleChange = (info, type) => {
    if (info.file.status === "uploading") {
      type === "sub" ? setLoadingSubImages(true) : setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        type === "sub" ? setLoadingSubImages(false) : setLoading(false);
      });
    }
    if (info.file.status === "error") {
      type === "sub" ? setLoadingSubImages(false) : setLoading(false);
    }
  };
  const handleUpload = async ({ file, onSuccess, onError }) => {
    try {
      let res = await callUploadFileProduct(file);
      if (res && +res.EC === 0) {
        setFile({
          uid: file.uid,
          name: "/product/" + res.DT.filename,
        });
        onSuccess("OK");
      }
    } catch (error) {
      console.error(error);
      onError("Error");
    } finally {
      setLoading(false);
    }
  };
  const handleUploadMultiple = async ({ file, onSuccess, onError }) => {
    try {
      let res = await callUploadFileProduct(file);
      if (res && +res.EC === 0) {
        let newFileList = [
          ...fileList,
          { uid: file.uid, name: res.DT.filename, status: "done" },
        ];
        setFileList(newFileList);
        file.status = "done";
        onSuccess("OK");
      }
    } catch (error) {
      console.error(error);
      onError("Error");
    }
  };

  const handleGetAllCategories = async () => {
    let res = await callGetCategories();
    if (res && +res.EC === +0) {
      setCategories(
        res.DT.map((item) => ({ value: item.id, label: item.categoryName }))
      );
      setCategoryId(res.DT[0].id);
    }
  };
  const handleCategoryChange = (value) => {
    // Add this function
    setCategoryId(value);
    form.resetFields([
      "screenBrand",
      "screenSize",
      "resolution",
      "panelType",
      "pcBrand",
      "cpuSeries",
      "ramSize",
      "laptopBrand",
      "color",
      "laptopCpuSeries",
      "audioBrand",
      "microphoneType",
    ]);
  };
  const handleRemove = (file) => {
    let newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
  };
  useEffect(() => {
    handleGetAllCategories();
  }, []);
  useEffect(() => {
    form.validateFields(["image"]);
  }, [form]);

  return (
    <div>
      <Modal
        title="Thêm Sản Phẩm"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={720}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: "public" }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="productName"
                label="Product Name"
                rules={[
                  { required: true, message: "Please input the Product Name!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: "Please input the Price!" }]}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  precision={2}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="stockQuantity"
                label="Stock Quantity"
                rules={[
                  { required: true, message: "Please input Stock Quantity!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="categoryId"
                label="Category"
                initialValue={categoryId}
              >
                {categories.length > 0 ? (
                  <Select
                    defaultValue={categories[0].value}
                    onChange={handleCategoryChange}
                    options={categories}
                  />
                ) : null}
              </Form.Item>
            </Col>
            <Col span={24}>
              {categoryId === 1 && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="screenBrand"
                      label="Screen Brand"
                      rules={[
                        {
                          required: true,
                          message: "Please input the screen brand!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="screenSize"
                      label="Screen Size"
                      rules={[
                        {
                          required: true,
                          message: "Please input the screen size!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="resolution"
                      label="Resolution"
                      rules={[
                        {
                          required: true,
                          message: "Please input the resolution!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="panelType"
                      label="Panel Type"
                      rules={[
                        {
                          required: true,
                          message: "Please input the panel type!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              )}
              {categoryId === 3 && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="pcBrand"
                      label="PC Brand"
                      rules={[
                        {
                          required: true,
                          message: "Please input the PC brand!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="cpuSeries"
                      label="CPU Series"
                      rules={[
                        {
                          required: true,
                          message: "Please input the CPU series!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="ramSize"
                      label="RAM Size"
                      rules={[
                        {
                          required: true,
                          message: "Please input the RAM size!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              )}
              {categoryId === 2 && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="laptopBrand"
                      label="Laptop Brand"
                      rules={[
                        {
                          required: true,
                          message: "Please input the Laptop Brand!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="color"
                      label="Color"
                      rules={[
                        { required: true, message: "Please input the Color!" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="laptopCpuSeries"
                      label="Laptop CPU Series"
                      rules={[
                        {
                          required: true,
                          message: "Please input the Laptop CPU Series!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              )}
              {categoryId === 4 && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="audioBrand"
                      label="Audio Brand"
                      rules={[
                        {
                          required: true,
                          message: "Please input the Audio Brand!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="microphoneType"
                      label="Microphone Type"
                      rules={[
                        {
                          required: true,
                          message: "Please input the Microphone Type!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </Col>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please input the Description!" },
                ]}
              >
                <Input.TextArea />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="file"
                label="Main Image"
                rules={[
                  { required: true, message: "Please input the Main Image!" },
                ]}
              >
                <Upload
                  multiple={false}
                  maxCount={1}
                  name="mainImage"
                  listType="picture-card"
                  className="avatar-uploader"
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  customRequest={handleUpload}
                >
                  <div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="fileList"
                label="Sub Images"
                rules={[
                  { required: true, message: "Please input the Sub Images!" },
                ]}
              >
                <Upload
                  multiple={true}
                  name="subImages"
                  listType="picture-card"
                  className="avatar-uploader"
                  beforeUpload={beforeUpload}
                  onChange={(file) => handleChange(file, "sub")}
                  onRemove={handleRemove}
                  customRequest={handleUploadMultiple}
                >
                  <div>
                    {loadingSubImages ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

export default ModalCreateProduct;
