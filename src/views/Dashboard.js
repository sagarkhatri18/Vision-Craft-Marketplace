import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";

function Dashboard() {
  return (
    <>
      <Container fluid>
        <Row>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <h4>Dashboard</h4>
                {/* <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-favourite-28 text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Followers</p>
                      <Card.Title as="h4">+45K</Card.Title>
                    </div>
                  </Col>
                </Row> */}
              </Card.Body>
              {/* <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-redo mr-1"></i>
                  Update now
                </div>
              </Card.Footer> */}
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
