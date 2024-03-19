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
  return axios.post(process.env.REACT_APP_API_URL + `register`, {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    contact: data.contact,
    address: data.address,
    role: data.role,
    verified: data.verified,
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
    currentPassword: data.currentPassword,
  });
};

export const Logout = () => {
  localStorage.clear();
  window.location.reload();
};
