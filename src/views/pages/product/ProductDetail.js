import React, { useCallback, useEffect, useState } from "react";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { useParams } from "react-router";
import { showLoader, hideLoader } from "../../../actions/Action";
import { findProduct } from "../../../services/Product";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const imageSrc = `https://placehold.co/600x400`;

  const [product, setProduct] = useState(null);

  // find product from id
  const findProductFromId = useCallback(() => {
    dispatch(showLoader());
    findProduct(params.id)
      .then((data) => {
        dispatch(hideLoader());
        const returnData = data.data.data;
        setProduct(returnData);
      })
      .catch((error) => {
        dispatch(hideLoader());
        toast.error("Error occured while fetching data");
      });
  }, [params.id]);

  useEffect(() => {
    findProductFromId();
  }, [findProductFromId]);

  return (product && product != null) ?
  (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card>
              <Card.Body>
                <Row>
                  {/* <div className="wrapper row"> */}
                  <div className="preview col-md-6">
                    <div className="preview-pic tab-content">
                      <div className="tab-pane active" id="pic-1">
                        <img src={imageSrc} alt="test image" />
                      </div>
                      <div className="tab-pane" id="pic-2">
                        <img src={imageSrc} alt="test image" />
                      </div>
                      <div className="tab-pane" id="pic-3">
                        <img src={imageSrc} alt="test image" />
                      </div>
                      <div className="tab-pane" id="pic-4">
                        <img src={imageSrc} alt="test image" />
                      </div>
                      <div className="tab-pane" id="pic-5">
                        <img src={imageSrc} alt="test image" />
                      </div>
                    </div>
                    <ul className="preview-thumbnail nav nav-tabs">
                      <li className="active">
                        <a data-target="#pic-1" data-toggle="tab">
                          <img src={imageSrc} alt="test image" />
                        </a>
                      </li>
                      <li>
                        <a data-target="#pic-2" data-toggle="tab">
                          <img src={imageSrc} alt="test image" />
                        </a>
                      </li>
                      <li>
                        <a data-target="#pic-3" data-toggle="tab">
                          <img src={imageSrc} alt="test image" />
                        </a>
                      </li>
                      <li>
                        <a data-target="#pic-4" data-toggle="tab">
                          <img src={imageSrc} alt="test image" />
                        </a>
                      </li>
                      <li>
                        <a data-target="#pic-5" data-toggle="tab">
                          <img src={imageSrc} alt="test image" />
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="details col-md-6">
                    <h3 className="product-title">{product.title}</h3>
                    <div className="rating">
                      <div className="stars">
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                      </div>
                      <span className="review-no">41 reviews</span>
                    </div>
                    <p className="product-description">
                      Suspendisse quos? Tempus cras iure temporibus? Eu
                      laudantium cubilia sem sem! Repudiandae et! Massa senectus
                      enim minim sociosqu delectus posuere.
                    </p>
                    <h4 className="price">
                      current price:
                      {product.discountPercentage > 0 &&
                      product.discountPercentage != null ? (
                        <span className="ml-2">
                          <del className="text-danger">${product.price}</del>
                          <span className="ml-2">
                            ${product.priceAfterDiscount}
                          </span>
                        </span>
                      ) : (
                        <span className="ml-2">${product.price}</span>
                      )}
                    </h4>
                    {/* <p className="vote">
                      <strong>91%</strong> of buyers enjoyed this product!{" "}
                      <strong>(87 votes)</strong>
                    </p> */}
                    <h5 className="sizes">
                      Available Quantity: {product.availableQuantity}
                    </h5>

                    <h5 className="sizes">
                      Status:{" "}
                      <span className="badge bg-primary">
                        {product.isActive ? "Available" : "Not Available"}
                      </span>
                    </h5>
                    <h5 className="sizes">Added By: {product.userId.firstName} {product.userId.lastName}</h5>
                    <h5 className="colors">Added At: {new Date(product.createdAt).toLocaleString()}</h5>
                    <div className="action">
                      <button
                        className="mr-1 add-to-cart btn btn-default"
                        type="button"
                      >
                        add to cart
                      </button>
                      <button className="like btn btn-default" type="button">
                        <span className="fa fa-heart"></span>
                      </button>
                    </div>
                  </div>
                  {/* </div> */}

                  {/* <Col md="6">
                    <img src={imageSrc} alt="test image" />
                  </Col>
                  <Col md="6">
                    <Table className="table-hover table-striped">
                      <tbody>
                        <tr>
                          <td>Title: </td>
                          <td>Dakota Rice</td>
                        </tr>
                        <tr>
                          <td>Active Status: </td>
                          <td>Minerva Hooper</td>
                        </tr>
                        <tr>
                          <td>Available Quantity: </td>
                          <td>Dakota Rice</td>
                        </tr>
                        <tr>
                          <td>Discount Percentage: </td>
                          <td>Minerva Hooper</td>
                        </tr>
                        <tr>
                          <td>Discount Amount: </td>
                          <td>Dakota Rice</td>
                        </tr>
                        <tr>
                          <td>Price After Discount: </td>
                          <td>Minerva Hooper</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col> */}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  ):"";
};

export default ProductDetail;
