import React, { useCallback, useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../actions/Action";
import { index } from "../../../services/Cart";
import { decodeToken } from "react-jwt";
import { toast } from "react-toastify";
import { useCart } from "../../../context/CartContext";

const AddToCart = () => {
  const getUserId = decodeToken(localStorage.getItem("token")).id;
  const dispatch = useDispatch();
  const { updateTheCart, deleteTheCart } = useCart();
  const [cartItems, setCartItems] = useState([]);

  const fetchCartItems = useCallback(() => {
    dispatch(showLoader());
    index(getUserId)
      .then((data) => {
        dispatch(hideLoader());
        setCartItems(data.data);
      })
      .catch((error) => {
        dispatch(hideLoader());
        toast.error("Error occured while fetching data");
      });
  }, [getUserId]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  // increase the product quantity
  const increaseQuantity = async (item) => {
    const quantity = item.quantity;
    const maxQuantity = item.productId.availableQuantity;

    if (quantity + 1 > maxQuantity) {
      toast.error(
        `Sorry, you can only order a maximum of ${maxQuantity} quantity`
      );
    } else {
      await updateTheCart({ id: item._id, quantity: quantity + 1 });
      // Update the quantity in the cartItems state
      setCartItems((prevCartItems) =>
        prevCartItems.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: quantity + 1 }
            : cartItem
        )
      );
    }
  };

  // decrease the product quantity
  const decreaseQuantity = async (item) => {
    const quantity = item.quantity;
    if (quantity > 1) {
      await updateTheCart({ id: item._id, quantity: quantity - 1 });
      // Update the quantity in the cartItems state
      setCartItems((prevCartItems) =>
        prevCartItems.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: quantity - 1 }
            : cartItem
        )
      );
    }
  };

  // on change the quantity
  const changeQuantity = async (e, item) => {
    const value = parseInt(e.target.value);
    if (
      !isNaN(value) &&
      value >= 1 &&
      value <= item.productId.availableQuantity
    ) {
      await updateTheCart({ id: item._id, quantity: value });

      // Update the quantity in the cartItems state
      setCartItems((prevCartItems) =>
        prevCartItems.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: value }
            : cartItem
        )
      );
    }
  };

  // delete the cart item
  const deleteCartItem = async (item) => {
    await deleteTheCart({ id: item._id });
    // Update the cartItems state by removing the deleted item
    setCartItems((prevCartItems) =>
      prevCartItems.filter((cartItem) => cartItem._id !== item._id)
    );
  };

  // Calculate subtotal
  const subtotal = cartItems
    .reduce(
      (total, item) =>
        total + item.quantity * item.productId.priceAfterDiscount,
      0
    )
    .toFixed(2);

  // Calculate HST (Harmonized Sales Tax) - Assuming 13%
  const hst = (subtotal * 0.13).toFixed(2);

  // Shipping cost - Assuming $15 if subtotal is less than $50
  const shippingCost = subtotal < 50 ? 15 : 0;

  // Calculate total price
  let totalPrice = parseFloat(subtotal) + parseFloat(hst) + shippingCost;
  totalPrice = totalPrice.toFixed(2);

  const cartDetails = (
    <>
      <table className="table">
        <thead>
          <tr>
            <th scope="col" width="5%">
              S.N
            </th>
            <th scope="col" width="10%">
              Category
            </th>
            <th scope="col" width="20%">
              Product Name
            </th>
            <th scope="col" width="20%">
              Quantity
            </th>
            <th scope="col">Available Quantity</th>
            <th scope="col">Action</th>
            <th scope="col">Price</th>
            <th scope="col" width="6%">
              Total Price
            </th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}.</td>
                <td>{item.productId.categoryId.name}</td>
                <td>{item.productId.title}</td>
                <td>
                  <div className="d-flex justify-content-start">
                    <div className="input-group w-auto justify-content-start align-items-center">
                      <input
                        type="button"
                        defaultValue="-"
                        onClick={() => decreaseQuantity(item)}
                        className="button-minus border rounded-circle icon-shape icon-sm mx-1"
                        data-field="quantity"
                      />
                      <input
                        type="number"
                        step={1}
                        min={1}
                        max={item.productId.availableQuantity}
                        value={item.quantity}
                        onChange={(e) => changeQuantity(e, item)}
                        name="quantity"
                        className="quantity-field border-1 text-center w-40"
                      />
                      <input
                        type="button"
                        defaultValue="+"
                        onClick={() => increaseQuantity(item)}
                        className="button-plus border rounded-circle icon-shape icon-sm "
                        data-field="quantity"
                      />
                    </div>
                  </div>
                </td>
                <td>{item.productId.availableQuantity}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteCartItem(item)}
                  >
                    Remove
                  </button>
                </td>
                <td>${item.productId.priceAfterDiscount}</td>
                <td>
                  $
                  {(item.productId.priceAfterDiscount * item.quantity).toFixed(
                    2
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="clearfix below-contents">
        <span className="float-end">
          <table className="float-end table text-right">
            <tbody>
              <tr style={{ fontSize: 14 }}>
                <th>Subtotal:</th>
                <td>${subtotal}</td>
              </tr>
              <tr style={{ fontSize: 14 }}>
                <th>Shipping cost:</th>
                <td>${shippingCost}</td>
              </tr>
              <tr style={{ fontSize: 14 }}>
                <th>HST (13%):</th>
                <td>${hst}</td>
              </tr>
              <tr style={{ fontSize: 15 }}>
                <th>Estimated Total:</th>
                <td>${totalPrice}</td>
              </tr>
            </tbody>
          </table>
        </span>
        <div className="float-start">
          <p>
            <i>
              Note: $15 shipping cost will be charge for the order less than $50
            </i>
          </p>
        </div>
      </div>
      <div className="clearfix mb-3">
        <button type="button" className="btn btn-danger btn-md float-end mr-2">
          Go To Checkout
        </button>
        <a href="index.html" className="btn btn-success btn-md float-end">
          Continue Shopping
        </a>
      </div>
    </>
  );

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="card-stats">
              <Card.Header>My Cart Items</Card.Header>
              <Card.Body>
                {cartItems.length > 0 ? (
                  cartDetails
                ) : (
                  <h4>Sorry, there are no any items in the cart</h4>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AddToCart;
