import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import placeHolderImage from "../../../assets/img/placeholderImage.png";
import axios from "axios";
import { userDetails, createAddressString } from "../../../helpers/helper";
import SimpleReactValidator from "simple-react-validator";
import { showLoader, hideLoader } from "../../../actions/Action";
import {
  getProvinces,
  getCitiesFromProvinceName,
} from "../../../services/Services";
import { checkoutSession } from "../../../services/Payment";
import { toast } from "react-toastify";
import { Error, errorResponse } from "../../../helpers/Error";
import { useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Badge } from "reactstrap";

const ProductReview = (props) => {
  const product = props.product;
  const productCount = props.productCount;
  const dispatch = useDispatch();
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [state, setState] = useState({
    userId: "",
    customerName: "",
    customerEmail: "",
    province: "",
    city: "",
    streetName: "",
    suiteNumber: "",
    postalCode: "",
    customerContact: "",
    country: "Canada",
    orderedThrough: "quick_checkout",
  });

  // Validator Imports
  let validator = useRef(
    new SimpleReactValidator({
      validators: {
        postalCode: {
          required: true,
          message: "Postal code is not in valid format.",
          rule: (val, params, validator) => {
            return validator.helpers.testRegex(
              val,
              /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/
            );
          },
        },
        contactNumber: {
          required: true,
          message: "Contact number must exactly be in 10 digits.",
          rule: (val, params, validator) => {
            return validator.helpers.testRegex(val, /^\d{10}$/);
          },
        },
      },
    })
  ).current;
  const [, forceUpdate] = useState();

  // Calculate subtotal
  const subtotal =
    Math.round(product.priceAfterDiscount * productCount * 100) / 100;

  // Calculate HST (Harmonized Sales Tax) - Assuming 13%
  const hst = (subtotal * 0.13).toFixed(2);

  // Shipping cost - Assuming $15 if subtotal is less than $50
  const shippingCost = subtotal < 50 ? 15 : 0;

  // Calculate total price
  let totalPrice = parseFloat(subtotal) + parseFloat(hst) + shippingCost;
  totalPrice = totalPrice.toFixed(2);

  const fetchProvinces = useCallback(async () => {
    dispatch(showLoader());
    await getProvinces()
      .then((res) => {
        dispatch(hideLoader());
        setProvinces(res.data.data);
      })
      .catch((error) => {
        dispatch(hideLoader());
        setError(errorResponse(error));
      });
  }, []);

  // fetch cities on the basis of province id
  const fetchProvinceCities = useCallback(async (provinceName) => {
    dispatch(showLoader());
    await getCitiesFromProvinceName(provinceName)
      .then((res) => {
        dispatch(hideLoader());
        setCities(res.data.data);
      })
      .catch((error) => {
        dispatch(hideLoader());
        setError(errorResponse(error));
      });
  }, []);

  // handle input fields onchange value
  const handleChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProvinceChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      province: e.target.value,
    }));
    // Fetch cities data based on the selected province
    setCities([]);
    setState((prevState) => ({
      ...prevState,
      city: "",
    }));
    if (e.target.value != "") fetchProvinceCities(e.target.value);
  };

  // fetch current user location
  const fetchLocation = async () => {
    try {
      const response = await axios.get("https://ipinfo.io/json");
      return response.data;
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validator.allValid()) {
      try {
        dispatch(showLoader());
        const stripe = await loadStripe(
          process.env.REACT_APP_STRIP_PUBLISHABLE_KEY
        );

        // Fetch user's location
        const locationData = await fetchLocation();

        const products = [
          {
            category: product.categoryId.name,
            id: product._id,
            name: product.title,
            slug: product.slug,
            price: product.priceAfterDiscount,
            quantity: productCount,
            image: `${process.env.REACT_APP_API_BASE_URL}/${product.filePath}/${product.image}`,
          },
        ];

        // order details
        const productOrder = {
          orderedThrough: state.orderedThrough,
          orderedUserDetails: locationData,
          total: totalPrice,
          subTotal: subtotal,
          shippingCharge: shippingCost,
          hstCharge: hst,
          customerName: state.customerName,
          customerContact: state.customerContact,
          customerEmail: state.customerEmail,
          customerAddress: createAddressString(state),
          userId: state.userId,
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
    } else {
      dispatch(hideLoader());
      validator.showMessages();
      forceUpdate(1);
    }
  };

  useEffect(() => {
    fetchProvinces();
    if (userDetails) {
      setState((prevState) => ({
        ...prevState,
        userId: userDetails._id,
        customerName: userDetails.firstName + " " + userDetails.lastName,
        customerEmail: userDetails.email,
        province: userDetails.province,
        city: userDetails.city,
        streetName: userDetails.streetName,
        suiteNumber: userDetails.suiteNumber,
        postalCode: userDetails.postalCode,
        customerContact: userDetails.contactNumber,
      }));
    }
  }, [fetchProvinces]);

  const checkoutButton = (
    <div className="clearfix below-contents mb-3 mt-3">
      <div className="d-flex justify-content-between align-items-center w-100">
        <div>
          <div className="float-start">
            <p>
              <i>
                Note: $15 shipping cost will be charged for orders less than $50
              </i>
            </p>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <Button
            onClick={handleSubmit}
            className="btn-fill pull-right float-right"
            type="button"
            variant="success"
          >
            Proceed To Checkout
          </Button>
        </div>
      </div>
    </div>
  );

  const defaultShipping = (
    <>
      <p>
        Default Shipping Address:&nbsp;
        <span>
          <Badge color="primary" style={{ fontSize: "15px" }}>
            {createAddressString(state)}
          </Badge>
        </span>
      </p>
      <br></br>
      {checkoutButton}
    </>
  );

  const shippingForm = (
    <>
      <p>Customer Detail</p>
      <Form>
        <Row>
          <Col className="pr-1" md="4">
            <Form.Group>
              <Form.Control
                placeholder="Customer Name"
                name="customerName"
                type="text"
                value={state.customerName}
                onChange={handleChange}
              ></Form.Control>
              {validator.message(
                "customer name",
                state.customerName,
                "required"
              )}
            </Form.Group>
          </Col>
          <Col className="pr-1" md="4">
            <Form.Group>
              <Form.Control
                placeholder="Customer Email"
                name="customerEmail"
                type="text"
                value={state.customerEmail}
                onChange={handleChange}
              ></Form.Control>
              {validator.message(
                "customer email",
                state.customerEmail,
                "required"
              )}
            </Form.Group>
          </Col>
          <Col className="pr-1" md="4">
            <Form.Group>
              <Form.Control
                placeholder="Customer Contact"
                name="customerContact"
                type="number"
                value={state.customerContact}
                onChange={handleChange}
              ></Form.Control>
              {validator.message(
                "contact number",
                state.customerContact,
                "required|contactNumber"
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row className="pt-2">
          <Col className="pr-1" md="4">
            <Form.Group>
              <Form.Control
                name="country"
                type="text"
                disabled={true}
                value={state.country}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col className="pr-1" md="4">
            <Form.Group>
              <select
                className="form-control"
                name="province"
                value={state.province || ""}
                onChange={handleProvinceChange}
              >
                <option value="">Select province</option>
                {provinces.map((province, index) => (
                  <option key={index} value={province.provinceName}>
                    {province.provinceName}
                  </option>
                ))}
              </select>

              {validator.message("province", state.province, "required")}
            </Form.Group>
          </Col>
          <Col className="pr-1" md="4">
            <Form.Group>
              <select
                className="form-control"
                name="city"
                value={state.city || ""}
                onChange={handleChange}
              >
                <option value="">Select city</option>
                {cities.map((item, index) => (
                  <option key={index} value={item.city}>
                    {item.city}
                  </option>
                ))}
              </select>

              {validator.message("city", state.city, "required")}
            </Form.Group>
          </Col>
        </Row>
        <Row className="pt-2">
          <Col className="pr-1" md="4">
            <Form.Group>
              <Form.Control
                name="streetName"
                placeholder="Street Name"
                type="text"
                value={state.streetName}
                onChange={handleChange}
              ></Form.Control>
              {validator.message("streetName", state.streetName, "required")}
            </Form.Group>
          </Col>
          <Col className="pr-1" md="4">
            <Form.Group>
              <Form.Control
                name="suiteNumber"
                placeholder="Suite Number"
                type="text"
                value={state.suiteNumber}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col className="pr-1" md="4">
            <Form.Group>
              <Form.Control
                name="postalCode"
                placeholder="Postal Code"
                type="text"
                disabled={!state.city}
                value={state.postalCode}
                onChange={handleChange}
              ></Form.Control>
              {validator.message(
                "postal code",
                state.postalCode,
                "required|postalCode"
              )}
            </Form.Group>
          </Col>
        </Row>
        {checkoutButton}
      </Form>
    </>
  );

  return (
    <>
      <table className="table">
        <thead>
          <tr style={{ background: "#e9e7e7" }}>
            <th scope="col" width="15%"></th>
            <th scope="col" width="20%">
              Category
            </th>
            <th scope="col" width="30%">
              Product Name
            </th>
            <th scope="col" width="10%">
              Quantity
            </th>
            <th scope="col" width="10%">
              Price
            </th>
            <th scope="col" width="15%">
              Total Price
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <img
                className="img-fluid"
                src={`${process.env.REACT_APP_API_BASE_URL}/${product.filePath}/${product.image}`}
                alt={product.title}
                title={product.title}
                width="63px"
                onError={(e) => {
                  e.target.src = placeHolderImage;
                }}
              />
            </td>
            <td>{product.categoryId.name}</td>
            <td>{product.title}</td>
            <td>{productCount}</td>
            <td>${product.priceAfterDiscount}</td>
            <td style={{ textAlign: "end" }}>${subtotal}</td>
          </tr>
        </tbody>
      </table>
      <div className="clearfix below-contents">
        <span className="float-end">
          <table className="float-end table text-right">
            <tbody>
              <tr style={{ fontSize: 14 }}>
                <td>Shipping cost:</td>
                <td>${shippingCost}</td>
              </tr>
              <tr style={{ fontSize: 14 }}>
                <td>HST (13%):</td>
                <td>${hst}</td>
              </tr>
              <tr style={{ fontSize: 15 }}>
                <td>Estimated Total:</td>
                <td>${totalPrice}</td>
              </tr>
            </tbody>
          </table>
        </span>
        {userDetails ? defaultShipping : shippingForm}
      </div>
    </>
  );
};

export default ProductReview;
