// CartContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItemsCount, setCartItemsCount] = useState(
    localStorage.getItem("cartQuantity")
  );

  const addToCart = (quantity) => {
    setCartItemsCount((prevCount) => parseInt(prevCount) + parseInt(quantity));
  };

  //   const removeFromCart = (productId) => {
  //     setCartItems((prevItems) =>
  //       prevItems.filter((item) => item.id !== productId)
  //     );
  //   };

  const cartCount = parseInt(cartItemsCount);
  return (
    <CartContext.Provider value={{ cartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
