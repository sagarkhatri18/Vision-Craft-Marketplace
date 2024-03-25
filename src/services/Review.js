import axios from "axios";

// header configuration
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

export const add = async (data) => {
    const formData = {
      name: data.name,
      
    };
    return axios.post(
      process.env.REACT_APP_API_URL + `review`,
      formData,
      config
    );
  };