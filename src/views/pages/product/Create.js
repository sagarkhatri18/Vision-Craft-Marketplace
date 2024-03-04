import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import { showLoader, hideLoader } from "../../../actions/Action";
import { getCatgories } from "../../../services/Category";
import { getUsers } from "../../../services/User";
import { useDispatch } from "react-redux";
import { Error, errorResponse } from "../../../helpers/Error";
import SimpleReactValidator from "simple-react-validator";
import { toast } from "react-toastify";
import Select from "react-select";
import { add } from "../../../services/Product";
import { loggedInRole } from "../../../helpers/IsLoggedIn";
import { useNavigate } from "react-router";

const Create = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentRole = loggedInRole().toLowerCase();

  // Validator Imports
  const validator = useRef(new SimpleReactValidator()).current;
  const [, forceUpdate] = useState();

  // set state
  const [state, setState] = useState({
    title: "",
    slug: "",
    isActive: "1",
    price: "",
    availableQuantity: "",
    discountPercentage: "0",
    discountAmount: "0",
    priceAfterDiscount: "",
    addedBy: currentRole,
  });
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  // handle input fields onchange value
  const handleChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
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

  // handle form submit
  const handleSubmit = (event) => {
    dispatch(showLoader());
    event.preventDefault();
    const formData = {
      title: state.title,
      slug: convertToSlug(state.title),
      isActive: state.isActive == "1" ? true : false,
      categoryId: selectedCategory == null ? "" : selectedCategory.value,
      userId: selectedUser == null ? "" : selectedUser.value,
      discountPercentage: state.discountPercentage,
      price: state.price,
      availableQuantity: state.availableQuantity,
      discountAmount: state.discountAmount,
      priceAfterDiscount: state.priceAfterDiscount,
      addedBy: currentRole,
    };

    if (validator.allValid()) {
      add(formData)
        .then((data) => {
          dispatch(hideLoader());
          toast.success(data.data.message);
          navigate("/products");
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

  // load all the users
  const loadUsers = useCallback(() => {
    dispatch(showLoader());
    getUsers()
      .then((data) => {
        dispatch(hideLoader());
        const resultArray = [];
        const apiResponse = data.data;
        apiResponse.forEach((item) => {
          if (item.role != "admin") {
            resultArray.push(item);
          }
        });
        setUsers(resultArray);
      })
      .catch((error) => {
        dispatch(hideLoader());
        toast.error("Error occured while fetching data");
      });
  }, []);

  useEffect(() => {
    loadCategories();
    loadUsers();
  }, [loadCategories, loadUsers]);

  // categories select options
  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.name,
  }));

  // users select options
  const userOptions = users.map((user) => ({
    value: user._id,
    label: user.firstName,
  }));

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Error errors={error} />
            <Card className="card-stats">
              <Card.Header>Add New Product</Card.Header>
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
                          checked={state.isActive === "1"}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          label="No"
                          onChange={handleChange}
                          checked={state.isActive === "0"}
                          name="isActive"
                          value="0"
                          id="no"
                        />
                      </Form.Group>
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
  );
};

export default Create;
