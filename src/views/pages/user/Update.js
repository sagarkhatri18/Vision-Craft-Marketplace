import React, { useCallback, useEffect, useRef, useState } from "react";
import { update, getUserById } from "../../../services/User";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import { Error, errorResponse } from "../../../helpers/Error";
import SimpleReactValidator from "simple-react-validator";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { showLoader, hideLoader } from "../../../actions/Action";

const Update = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [, forceUpdate] = useState();

  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    address: "",
    verified: "",
    role: "",
  });
  const [error, setError] = useState("");

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

  const handleChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (event) => {
    dispatch(showLoader());
    event.preventDefault();
    const formData = {
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
      contact: state.contact,
      address: state.address,
      verified: Boolean(state.verified),
      role: state.role,
    };

    if (validator.allValid()) {
      update(params.id, formData)
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

  // Validator Imports
  let validator = useRef(
    new SimpleReactValidator({
      validators: {
        password: {
          required: true,
          message:
            "Password must be at least 8 characters, contain at least one letter and at least one digit.",
          rule: (val, params, validator) => {
            return validator.helpers.testRegex(
              val,
              /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
            );
          },
        },
      },
    })
  ).current;

  useEffect(() => {
    findUserById();
  }, [findUserById]);

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
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>First Name</label>
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
                    <Col className="px-1" md="6">
                      <Form.Group>
                        <label>Last Name</label>
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
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Email</label>
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
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Contact</label>
                        <Form.Control
                          placeholder="Contact"
                          name="contact"
                          onChange={handleChange}
                          type="number"
                          value={state.contact}
                        ></Form.Control>
                      </Form.Group>
                      {validator.message("contact", state.contact, "required")}
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Address</label>
                        <Form.Control
                          placeholder="Address"
                          name="address"
                          onChange={handleChange}
                          type="text"
                          value={state.address}
                        ></Form.Control>
                      </Form.Group>
                      {validator.message("address", state.address, "required")}
                    </Col>
                    <Col className="pr-1" md="6">
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
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
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
