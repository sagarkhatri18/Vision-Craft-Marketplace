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
    description: data.description,
  };
  return axios.post(
    process.env.REACT_APP_API_URL + `product`,
    formData,
    config
  );
};

// update the product
export const update = async (id, data) => {
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
    description: data.description,
  };

  return await axios.put(
    process.env.REACT_APP_API_URL + `product/${id}`,
    formData,
    config
  );
};

// list all the available products
export const getAllProducts = async () => {
  return await axios.get(process.env.REACT_APP_API_URL + `product`, config);
};

// list all the active products
export const getAllActiveProducts = async () => {
  return await axios.get(
    process.env.REACT_APP_API_URL + `product/fetch/active`
  );
};

// list all the products from category id
export const getAllProductsFromCategoryId = async (categoryId) => {
  return await axios.get(
    process.env.REACT_APP_API_URL + `product/fetch/category/${categoryId}`
  );
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

// search product from product's title
export const searchProduct = async (data) => {
  const { title, categoryId, dateFrom, dateTo, priceFrom, priceTo } = data;

  return await axios.post(process.env.REACT_APP_API_URL + `product/search`, {
    title,
    categoryId,
    dateFrom,
    dateTo,
    priceFrom,
    priceTo,
  });
};
