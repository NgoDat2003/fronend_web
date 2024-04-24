import axios from "../until/customize-axios";
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
export const callUpdateAccount = (firstName, lastName, phoneNumber, address,email,id) => {
  return axios.put("/api/v1/user/update", {
    firstName,
    lastName,
    phoneNumber,
    address,
    email,
    id
  });
}
export const callGetUser = (limit,currentPage) => {
  return axios.get("/api/v1/user/read",{params:{limit,currentPage}});
}

export const callGetAccount = () => {
  return axios.get("/api/v1/account");
}
export const callLogout = () => {
  return axios.post("/api/v1/logout");
}
export const callGetProducts = (limit,currentPage) => {
  return axios.get("/api/v1/product/read",{params:{limit,currentPage}});
}
export const callGetProductByID = (id) => {
  return axios.get("/api/v1/product/"+id);
}
