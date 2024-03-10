import React from "react";
import { getAllActiveProducts } from "../../../services/Product";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../actions/Action";
import { toast } from "react-toastify";
import { Card, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const LatestProduct = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const placeholderImageSrc = `https://placehold.jp/30/dd6699/ffffff/300x288.png`;

  const loadProducts = useCallback(() => {
    dispatch(showLoader());
    getAllActiveProducts()
      .then((data) => {
        dispatch(hideLoader());
        setProducts(data.data);
      })
      .catch((error) => {
        debugger;
        dispatch(hideLoader());
        toast.error("Error occured while fetching data");
      });
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const checkIfSale = (item) => {
    return item.priceAfterDiscount != item.price;
  };

  return (
    <Row>
      <Col md="12">
        <div className="row justify-content-center section-heading">
          <div className="col-lg-6 text-center">
            <h3 className="h3 mt-2">Latest Arrivals</h3>
          </div>
        </div>
        <div className="row g-3 g-lg-4">
          {products.map((item, index) => {
            return (
              <div className="col-2" key={index}>
                <div className="product-card-10 col-centered">
                  <div className="product-card-image">
                    {checkIfSale(item) ? (
                      <div className="badge-ribbon">
                        <span className="badge bg-danger">Sale</span>
                      </div>
                    ) : (
                      ""
                    )}

                    <div className="product-media">
                      <NavLink to={`/product/${item._id}`}>
                        <img
                          className="img-fluid"
                          src={placeholderImageSrc}
                          title={item.title}
                          alt={item.title}
                        />
                      </NavLink>
                    </div>
                  </div>
                  <div className="product-card-info">
                    {/* <div className="rating-star text">
                      <i className="bi bi-star-fill active" />{" "}
                      <i className="bi bi-star-fill active" />{" "}
                      <i className="bi bi-star-fill active" />{" "}
                      <i className="bi bi-star-fill active" />{" "}
                      <i className="bi bi-star" />
                    </div> */}
                    <h6 className="product-title">
                      <a href="#">{item.title}</a>
                    </h6>
                    <div className="product-price">
                      <span className="text-primary">
                        ${item.priceAfterDiscount}
                      </span>
                      {checkIfSale(item) ? (
                        <del className="ml-2 fs-sm text-muted">
                          ${item.price}
                        </del>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="product-action">
                      {/* <a href="#" className="btn">
                        <i className="fa fa-heart" />{" "}
                      </a> */}

                      <NavLink to={`/product/${item._id}`} className='btn'>
                        <i className="fa fa-eye" />
                      </NavLink>
                      <a href="#" className="btn">
                        <i className="fa fa-shopping-cart" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Col>
    </Row>
  );
};

export default LatestProduct;
