import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { getUserById } from "services/User";
import {
  getProvinces,
  getCitiesFromProvinceName,
} from "../../../services/Services";
import { update } from "../../../services/User";
import { decodeToken } from "react-jwt";
import { toast } from "react-toastify";
import SimpleReactValidator from "simple-react-validator";
import { showLoader, hideLoader } from "../../../actions/Action";
import { Error, errorResponse } from "../../../helpers/Error";
import { updateTokenInLocalStorage } from "../../../helpers/helper";

const MyProfile = () => {
  const dispatch = useDispatch();
  const getUserId = decodeToken(localStorage.getItem("token")).id;
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState("");
  const [state, setState] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    province: "",
    country: "Canada",
    city: "",
    streetName: "",
    suiteNumber: "",
    postalCode: "",
    contactNumber: "",
    verified: "",
    role: "",
  });

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

  const fetchUserDetail = useCallback(async () => {
    dispatch(showLoader());
    await getUserById(getUserId)
      .then((res) => {
        dispatch(hideLoader());
        setState(res.data.data);
      })
      .catch((error) => {
        dispatch(hideLoader());
        setError(errorResponse(error));
      });
  }, []);

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

  // handle input fields onchange value
  const handleChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(showLoader());

    if (validator.allValid()) {
      const formData = state;
      await update(formData, state._id)
        .then((res) => {
          dispatch(hideLoader());
          toast.success(res.data.message);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          fetchUserDetail();
          fetchProvinces();
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

  useEffect(() => {
    fetchUserDetail();
    fetchProvinces();
  }, [fetchUserDetail, fetchProvinces]);

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
            <Card className="card-stats">
              <Card.Header>My Profile</Card.Header>
              <Card.Body>
                <Error errors={error} />
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>First Name</label>
                        <Form.Control
                          placeholder="First Name"
                          name="firstName"
                          type="text"
                          disabled={true}
                          value={state.firstName}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Last Name</label>
                        <Form.Control
                          placeholder="First Name"
                          name="firstName"
                          disabled={true}
                          value={state.lastName}
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Email</label>
                        <Form.Control
                          placeholder="Email"
                          name="email"
                          disabled={true}
                          value={state.email}
                          type="text"
                        ></Form.Control>
                      </Form.Group>
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
                  </Row>
                  <Button
                    className="btn-fill pull-right float-right mb-3 mt-3"
                    type="submit"
                    variant="success"
                  >
                    Update Profile
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default MyProfile;
