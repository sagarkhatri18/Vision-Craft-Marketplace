import axios from "axios";

// header configuration
const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};

// list all the users
export const getUsers = async () => {
  return await axios.get(process.env.REACT_APP_API_URL + `user`, config);
};

// get particular user detail
export const getUserById = async (id) => {
  return await axios.get(process.env.REACT_APP_API_URL + `user/${id}`, config);
};

// delete the particular user
export const deleteUserFromId = async (id) => {
  return await axios.delete(
    process.env.REACT_APP_API_URL + `user/${id}`,
    config
  );
};
