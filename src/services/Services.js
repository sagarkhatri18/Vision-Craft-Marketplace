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

export const Logout = () => {
  localStorage.clear();
  window.location.reload();
};
