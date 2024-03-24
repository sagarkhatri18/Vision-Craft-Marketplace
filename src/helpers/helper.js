import { decodeToken } from "react-jwt";

export const userDetails = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

// Function to update the token in localStorage
export const updateTokenInLocalStorage = (token) => {
  localStorage.setItem("token", token);
};

export const createAddressString = (address) => {
  let addressString = "";

  // Append suiteNumber if available
  if (address.suiteNumber) {
    addressString += address.suiteNumber + ", ";
  }

  // Append streetName
  addressString += address.streetName + ", ";

  // Append city
  addressString += address.city + ", ";

  // Append province
  addressString += address.province + ", ";

  // Append postalCode
  addressString += address.postalCode + ", ";

  // Append country
  addressString += address.country;

  return addressString;
};
