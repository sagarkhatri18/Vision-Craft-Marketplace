import React, { useState, useCallback, useEffect } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { NavLink, useParams } from "react-router-dom";
import { findProductOrder } from "../../../services/Payment";
import { showLoader, hideLoader } from "../../../actions/Action";
import { Error, errorResponse } from "../../../helpers/Error";
import { useDispatch } from "react-redux";
import { useCart } from "../../../context/CartContext";

const Success = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const orderId = params.orderId;

  const { updateCartQuantity } = useCart();
  const [order, setOrder] = useState([]);
  const [error, setError] = useState("");

  const fetchProductOrder = useCallback(async () => {
    dispatch(showLoader());
    await findProductOrder(orderId)
      .then((res) => {
        dispatch(hideLoader());
        setOrder(res.data.data);
        updateCartQuantity()
      })
      .catch((error) => {
        dispatch(hideLoader());
        setError(errorResponse(error));
      });
  }, []);

  useEffect(() => {
    fetchProductOrder();
  }, [fetchProductOrder]);

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="card-stats">
              <Card.Body>
                <Error errors={error} />
                {!error ? (
                  <Wrapper>
                    <div className="success-page">
                      <IoIosCheckmarkCircleOutline className="checkmark" />
                      <h2>Payment Successful !</h2>
                      <p>
                        Thank you. We have received the payment of <strong>${order.total}</strong>
                      </p>
                      <NavLink to={"/"} className="btn-view-orders">
                        View Your Order
                      </NavLink>
                      <br></br>
                      <NavLink to={"/dashboard"}>Continue Shopping</NavLink>
                    </div>
                  </Wrapper>
                ) : (
                  ""
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

const Wrapper = styled.div`
  .success-page {
    max-width: 300px;
    display: block;
    margin: 70px auto;
    text-align: center;
    position: relative;
    top: 50%;
  }
  .checkmark {
    color: #9abc66;
    font-size: 200px;
    line-height: 200px;
    margin-left: -15px;
  }
  .success-page img {
    max-width: 62px;
    display: block;
    margin: 0 auto;
  }

  .btn-view-orders {
    display: block;
    border: 1px solid #9abc66;
    width: 140px;
    margin: 0 auto;
    margin-top: 45px;
    padding: 10px;
    color: #fff;
    background-color: #9abc66;
    text-decoration: none;
    margin-bottom: 20px;
  }
  h2 {
    color: #9abc66;
    margin-top: 25px;
  }
  a {
    text-decoration: none;
  }
`;
export default Success;
