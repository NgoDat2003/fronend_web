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
export const callGetUser = (limit, currentPage) => {
  return axios.get("/api/v1/user/read", { params: { limit, currentPage } });
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

// product
export const callGetProducts = (limit, currentPage) => {
  return axios.get("/api/v1/product/read", { params: { limit, currentPage } });
};
export const callGetProductByID = (id) => {
  return axios.get("/api/v1/product/" + id);
};

export const callGetAllRole = () => {
  return axios.get("/api/v1/role/read");
};
