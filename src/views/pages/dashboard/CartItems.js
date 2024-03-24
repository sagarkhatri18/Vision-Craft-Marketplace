import React, { useCallback, useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { showLoader, hideLoader } from "../../../actions/Action";
import { index } from "../../../services/Cart";
import { checkoutSession } from "../../../services/Payment";
import { toast } from "react-toastify";
import { useCart } from "../../../context/CartContext";
import { NavLink } from "react-router-dom";
import axios from "axios";
import placeHolderImage from "../../../assets/img/placeholderImage.png";
import { loadStripe } from "@stripe/stripe-js";
import { createAddressString } from "../../../helpers/helper";

const AddToCart = () => {
  const userDetails = JSON.parse(localStorage.getItem("user"))
  const dispatch = useDispatch();
  const { updateTheCart, deleteTheCart } = useCart();
  const [cartItems, setCartItems] = useState([]);

  const fetchCartItems = useCallback(() => {
    if (userDetails && userDetails._id) {
      dispatch(showLoader());
      index(userDetails._id)
        .then((data) => {
          dispatch(hideLoader());
          setCartItems(data.data);
        })
        .catch((error) => {
          dispatch(hideLoader());
          toast.error("Error occurred while fetching data");
        });
    } else {
      toast.error("User details not available. Please log in again.");
      setCartItems([]);
    }
  }, []);

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

  // fetch current user location
  const fetchLocation = async () => {
    try {
      const response = await axios.get("https://ipinfo.io/json");
      return response.data;
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  // make stripe payment
  const makePayment = async () => {
    if (!Boolean(userDetails.profileCompletion)) {
      toast.error(
        `Your profile is not completed. Please first complete your profile first`
      );
      return false;
    }

    try {
      dispatch(showLoader());
      const stripe = await loadStripe(
        process.env.REACT_APP_STRIP_PUBLISHABLE_KEY
      );

      // Fetch user's location
      const locationData = await fetchLocation();

      const products = cartItems.map((item, index) => ({
        category: item.productId.categoryId.name,
        id: item.productId._id,
        name: item.productId.title,
        slug: item.productId.slug,
        price: item.productId.priceAfterDiscount,
        quantity: item.quantity,
        image: `${process.env.REACT_APP_API_BASE_URL}/${item.productId.filePath}/${item.productId.image}`,
      }));

      // order details
      const productOrder = {
        orderedThrough: "cart_items",
        orderedUserDetails: locationData,
        total: totalPrice,
        subTotal: subtotal,
        shippingCharge: shippingCost,
        hstCharge: hst,
        customerName: userDetails.firstName + " " + userDetails.lastName,
        customerContact: userDetails.contactNumber,
        customerEmail: userDetails.email,
        customerAddress: createAddressString(userDetails),
        userId: userDetails._id,
      };

      dispatch(showLoader());
      const session = await checkoutSession({
        products,
        shippingCost,
        hst,
        productOrder,
        baseURL: window.location.origin,
      });
      dispatch(hideLoader());

      // Redirect to Stripe checkout page
      await stripe.redirectToCheckout({
        sessionId: session.data.id,
      });
    } catch (error) {
      dispatch(hideLoader());
      toast.error("Error occurred during payment");
    }
  };

  const cartDetails = (
    <>
      <table className="table">
        <thead>
          <tr>
            <th scope="col" width="5%"></th>
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
                <td>
                  <img
                    className="img-fluid"
                    src={`${process.env.REACT_APP_API_BASE_URL}/${item.productId.filePath}/${item.productId.image}`}
                    alt={item.productId.title}
                    title={item.productId.title}
                    onError={(e) => {
                      e.target.src = placeHolderImage;
                    }}
                  />
                </td>
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
                        style={{ border: "unset" }}
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
        <div className="clearfix below-contents mb-3">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div>
              <div className="float-start">
                <p>
                  <i>
                    Note: $15 shipping cost will be charged for orders less than
                    $50
                  </i>
                </p>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <button
                type="button"
                className="btn btn-danger btn-md mr-2"
                onClick={makePayment}
              >
                Go To Checkout
              </button>
              <NavLink to={"/dashboard"} className="btn btn-success btn-md">
                Continue Shopping
              </NavLink>
            </div>
          </div>
        </div>
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
