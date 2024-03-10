import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
// Validator Packages
import SimpleReactValidator from "simple-react-validator";
import { Error, errorResponse } from "../../../helpers/Error";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { Editor } from "primereact/editor";

import { showLoader, hideLoader } from "../../../actions/Action";
import { getCatgories } from "../../../services/Category";
import {
  getCurrentUserDetails,
  loggedInRole,
} from "../../../helpers/IsLoggedIn";
import { update, findProduct } from "../../../services/Product";

const Update = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const currentRole = loggedInRole().toLowerCase();
  const loggedInDetail = getCurrentUserDetails();
  const currentUserId =
    currentRole != "admin" && loggedInDetail != null ? loggedInDetail.id : "";

  // Validator Imports
  const validator = useRef(new SimpleReactValidator()).current;
  const [, forceUpdate] = useState();

  // set state
  const [state, setState] = useState([]);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState([]);
  const [users, setUsers] = useState([]);

  // handle input fields onchange value
  const handleChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // handle change product description
  const handleProductDescriptionChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      description: e.htmlValue,
    }));
  };

  // handle select dropdown on change
  const handleCategorySelectOption = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };

  // handle user select dropdown on change
  const handleUserSelectOption = (selectedOption) => {
    setSelectedUser(selectedOption);
  };

  const handleChangePrice = (e) => {
    const priceValue = e.target.value;
    const discountPercent = state.discountPercentage;
    changePriceDiscount(priceValue, discountPercent);
  };

  const handleChangeDiscount = (e) => {
    const priceValue = state.price;
    const discountPercent = e.target.value;
    changePriceDiscount(priceValue, discountPercent);
  };

  const changePriceDiscount = (priceValue, discountPercent) => {
    if (priceValue == "" || Number(priceValue) == "0") {
      setState((prevState) => ({
        ...prevState,
        discountPercentage: "0",
        discountAmount: "0",
        priceAfterDiscount: "0",
        price: priceValue,
      }));
    } else {
      const discountAmount = ((discountPercent / 100) * priceValue).toFixed(2);
      const priceAfterDiscount = (priceValue - discountAmount).toFixed(2);
      setState((prevState) => ({
        ...prevState,
        discountAmount: discountAmount,
        discountPercentage: discountPercent,
        price: priceValue,
        priceAfterDiscount: priceAfterDiscount,
      }));
    }
  };

  // load all the available categories
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

  // load the product detail
  const loadProduct = useCallback(() => {
    dispatch(showLoader());
    findProduct(params.id)
      .then((data) => {
        dispatch(hideLoader());
        const apiResponse = data.data.data;
        setState(apiResponse);
        setSelectedCategory({
          value: apiResponse.categoryId._id,
          label: apiResponse.categoryId.name,
        });
      })
      .catch((error) => {
        dispatch(hideLoader());
        toast.error("Error occured while fetching data");
      });
  }, [params.id]);

  // categories select options
  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.name,
  }));

  useEffect(() => {
    loadCategories();
    loadProduct();
  }, [loadCategories, loadProduct]);

  // handle form submit
  const handleSubmit = (event) => {
    dispatch(showLoader());
    event.preventDefault();
    const formData = {
      title: state.title,
      slug: convertToSlug(state.title),
      isActive: state.isActive == "1" ? true : false,
      categoryId: selectedCategory == null ? "" : selectedCategory.value,
      userId: selectedUser == null ? currentUserId : selectedUser.value,
      discountPercentage: state.discountPercentage,
      price: state.price,
      availableQuantity: state.availableQuantity,
      discountAmount: state.discountAmount,
      priceAfterDiscount: state.priceAfterDiscount,
      addedBy: currentRole,
      description: state.description,
    };

    if (validator.allValid()) {
      update(params.id, formData)
        .then((data) => {
          dispatch(hideLoader());
          toast.success(data.data.message);
          navigate("/product/my");
        })
        .catch((error) => {
          dispatch(hideLoader());
          setError(errorResponse(error));
        });
    } else {
      dispatch(hideLoader());
      validator.showMessages();
      forceUpdate(1);
    }
  };

  const convertToSlug = (Text) => {
    return Text.toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  };

  return state && state != null ? (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Error errors={error} />
            <Card className="card-stats">
              <Card.Header>Update Product</Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Title</label>
                        <Form.Control
                          placeholder="Title"
                          name="title"
                          onChange={handleChange}
                          type="text"
                          value={state.title}
                        ></Form.Control>
                      </Form.Group>
                      {validator.message(
                        "product title",
                        state.title,
                        "required"
                      )}
                    </Col>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Category</label>
                        <Select
                          options={categoryOptions}
                          value={selectedCategory}
                          onChange={handleCategorySelectOption}
                        />
                        {validator.message(
                          "product category",
                          selectedCategory,
                          "required"
                        )}
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Avaialble Quantity</label>
                        <Form.Control
                          placeholder="Avaialble Quantity"
                          name="availableQuantity"
                          onChange={handleChange}
                          value={state.availableQuantity}
                          type="number"
                          step={1}
                          min="1"
                          max="2000"
                        ></Form.Control>
                      </Form.Group>
                      {validator.message(
                        "available quantity",
                        state.availableQuantity,
                        "required"
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Price (in CAD)</label>
                        <Form.Control
                          placeholder="Price"
                          name="price"
                          onChange={handleChangePrice}
                          type="number"
                          value={state.price}
                          min={1}
                        ></Form.Control>
                      </Form.Group>
                      {validator.message(
                        "product price",
                        state.price,
                        "required"
                      )}
                    </Col>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Discount (in %)</label>
                        <Form.Control
                          placeholder="Discount"
                          name="discountPercentage"
                          onChange={handleChangeDiscount}
                          type="number"
                          value={state.discountPercentage}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Discount Amount</label>
                        <Form.Control
                          placeholder="Discount Amount"
                          name="discountAmount"
                          onChange={handleChange}
                          readOnly={true}
                          value={state.discountAmount}
                          type="number"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Price After Discount</label>
                        <Form.Control
                          placeholder="Price After Discount"
                          name="discountAmount"
                          onChange={handleChange}
                          readOnly={true}
                          value={state.priceAfterDiscount}
                          type="number"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    {currentRole == "admin" ? (
                      <Col className="pr-1" md="4">
                        <Form.Group>
                          <label>User</label>
                          <Select
                            options={userOptions}
                            value={selectedUser}
                            onChange={handleUserSelectOption}
                          />
                        </Form.Group>
                        {validator.message("user", selectedUser, "required")}
                      </Col>
                    ) : (
                      ""
                    )}

                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Is Active?</label>
                        <br></br>
                        <Form.Check
                          inline
                          type="radio"
                          label="Yes"
                          name="isActive"
                          id="yes"
                          value="1"
                          onChange={handleChange}
                          checked={state.isActive == true}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          label="No"
                          onChange={handleChange}
                          checked={state.isActive == false}
                          name="isActive"
                          value="0"
                          id="no"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Editor
                        value={state.description}
                        onTextChange={handleProductDescriptionChange}
                        style={{ height: "250px" }}
                      />
                      {validator.message(
                        "product description",
                        state.description,
                        "required"
                      )}
                    </Col>
                  </Row>
                  <Button
                    className="btn-fill pull-right float-right mb-3 mt-3"
                    type="submit"
                    variant="success"
                  >
                    Submit
                  </Button>
                  <div className="clearfix"></div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  ) : (
    ""
  );
};

export default Update;
