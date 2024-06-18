import {
  Drawer,
  Form,
  Input,
  Button,
  Row,
  Col,
  message,
  Upload,
  InputNumber,
} from "antd";
import { useEffect, useState } from "react";
import {
  callGetSubImages,
  callUpdateProduct,
  callUploadFileProduct,
} from "../../../service/api";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/webp";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};
function ModalUpdateProduct({
  visibleUpdateProduct,
  setVisibleUpdateProduct,
  product,
  handleRefesh,
}) {
  const [form] = Form.useForm();
  const [userConfirm, setUserConfirm] = useState({});
  const [formChanged, setFormChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState({});
  const [fileList, setFileList] = useState([]);
  const [loadingSubImages, setLoadingSubImages] = useState(false);
  const [categoryId, setCategoryId] = useState(product.categoryId); // Add this state
  const onFormChange = () => {
    setFormChanged(true);
  };
  const handleUdateProduct = async (
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
    laptopCpuSeries,
    audioBrand,
    microphoneType,
    fileList
  ) => {
    let res = await callUpdateProduct(
      product.id,
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
      laptopCpuSeries,
      audioBrand,
      microphoneType,
      fileList
    );
    if (res && +res.EC === 0) {
      message.success(res.EM);
      setVisibleUpdateProduct(false);
      handleRefesh();
      form.resetFields();
    } else {
      message.error(res.EM);
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        let { productName, price, stockQuantity, description } = values;
        handleUdateProduct(
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
          values.laptopCpuSeries,
          values.audioBrand,
          values.microphoneType,
          fileList.map((item) => item.name)
        );
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setVisibleUpdateProduct(false);
    setUserConfirm({});
    setFormChanged(false);
  };
  const handleGetSubImage = async (id) => {
    let res = await callGetSubImages(id);
    if (res && +res.EC === 0) {
      let data = res.DT.map((item) => ({
        uid: item.id,
        name: item.imageUrl,
        status: "done",
        url: import.meta.env.VITE_APP_BE_API_URL + item.imageUrl,
      }));
      setFileList(data);
    }
  };

  useEffect(() => {
    if (
      product !== null &&
      product !== undefined &&
      Object.keys(product).length > 0
    ) {
      form.setFieldsValue({ ...product });
      setCategoryId(product.categoryId);
      setFile({
        uid: product.id,
        name: product.mainImage,
        url: import.meta.env.VITE_APP_BE_API_URL + product.mainImage,
      });
      handleGetSubImage(product.id);
    }
  }, [product]);

  const handleChange = (info, type) => {
    setFormChanged(true);
    if (info.file.status === "uploading") {
      type === "sub" ? setLoadingSubImages(true) : setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
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
          url:
            import.meta.env.VITE_APP_BE_API_URL + "/product/" + res.DT.filename,
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
          {
            uid: file.uid,
            name: "/product/" + res.DT.filename,
            status: "done",
            url:
              import.meta.env.VITE_APP_BE_API_URL +
              "/product/" +
              res.DT.filename,
          },
        ];
        setFileList(newFileList);
        onSuccess("OK");
      }
    } catch (error) {
      console.error(error);
      onError("Error");
    } finally {
      setLoadingSubImages(false);
    }
  };
  const handleRemove = (file) => {
    let newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
  };
  return (
    <Drawer
      title="Update Product"
      visible={visibleUpdateProduct}
      onClose={handleCancel}
      width={720}
    >
      <Form
        form={form}
        onValuesChange={onFormChange}
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
              disabled={true}
            >
              <Input disabled />
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
                {
                  required: true,
                  message: "Please input the Main Image!",
                  validator: (_, value) =>
                    file
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Please upload the Main Image!")
                        ),
                },
              ]}
            >
              <Upload
                multiple={false}
                maxCount={1}
                listType="picture-card"
                className="avatar-uploader"
                beforeUpload={beforeUpload}
                onChange={handleChange}
                customRequest={handleUpload}
                fileList={file ? [file] : []}
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
                {
                  required: true,
                  message: "Please input the Sub Images!",
                  validator: (_, value) =>
                    fileList
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Please upload the Sub Images!")
                        ),
                },
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
                fileList={fileList}
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
      <div style={{ textAlign: "right", marginTop: "15px" }}>
        <Button onClick={handleCancel} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button
          onClick={handleOk}
          type="primary"
          disabled={!formChanged} // Disable the button when user equals userConfirm
        >
          OK
        </Button>
      </div>
    </Drawer>
  );
}

export default ModalUpdateProduct;
