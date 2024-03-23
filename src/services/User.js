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

// add new user
export const add = async (data) => {
  const formData = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    contact: data.contact,
    address: data.address,
    role: data.role,
    verified: data.verified,
  };
  return await axios.post(
    process.env.REACT_APP_API_URL + `user`,
    formData,
    config
  );
};

// delete the particular user
export const deleteUserFromId = async (id) => {
  return await axios.delete(
    process.env.REACT_APP_API_URL + `user/${id}`,
    config
  );
};

// update user
export const update = async (data, id) => {
  const updateData = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    province: data.province,
    city: data.city,
    streetName: data.streetName,
    suiteNumber: data.suiteNumber,
    postalCode: data.postalCode,
    contactNumber: data.contactNumber,
    verified: data.verified,
    role: data.role,
  };
  return await axios.put(
    process.env.REACT_APP_API_URL + `user/${id}`,
    updateData,
    config
  );
};
