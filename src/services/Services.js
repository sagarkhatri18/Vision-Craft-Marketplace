import axios from "axios";

// handle the login API
export const login = async (email, password) => {
  return axios.post(process.env.REACT_APP_API_URL + `login`, {
    email: email,
    password: password,
  });
};

//handle the register API
export const register = async (data) => {
  const {
    country,
    province,
    city,
    streetName,
    suiteNumber,
    postalCode,
    contactNumber,
    role,
    verified,
    firstName,
    lastName,
    email,
    password,
  } = data;
  return axios.post(process.env.REACT_APP_API_URL + `register`, {
    country,
    province,
    city,
    streetName,
    suiteNumber,
    postalCode,
    contactNumber,
    role,
    verified,
    firstName,
    lastName,
    email,
    password,
  });
};

export const passwordReset = async (data) => {
  return axios.post(process.env.REACT_APP_API_URL + `reset-password`, {
    email: data.email,
    baseURL: data.baseURL,
  });
};

// find user detail based on the token
export const findUserFromToken = async (userId, token) => {
  return axios.get(
    process.env.REACT_APP_API_URL + `user-detail/${userId}/${token}`
  );
};

// change password
export const changePassword = async (data) => {
  return axios.post(process.env.REACT_APP_API_URL + `change-password`, {
    userId: data.userId,
    password: data.password,
    currentPassword: data.currentPassword ?? "",
    token: data.token ?? "",
  });
};

// fetch list of provinces of canada
export const getProvinces = async () => {
  return axios.get(process.env.REACT_APP_API_URL + `provinces`);
};

// fetch list of provinces of canada
export const getCitiesFromProvinceName = async (provinceName) => {
  return axios.get(
    process.env.REACT_APP_API_URL + `provinces/cities/${provinceName}`
  );
};

export const Logout = () => {
  localStorage.clear();
  window.location.reload();
};
