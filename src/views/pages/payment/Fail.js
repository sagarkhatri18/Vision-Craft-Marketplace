import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import styled from "styled-components";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { NavLink } from "react-router-dom";

const Fail = () => {
  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="card-stats">
              <Card.Body>
                <Wrapper>
                  <div className="success-page">
                    <IoIosCloseCircleOutline className="checkmark" />
                    <h2>Payment Failed !</h2>
                    <p>
                      Sorry, failed to receive the payment. Please try again
                    </p>

                    <br></br>
                    <NavLink to={"/dashboard"}>Continue Shopping</NavLink>
                  </div>
                </Wrapper>
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
    color: #e13232;
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
    border: 1px solid #e13232;
    width: 100px;
    margin: 0 auto;
    margin-top: 45px;
    padding: 10px;
    color: #fff;
    background-color: #e13232;
    text-decoration: none;
    margin-bottom: 20px;
  }
  h2 {
    color: #e13232;
    margin-top: 25px;
  }
  a {
    text-decoration: none;
  }
`;
export default Fail;
