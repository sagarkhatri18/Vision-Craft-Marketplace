import React, { createContext, useState, useContext } from "react";
import {
  getCurrentUserDetails,
  isLoggedIn,
  isAdminLogin,
} from "../helpers/IsLoggedIn";
import { add, update, deleteFromId } from "../services/Cart";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../actions/Action";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItemsCount, setCartItemsCount] = useState(
    localStorage.getItem("cartQuantity")
  );
  const dispatch = useDispatch();

  // add the new item to cart
  const addToCart = ({ productId, quantity }) => {
    if (isLoggedIn() && !isAdminLogin()) {
      const formData = {
        quantity,
        productId,
        userId: getCurrentUserDetails().id,
      };

      dispatch(showLoader());
      add(formData)
        .then((data) => {
          dispatch(hideLoader());
          updateToLocalStorage(data.data.cartQuantity);
          toast.success(data.data.message);
        })
        .catch((error) => {
          dispatch(hideLoader());
          toast.error(error);
        });
    } else {
      toast.error(`Sorry, you need to login first as a customer`);
    }
  };

  // update the existing cart item 
  const updateTheCart = ({ id, quantity }) => {
    if (isLoggedIn() && !isAdminLogin()) {
      dispatch(showLoader());
      update(id, {quantity})
        .then((data) => {
          dispatch(hideLoader());
          updateToLocalStorage(data.data.cartQuantity);
          toast.success(data.data.message);
        })
        .catch((error) => {
          dispatch(hideLoader());
          toast.error(error);
        });
    } else {
      toast.error(`Sorry, you need to login first as a customer`);
    }
  };

  // update the existing cart item 
  const deleteTheCart = ({ id }) => {
    if (isLoggedIn() && !isAdminLogin()) {
      dispatch(showLoader());
      deleteFromId(id)
        .then((data) => {
          dispatch(hideLoader());
          updateToLocalStorage(data.data.cartQuantity);
          toast.success(data.data.message);
        })
        .catch((error) => {
          dispatch(hideLoader());
          toast.error(error);
        });
    } else {
      toast.error(`Sorry, you need to login first as a customer`);
    }
  };

  const updateToLocalStorage = (quantity) => {
    localStorage.setItem("cartQuantity", quantity);
    setCartItemsCount(quantity);
  }

  const cartCount = parseInt(cartItemsCount);

  return (
    <CartContext.Provider value={{ cartCount, addToCart, updateTheCart, deleteTheCart }}>
      {children}
    </CartContext.Provider>
  );
};
