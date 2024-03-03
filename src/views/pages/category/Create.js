import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
// Validator Packages
import SimpleReactValidator from "simple-react-validator";
import { Error, errorResponse } from "../../../helpers/Error";
import { toast } from "react-toastify";
import { add } from "../../../services/Category";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../actions/Action";

const Create = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // set state
  const [state, setState] = useState({
    name: "",
    slug: "",
    isActive: "1",
  });
  const [error, setError] = useState("");

  // Validator Imports
  const validator = useRef(new SimpleReactValidator()).current;
  const [, forceUpdate] = useState();

  // handle input fields onchange value
  const handleChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const convertToSlug = (Text) => {
    return Text.toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  };

  // handle form submit
  const handleSubmit = (event) => {
    dispatch(showLoader());

    event.preventDefault();
    const formData = {
      name: state.name,
      slug: convertToSlug(state.name),
      isActive: state.isActive == "1" ? true : false,
    };

    if (validator.allValid()) {
      add(formData)
        .then((data) => {
          toast.success(data.data.message);
          navigate("/category");
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
            <Error errors={error} />
            <Card className="card-stats">
              <Card.Header>Add New Category</Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Name</label>
                        <Form.Control
                          placeholder="Name"
                          name="name"
                          onChange={handleChange}
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                      {validator.message(
                        "category name",
                        state.name,
                        "required"
                      )}
                    </Col>
                    <Col className="pr-1" md="6">
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
