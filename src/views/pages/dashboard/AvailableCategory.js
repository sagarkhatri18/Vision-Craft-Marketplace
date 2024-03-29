import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { getCatgories } from "../../../services/Category";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../actions/Action";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

const AvailableCategory = () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);

  const loadCategories = useCallback(() => {
    dispatch(showLoader());
    getCatgories()
      .then((data) => {
        dispatch(hideLoader());
        const apiResponse = data.data;
        setCategories(apiResponse);
      })
      .catch((error) => {
        dispatch(hideLoader());
        toast.error("Error occured while fetching data");
      });
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return (
    <>
      <h5 className="h4 mt-2">Available Categories</h5>
      <Row>
        {categories.map((item, index) => {
          const image = `${process.env.REACT_APP_API_BASE_URL}/${item.filePath}/${item.image}`;
          return (
            <Col lg="2" sm="6" key={index} className="pr-0">
              <Card className="card-stats">
                <Card.Body>
                  <NavLink to={`/product/search?category=${item._id}`}>
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
                          <img
                            src={image}
                            style={{ width: "65px", height: "65px" }}
                            alt={item.name}
                          />
                        </div>
                      </Col>
                    </Row>
                  </NavLink>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default AvailableCategory;
