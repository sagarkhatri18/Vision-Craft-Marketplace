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

// update the cart item
export const update = async (id, data) => {
  const { quantity } = data;
  return await axios.put(
    process.env.REACT_APP_API_URL + `cart/${id}`,
    { quantity },
    config
  );
};

// delete the particular product
export const deleteFromId = async (id) => {
  return await axios.delete(
    process.env.REACT_APP_API_URL + `cart/${id}`,
    config
  );
};

// fetch add to cart items of certain user
export const index = async (userId) => {
  return axios.get(process.env.REACT_APP_API_URL + `cart/${userId}`, config);
};
