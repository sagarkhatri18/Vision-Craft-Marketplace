import React from "react";
import { Container, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Product = () => {
  return (
    <Container fluid>
      <Row>
        <div className="col-12 text-end mb-2">
          <NavLink to="/product/create">
            <button
              type="button"
              className="btn btn-sm btn-primary float-right"
            >
              Add New
            </button>
          </NavLink>
        </div>
      </Row>
    </Container>
  );
};

export default Product;
