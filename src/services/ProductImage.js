import axios from "axios";

// header configuration
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

// upload product image
export const uploadImage = async (data) => {
  return axios.post(process.env.REACT_APP_API_URL + `product/upload`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// fetch product image
export const productImages = async (productId) => {
  return await axios.get(
    process.env.REACT_APP_API_URL + `product/fetch/images/${productId}`,
    config
  );
};

// delete the particular image
export const deleteImageFromId = async (id) => {
  return await axios.delete(
    process.env.REACT_APP_API_URL + `product/image/${id}`,
    config
  );
};

// update the product image main data
export const updateMainImage = async (id, data) => {
  const formData = {
    productId: data.productId,
  };

  return await axios.put(
    process.env.REACT_APP_API_URL + `product/image/main/${id}`,
    formData,
    config
  );
};
