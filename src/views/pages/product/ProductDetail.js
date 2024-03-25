import React, { useCallback, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router";
import { showLoader, hideLoader } from "../../../actions/Action";
import { findProduct } from "../../../services/Product";
import { productImages } from "../../../services/ProductImage";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import placeHolderImage from "../../../assets/img/placeholderImage.png";
import { getAllProductsFromCategoryId } from "../../../services/Product";
import { NavLink } from "react-router-dom";
import Review from "../reviews/CreateReview";

const ProductDetail = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [moreProducts, setMoreProducts] = useState([]);
  const [images, setImages] = useState([]);

  // find product from id
  const findProductFromId = useCallback(() => {
    dispatch(showLoader());
    findProduct(params.id)
      .then((data) => {
        dispatch(hideLoader());
        const returnData = data.data.data;
        setProduct(returnData);
        loadProductFromCategory(returnData.categoryId._id);
      })
      .catch((error) => {
        dispatch(hideLoader());
        toast.error("Error occured while fetching data");
      });
  }, [params.id]);

  // load all the product images
  const loadProductImages = useCallback(() => {
    dispatch(showLoader());
    productImages(params.id)
      .then((data) => {
        dispatch(hideLoader());
        const returnData = data.data;
        setImages(returnData);
      })
      .catch((error) => {
        dispatch(hideLoader());
        toast.error("Error occured while fetching data");
      });
  }, [params.id]);

  // load all the products from category
  const loadProductFromCategory = useCallback((categoryId) => {
    dispatch(showLoader());
    getAllProductsFromCategoryId(categoryId)
      .then((data) => {
        dispatch(hideLoader());
        setMoreProducts(data.data.data);
      })
      .catch((error) => {
        dispatch(hideLoader());
        toast.error("Error occured while fetching data");
      });
  }, []);

  useEffect(() => {
    findProductFromId();
    loadProductImages();
  }, [findProductFromId, loadProductImages]);

  return product && product != null ? (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <>
              <div className="row no-gutters">
                <div className="col-md-5 pr-2">
                  <div className="product-detail card">
                    <Carousel showArrows={true}>
                      {images.length > 0 ? (
                        images.map((item, index) => (
                          <div key={index}>
                            <img
                              src={`${process.env.REACT_APP_API_BASE_URL}/${item.filePath}/${item.image}`}
                              onError={(e) => {
                                e.target.src = placeHolderImage;
                              }}
                            />
                          </div>
                        ))
                      ) : (
                        <div>
                          <img src={placeHolderImage} alt={product.title} />
                        </div>
                      )}
                    </Carousel>
                  </div>
                  <div className="product-detail card mt-2">
                    <h6>Reviews</h6>
                    <div className="d-flex flex-row">
                      <div className="stars">
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                      </div>
                      <span className="ml-1 font-weight-bold">4.6</span>
                    </div>

                    <hr />
                    <div className="comment-section">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex flex-row align-items-center">
                          <img
                            src="https://i.imgur.com/o5uMfKo.jpg"
                            className="rounded-circle profile-image"
                          />
                          <div >
                            <div className="comment-ratings">
                              <i className="fa fa-star" />
                              <i className="fa fa-star" />
                              <i className="fa fa-star" />
                              <i className="fa fa-star" />
                            </div>
                            <span className="username"><Review/></span>
                          </div>
                        </div>
                        <div className="date">
                          <span className="text-muted">2 May</span>
                        </div>
                      </div>
                      <hr />
                    </div>
                  </div>
                </div>
                <div className="col-md-7">
                  <div className="product-detail card">
                    <div className="d-flex flex-row align-items-center">
                      <div className="p-ratings">
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                      </div>
                      <span className="ml-1">5.0</span>
                    </div>
                    <div className="about">
                      <span
                        className="font-weight-bold"
                        style={{ fontSize: "28px" }}
                      >
                        {product.title}
                      </span>
                      <h4 className="font-weight-bold">
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
                    </div>
                    <div className="product-detail-buttons">
                      <button className="btn btn-outline-warning btn-long cart">
                        Add to Cart
                      </button>
                      <button className="btn btn-warning btn-long buy">
                        Buy it Now
                      </button>
                    </div>
                    <hr />
                    <div className="product-description">
                      <div className="mt-2 mb-4">
                        <span
                          className="font-weight-bold"
                          dangerouslySetInnerHTML={{
                            __html: product.description,
                          }}
                        ></span>
                      </div>
                      <div>
                        <span className="font-weight-bold">
                          Available Quantity:
                        </span>
                        <span> {product.availableQuantity}</span>
                      </div>
                      <div>
                        <span className="font-weight-bold">Category:</span>
                        <span> {product.categoryId.name}</span>
                      </div>
                      <div>
                        <span className="font-weight-bold">Added By: </span>
                        <span>
                          {product.userId.firstName} {product.userId.lastName}
                        </span>
                      </div>
                      <div>
                        <span className="font-weight-bold">Added At: </span>
                        <span>
                          {new Date(product.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-weight-bold">Status: </span>
                        <span className="badge bg-primary">
                          {product.isActive ? "Available" : "Not Available"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="product-detail card mt-2">
                    <span>Similar items:</span>
                    <div className="similar-products mt-2 d-flex flex-row">
                      {moreProducts.map((item, index) => {
                        return (
                          <NavLink to={`/product/${item._id}`}>
                            <div
                              className="card border p-1"
                              style={{ width: "9rem", marginRight: 3 }}
                            >
                              <img
                                src={`${process.env.REACT_APP_API_BASE_URL}/${item.filePath}/${item.image}`}
                                onError={(e) => {
                                  e.target.src = placeHolderImage;
                                }}
                                className="card-img-top"
                                alt={item.title}
                              />
                              <div className="card-body">
                                <h6 className="card-title">
                                  ${item.priceAfterDiscount}
                                </h6>
                              </div>
                            </div>
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </>
          </Col>
        </Row>
      </Container>
    </>
  ) : (
    ""
  );
};

export default ProductDetail;
