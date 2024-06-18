import axios from "../until/customize-axios";

// user
export const callRegister = (email, firstName, lastName, password) => {
  return axios.post("/api/v1/register", {
    email,
    firstName,
    lastName,
    password,
  });
};
export const callLogin = (email, password) => {
  return axios.post("/api/v1/login", {
    email,
    password,
  });
};
export const callUpdateAccount = (
  firstName,
  lastName,
  email,
  phoneNumber,
  address,
  roleId,
  image,
  id
) => {
  return axios.put(`/api/v1/user/update/${id}`, {
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    roleId,
    image,
  });
};
export const callGetUser = (limit, currentPage, sort, order) => {
  return axios.get("/api/v1/user/read", {
    params: { limit, currentPage, sort, order },
  });
};
export const callUploadFileUser = (file) => {
  let formData = new FormData();
  formData.append("image", file);
  return axios.post("/api/v1/upload/user", formData);
};
export const callCreateUser = (
  email,
  firstName,
  lastName,
  phoneNumber,
  address,
  roleID,
  password,
  image
) => {
  return axios.post("/api/v1/user/create", {
    email,
    firstName,
    lastName,
    phoneNumber,
    address,
    roleID,
    password,
    image,
  });
};
export const callGetAccount = () => {
  return axios.get("/api/v1/account");
};
export const callLogout = () => {
  return axios.post("/api/v1/logout");
};
export const callDeleteUser = (id) => {
  return axios.delete("/api/v1/user/delete/" + id);
};
export const callGetUserBySearch = (value) => {
  return axios.get("/api/v1/user/search?value=" + value);
};
export const callGetAllUser = () => {
  return axios.get("/api/v1/user");
};
// product
export const callGetProducts = (limit, currentPage, sort, order) => {
  return axios.get("/api/v1/product/read", {
    params: { limit, currentPage, sort, order },
  });
};
export const callGetProductsByCategory = (
  id,
  limit,
  currentPage,
  sort,
  order
) => {
  return axios.get("/api/v1/product/readByCategory", {
    params: { id, limit, currentPage, sort, order },
  });
};
export const callGetProductByID = (id) => {
  return axios.get("/api/v1/product/" + id);
};

export const callGetAllRole = () => {
  return axios.get("/api/v1/role/read");
};
export const callUploadFileProduct = (file) => {
  let formData = new FormData();
  formData.append("image", file);
  return axios.post("/api/v1/upload/product", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const callFilterProduct = (
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
  minPrice,
  maxPrice,
  id,
  limit,
  currentPage
) => {
  return axios.get("/api/v1/category/filter", {
    params: {
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
      minPrice,
      maxPrice,
      id,
      limit,
      currentPage,
    },
  });
};
export const callCreateProduct = (
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
  return axios.post("/api/v1//product/create", {
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
    fileList,
  });
};
export const callUpdateProduct = (
  id,
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
  return axios.put("/api/v1/product/update/" + id, {
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
    fileList,
  });
};
export const callDeleteProduct = (id) => {
  return axios.delete("/api/v1/product/delete/" + id);
};
export const callGetAllProduct = () => {
  return axios.get("/api/v1/product/readAll");
};

export const callGetProductSearch = (search) => {
  return axios.get("/api/v1/product/search?search=" + search);
};
// order
export const callGetOrders = (limit, currentPage, sort, order) => {
  return axios.get("/api/v1/order/read", {
    params: { limit, currentPage, sort, order },
  });
};
export const callCreateOrder = (order) => {
  return axios.post("/api/v1/order/create", order);
};
export const callUpdateOrder = (id, order) => {
  return axios.put("/api/v1/order/update/" + id, order);
};
export const callGetOrderById = (
  limit,
  currentPage,
  sort,
  order,
  id,
  orderStatus
) => {
  return axios.get("/api/v1/order/readbyid", {
    params: { limit, currentPage, sort, order, id, orderStatus },
  });
};
//order details
export const callGetOrderDetails = (id) => {
  return axios.get("/api/v1/orderDetail/read/" + id);
};
// image
export const callGetSubImages = (id) => {
  return axios.get("/api/v1/image/" + id);
};

// category
export const callGetCategories = () => {
  return axios.get("/api/v1/category/read");
};
//statistic
export const callGetStatisInfo = () => {
  return axios.get("/api/v1/statistic");
};
// payment
export const callGetPayment = () => {
  return axios.get("/api/v1/payment/config");
};