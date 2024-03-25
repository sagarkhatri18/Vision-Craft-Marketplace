import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
// Validator Packages
import SimpleReactValidator from "simple-react-validator";
import { Error, errorResponse } from "../../../helpers/Error";
import { toast } from "react-toastify";
import { add } from "../../../services/Review";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../actions/Action";

const Review = () => {
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
              <Card.Header>Add Review</Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Comment</label>
                        <Form.Control
                          placeholder="comment"
                          name="comment"
                          onChange={handleChange}
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                      {validator.message(
                        " name",
                        state.name,
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
  );
};

export default Review;
