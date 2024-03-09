import axios from "axios";

// header configuration
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

// add the new product
export const add = async (data) => {
  const formData = {
    title: data.title,
    slug: data.slug,
    isActive: data.isActive,
    categoryId: data.categoryId,
    userId: data.userId,
    discountPercentage: data.discountPercentage,
    price: data.price,
    availableQuantity: data.availableQuantity,
    discountAmount: data.discountAmount,
    priceAfterDiscount: data.priceAfterDiscount,
    addedBy: data.addedBy,
    description: data.description
  };
  return axios.post(
    process.env.REACT_APP_API_URL + `product`,
    formData,
    config
  );
};

// list all the available products
export const getAllProducts = async () => {
  return await axios.get(process.env.REACT_APP_API_URL + `product`, config);
};

// get specific product from id
export const findProduct = async (id) => {
  return await axios.get(
    process.env.REACT_APP_API_URL + `product/${id}`,
    config
  );
};

// list all the products from certain users
export const getAllProductsFromUser = async (userId) => {
  return await axios.get(
    process.env.REACT_APP_API_URL + `product/fetch-from-userid/${userId}`,
    config
  );
};

// delete the particular product
export const deleteProductFromId = async (id) => {
  return await axios.delete(
    process.env.REACT_APP_API_URL + `product/${id}`,
    config
  );
};
