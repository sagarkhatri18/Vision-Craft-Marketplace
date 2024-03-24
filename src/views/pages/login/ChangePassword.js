import React, { useState, useRef } from "react";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import { changePassword } from "services/Services";
import { showLoader, hideLoader } from "../../../actions/Action";
import SimpleReactValidator from "simple-react-validator";
import { useDispatch } from "react-redux";
import bcrypt from "bcryptjs-react";
import { decodeToken } from "react-jwt";
import { toast } from "react-toastify";
import { Error, errorResponse } from "../../../helpers/Error";
import { useNavigate } from "react-router";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const getUserId = decodeToken(localStorage.getItem("token")).id;
  const [error, setError] = useState("");

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
  const [, forceUpdate] = useState();

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(showLoader());

    if (validator.allValid()) {
      const formData = {
        userId: getUserId,
        currentPassword,
        // password: bcrypt.hashSync(password, "$2a$10$CwTycUXWue0Thq9StjUM0u"),
      };
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      formData.password = hashedPassword;

      await changePassword(formData)
        .then((res) => {
          dispatch(hideLoader());
          toast.success(res.data.message);

          localStorage.clear();
          navigate("/login");
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

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="card-stats">
              <Card.Header>Change Password</Card.Header>
              <Card.Body>
                <Error errors={error} />
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Current Password</label>
                        <Form.Control
                          placeholder="Current Password"
                          name="current_password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        ></Form.Control>
                        {validator.message(
                          "current password",
                          currentPassword,
                          "required|password"
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Password</label>
                        <Form.Control
                          placeholder="Password"
                          name="password"
                          value={password}
                          type="password"
                          onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                        {validator.message(
                          "password",
                          password,
                          "required|password"
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Confirm Password</label>
                        <Form.Control
                          placeholder="Confirm Password"
                          name="password_confirm"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        ></Form.Control>
                        {validator.message(
                          "confirm password",
                          confirmPassword,
                          `required|in:${password}`,
                          { messages: { in: "Passwords need to match!" } }
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    className="btn-fill pull-right float-right mb-3 mt-3"
                    type="submit"
                    variant="success"
                  >
                    Change Password
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

export default ChangePassword;
