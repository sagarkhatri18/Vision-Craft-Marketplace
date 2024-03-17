import React, { useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

const AddToCart = () => {
  const [cartItems, setCartItems] = useState(0);

  const cartDetails = (
    <>
      <table className="table">
        <thead>
          <tr>
            <th scope="col" width="5%">
              S.N
            </th>
            <th scope="col" width="15%" />
            <th scope="col" width="15%">
              Category
            </th>
            <th scope="col" width="30%">
              Item Name
            </th>
            <th scope="col" width="15%">
              Quantity
            </th>
            <th scope="col" width="7%">
              Stock
            </th>
            <th scope="col" width="20%">
              Action
            </th>
            <th scope="col">Price (In $)</th>
          </tr>
        </thead>
        <tbody id="cart_item_lists" />
      </table>
      <div className="alert alert-info clearfix below-contents">
        <span className="float-end">
          <table className="float-end table text-right">
            <tbody>
              <tr style={{ fontSize: 18 }}>
                <th>Subtotal:</th>
                <td id="sub_total" />
              </tr>
              <tr style={{ fontSize: 18 }}>
                <th>Shipping cost:</th>
                <td id="shipping_cost" />
              </tr>
              <tr style={{ fontSize: 24 }}>
                <th>Estimated Total:</th>
                <td id="estimated_total" />
              </tr>
            </tbody>
          </table>
        </span>
        <div className="float-start" style={{ paddingTop: 116 }}>
          <p>
            <i>
              Note: $15 shipping cost will be charge for the order less than $50
            </i>
          </p>
        </div>
      </div>
      <div className=" clearfix">
        <button type="button" className="btn btn-danger btn-md float-end">
          Go To Checkout
        </button>
        <a href="index.html" className="btn btn-success btn-md float-start">
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
                {cartItems > 0 ? (
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
