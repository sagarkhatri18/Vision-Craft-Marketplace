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
    addedBy: data.addedBy
  };
  return axios.post(
    process.env.REACT_APP_API_URL + `product`,
    formData,
    config
  );
};
