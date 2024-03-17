import shoppingCartIcon from "../../assets/img/cart.png";
import { useCart } from "../../context/CartContext";

const CartIcon = () => {
  const { cartCount } = useCart();

  return (
    <div>
      <img
        src={shoppingCartIcon}
        alt="Shopping Cart"
        style={{ height: "30px", width: "30px", marginLeft: "20px" }}
      />
      {cartCount > 0 && (
        <span className="badge badge-pill badge-primary">{cartCount}</span>
      )}
    </div>
  );
};

export default CartIcon;
