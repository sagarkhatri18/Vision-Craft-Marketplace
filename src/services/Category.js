import axios from "axios";

// header configuration
const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};

// add the new category
export const add = async (data) => {
  const formData = {
    name: data.name,
    slug: data.slug,
    is_active: data.is_active,
  };
  return axios.post(
    process.env.REACT_APP_API_URL + `category`,
    formData,
    config
  );
};
