import React, { useCallback, useEffect, useRef, useState } from "react";
import { update, getUserById } from "../../../services/User";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import { Error, errorResponse } from "../../../helpers/Error";
import SimpleReactValidator from "simple-react-validator";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  getProvinces,
  getCitiesFromProvinceName,
} from "../../../services/Services";
import { showLoader, hideLoader } from "../../../actions/Action";
import { userDetails } from "helpers/helper";

const Update = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [state, setState] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    province: "",
    city: "",
    streetName: "",
    suiteNumber: "",
    country: "Canada",
    postalCode: "",
    contactNumber: "",
    verified: "",
    role: "",
  });
  const [error, setError] = useState("");

  // Validator Imports
  let validator = useRef(
    new SimpleReactValidator({
      validators: {
        postalCode: {
          required: true,
          message: "Postal code is not in valid format.",
          rule: (val, params, validator) => {
            return validator.helpers.testRegex(
              val,
              /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/
            );
          },
        },
        contactNumber: {
          required: true,
          message: "Contact number must exactly be in 10 digits.",
          rule: (val, params, validator) => {
            return validator.helpers.testRegex(val, /^\d{10}$/);
          },
        },
      },
    })
  ).current;
  const [, forceUpdate] = useState();

  const findUserById = useCallback(() => {
    dispatch(showLoader());

    getUserById(params.id)
      .then((response) => {
        dispatch(hideLoader());
        setState(response.data.data);
      })
      .catch((error) => {
        dispatch(hideLoader());
        setError(errorResponse(error));
      });
  }, [params.id]);

  const fetchProvinces = useCallback(async () => {
    dispatch(showLoader());
    await getProvinces()
      .then((res) => {
        dispatch(hideLoader());
        setProvinces(res.data.data);
      })
      .catch((error) => {
        dispatch(hideLoader());
        setError(errorResponse(error));
      });
  }, []);

  // fetch cities on the basis of province id
  const fetchProvinceCities = useCallback(async (provinceName) => {
    dispatch(showLoader());
    await getCitiesFromProvinceName(provinceName)
      .then((res) => {
        dispatch(hideLoader());
        setCities(res.data.data);
      })
      .catch((error) => {
        dispatch(hideLoader());
        setError(errorResponse(error));
      });
  }, []);

  const handleProvinceChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      province: e.target.value,
    }));
    // Fetch cities data based on the selected province
    setCities([]);
    setState((prevState) => ({
      ...prevState,
      city: "",
    }));
    if (e.target.value != "") fetchProvinceCities(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: name === "verified" ? value === "true" : value, // Convert 'true'/'false' strings to boolean
    }));
  };

  const handleSubmit = (event) => {
    dispatch(showLoader());
    event.preventDefault();
    const formData = {
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
      province: state.province,
      city: state.city,
      streetName: state.streetName,
      suiteNumber: state.suiteNumber,
      postalCode: state.postalCode,
      contactNumber: state.contactNumber,
      verified: Boolean(state.verified),
      role: state.role,
    };

    if (validator.allValid()) {
      update(formData, params.id)
        .then((data) => {
          toast.success(data.data.message);
          navigate("/users");
        })
        .catch((error) => {
          setError(errorResponse(error));
          dispatch(hideLoader());
        });
    } else {
      dispatch(hideLoader());
      validator.showMessages();
      forceUpdate(1);
    }
  };

  useEffect(() => {
    findUserById();
    fetchProvinces();
  }, [findUserById, fetchProvinces]);

  // Fetch cities for the selected province when provinces are fetched
  useEffect(() => {
    if (state.province) {
      fetchProvinceCities(state.province);
    }
  }, [state.province, fetchProvinceCities]);

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Error errors={error} />
            <Card className="card-stats">
              <Card.Header>Update User</Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>First Name *</label>
                        <Form.Control
                          placeholder="First Name"
                          name="firstName"
                          onChange={handleChange}
                          type="text"
                          value={state.firstName}
                        ></Form.Control>
                      </Form.Group>
                      {validator.message(
                        "first name",
                        state.firstName,
                        "required|alpha"
                      )}
                    </Col>
                    <Col className="px-1" md="4">
                      <Form.Group>
                        <label>Last Name *</label>
                        <Form.Control
                          placeholder="Last Name"
                          name="lastName"
                          onChange={handleChange}
                          type="text"
                          value={state.lastName}
                        ></Form.Control>
                      </Form.Group>
                      {validator.message(
                        "last name",
                        state.lastName,
                        "required|alpha"
                      )}
                    </Col>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Email *</label>
                        <Form.Control
                          placeholder="Email"
                          name="email"
                          onChange={handleChange}
                          type="email"
                          value={state.email}
                        ></Form.Control>
                      </Form.Group>
                      {validator.message(
                        "first name",
                        state.email,
                        "required|email"
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Country</label>
                        <Form.Control
                          name="country"
                          type="text"
                          disabled={true}
                          value={state.country}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Province *</label>
                        <select
                          className="form-control"
                          name="province"
                          value={state.province || ""}
                          onChange={handleProvinceChange}
                        >
                          <option value="">Select province</option>
                          {provinces.map((province, index) => (
                            <option key={index} value={province.provinceName}>
                              {province.provinceName}
                            </option>
                          ))}
                        </select>

                        {validator.message(
                          "province",
                          state.province,
                          "required"
                        )}
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>City *</label>
                        <select
                          className="form-control"
                          name="city"
                          value={state.city || ""}
                          onChange={handleChange}
                        >
                          <option value="">Select city</option>
                          {cities.map((item, index) => (
                            <option key={index} value={item.city}>
                              {item.city}
                            </option>
                          ))}
                        </select>

                        {validator.message("city", state.city, "required")}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Street Name *</label>
                        <Form.Control
                          name="streetName"
                          placeholder="Street Name"
                          type="text"
                          value={state.streetName}
                          onChange={handleChange}
                        ></Form.Control>
                        {validator.message(
                          "streetName",
                          state.streetName,
                          "required"
                        )}
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Suite Number</label>
                        <Form.Control
                          name="suiteNumber"
                          placeholder="Suite Number"
                          type="text"
                          value={state.suiteNumber}
                          onChange={handleChange}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Postal Code *</label>
                        <Form.Control
                          name="postalCode"
                          placeholder="Postal Code"
                          type="text"
                          disabled={!state.city}
                          value={state.postalCode}
                          onChange={handleChange}
                        ></Form.Control>
                        {validator.message(
                          "postal code",
                          state.postalCode,
                          "required|postalCode"
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Contact Number *</label>
                        <Form.Control
                          name="contactNumber"
                          placeholder="Contact Number"
                          type="number"
                          value={state.contactNumber}
                          onChange={handleChange}
                        ></Form.Control>
                        {validator.message(
                          "contact number",
                          state.contactNumber,
                          "required|contactNumber"
                        )}
                      </Form.Group>
                    </Col>

                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Role</label>
                        <Form.Control
                          placeholder="Role"
                          name="role"
                          value={state.role}
                          readOnly={true}
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Verified Status</label>
                        <br></br>
                        <Form.Check
                          inline
                          type="radio"
                          label="Verified"
                          name="verified"
                          id="yes"
                          value={true}
                          checked={state.verified}
                          onChange={handleChange}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          label="Not Verified"
                          checked={!state.verified}
                          onChange={handleChange}
                          name="verified"
                          value={false}
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

export default Update;
