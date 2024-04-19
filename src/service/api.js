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
export const callGetAccount = () => {
  return axios.get("/api/v1/account");
}
export const callLogout = () => {
  return axios.post("/api/v1/logout");
}