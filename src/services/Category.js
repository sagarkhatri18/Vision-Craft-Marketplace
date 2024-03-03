import axios from "axios";

// header configuration
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

// list all the categories
export const getCatgories = async () => {
  return await axios.get(process.env.REACT_APP_API_URL + `category`);
};

// add the new category
export const add = async (data) => {
  const formData = {
    name: data.name,
    slug: data.slug,
    isActive: data.isActive,
  };
  return axios.post(
    process.env.REACT_APP_API_URL + `category`,
    formData,
    config
  );
};

// upload category image
export const uploadImage = async (data) => {
  return axios.post(process.env.REACT_APP_API_URL + `category/upload`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// update the category
export const updateCategory = async (id, data) => {
  const updateData = {
    name: data.name,
    slug: data.slug,
    isActive: data.isActive,
  };

  return await axios.put(
    process.env.REACT_APP_API_URL + `category/${id}`,
    updateData,
    config
  );
};

// get specific category from id
export const findCategory = async (id) => {
  return await axios.get(
    process.env.REACT_APP_API_URL + `category/${id}`,
    config
  );
};

// delete the particular category
export const deleteCategoryFromId = async (id) => {
  return await axios.delete(
    process.env.REACT_APP_API_URL + `category/${id}`,
    config
  );
};
