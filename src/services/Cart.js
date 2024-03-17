import axios from "axios";

// header configuration
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

// add the new product
export const add = async (data) => {
  const { quantity, productId, userId } = data;

  return axios.post(
    process.env.REACT_APP_API_URL + `cart`,
    { quantity, productId, userId },
    config
  );
};
