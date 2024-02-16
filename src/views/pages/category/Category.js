import React from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";

const Category = () => {
  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="card-stats">
              <Card.Header>
                <NavLink to={"/category/add"}>
                  <Button
                    type="button"
                    className="btn-fill float-right"
                  >
                    Add New
                  </Button>
                </NavLink>
              </Card.Header>
              <Card.Body>
                
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Category;
