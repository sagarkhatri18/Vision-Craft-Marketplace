import axios from "axios";

// handle the login API
export const login = async (email, password) => {
  return axios.post(process.env.REACT_APP_API_URL + `login`, {
    email: email,
    password: password,
  });
};

export const Logout = () => {
  localStorage.clear();
  window.location.reload()
};
