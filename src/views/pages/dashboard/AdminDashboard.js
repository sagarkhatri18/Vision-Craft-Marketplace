import { Card, Row, Col } from "react-bootstrap";

export const AdminDashboard = () => {
  return (
    <>
      <Col lg="3" sm="6">
        <Card className="card-stats">
          <Card.Body>
            <Row>
              <Col xs="10">
                <div
                  className="text-center float-left"
                  style={{ fontSize: "25px" }}
                >
                  <i className="normal-text">Category</i>
                </div>
              </Col>
              <Col xs="2">
                <div
                  className="text-center float-right"
                  style={{ fontSize: "25px" }}
                >
                  <i className="normal-text">45</i>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};
