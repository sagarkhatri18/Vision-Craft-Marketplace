import React from "react";
import { Card, Row, Col } from "react-bootstrap";

const CategoryDashboardData = (props) => {
  const categories = props.data;

  return categories.map((item, index) => {
    const image = `${process.env.REACT_APP_API_BASE_URL}${item.filePath}${item.image}`;
    return (
      <Col lg="3" sm="6" key={index}>
        <Card className="card-stats">
          <Card.Body>
            <Row>
              <Col xs="10">
                <div
                  className="text-center float-left"
                  style={{ fontSize: "25px" }}
                >
                  <i className="normal-text">{item.name}</i>
                </div>
              </Col>
              <Col xs="2">
                <div
                  className="text-center float-right"
                  style={{ fontSize: "25px" }}
                >
                  <img src={image} style={{ width: "65px", height: "65px" }} alt={item.name}/>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    );
  });
};

export default CategoryDashboardData;
