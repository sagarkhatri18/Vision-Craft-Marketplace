import { isExpired, decodeToken } from "react-jwt";

// check if the user is logged into the system
export const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  if (token !== null) {
    try {
      const isMyTokenExpired = isExpired(token);

      // Check if token expiry
      if (!isMyTokenExpired) {
        return true;
      } else {
        localStorage.clear();
        return false;
      }
    } catch (error) {
      localStorage.clear();
      return false;
    }
  } else {
    localStorage.clear();
    return false;
  }
};

// get current logged in role
export const loggedInRole = () => {
  const loginStatus = isLoggedIn();

  if (loginStatus) {
    const decodedToken = decodeToken(localStorage.getItem("token"));
    const role = decodedToken.role;

    return role;
  } else {
    return "all";
  }
};

// check if admin is logged in
export const isAdminLogin = () => {
  const loginStatus = isLoggedIn();

  if (loginStatus) {
    const decodedToken = decodeToken(localStorage.getItem("token"));
    const role = decodedToken.role;

    return role == "admin";
  } else {
    localStorage.clear();
    return false;
  }
};
