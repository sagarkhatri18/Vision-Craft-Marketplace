import axios from "axios";

// header configuration
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
};

// create checkout session
export const checkoutSession = async (data) => {
  const formData = data;
  return axios.post(
    process.env.REACT_APP_API_URL + `payment/create-checkout-session`,
    formData,
    config
  );
};

// fetch product order by order id
export const findProductOrder = async (orderId) => {
  return axios.get(
    process.env.REACT_APP_API_URL + `payment/product-order/${orderId}`,
    config
  );
};
