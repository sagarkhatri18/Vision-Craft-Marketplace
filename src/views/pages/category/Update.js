import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
// Validator Packages
import SimpleReactValidator from "simple-react-validator";
import { Error } from "../../../helpers/Error";
import { toast } from "react-toastify";
import { updateCategory, findCategory } from "../../../services/Category";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../actions/Action";

const Update = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  // set state
  const [state, setState] = useState({
    name: "",
    slug: "",
    is_active: "",
  });
  const [error, setError] = useState("");

  // Validator Imports
  const validator = useRef(new SimpleReactValidator()).current;
  const [, forceUpdate] = useState();

  // handle input fields onchange value
  const handleChange = (e) => {
    if (e.target.name == "name") {
      setState((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
        slug: convertToSlug(e.target.value),
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  // handle input fields onchange value
  const handleChangeRadio = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value == "1" ? true : false,
    }));
  };

  const convertToSlug = (Text) => {
    return Text.toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  };

  // handle form submit
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(showLoader());
    const formData = {
      name: state.name,
      slug: state.slug,
      is_active: state.is_active,
    };

    if (validator.allValid()) {
      updateCategory(params.id, formData)
        .then((data) => {
          toast.success(data.data.message);
          navigate("/category");
        })
        .catch((error) => {
          dispatch(hideLoader());
          setError(error.response.data);
          toast.error("Error occured while sending data");
        });
    } else {
      dispatch(hideLoader());
      validator.showMessages();
      forceUpdate(1);
    }
  };

  // find category from id
  const findCategoryFromId = useCallback(() => {
    dispatch(showLoader());
    findCategory(params.id)
      .then((data) => {
        dispatch(hideLoader());
        const returnData = data.data.data;
        setState(returnData);
      })
      .catch((error) => {
        dispatch(hideLoader());
        toast.error("Error occured while fetching data");
      });
  }, [params.id]);

  useEffect(() => {
    findCategoryFromId();
  }, [findCategoryFromId]);

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Error errors={error} />
            <Card className="card-stats">
              <Card.Header>Update Category</Card.Header>

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
                          value={state.name}
                        ></Form.Control>
                      </Form.Group>
                      {validator.message(
                        "category name",
                        state.name,
                        "required"
                      )}
                    </Col>
                    <Col className="px-1" md="6">
                      <Form.Group>
                        <label>Slug</label>
                        <Form.Control
                          placeholder="Slug"
                          value={state.slug}
                          name="slug"
                          disabled
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Is Active?</label>
                        <br></br>
                        <Form.Check
                          inline
                          type="radio"
                          label="Yes"
                          name="is_active"
                          id="yes"
                          value="1"
                          checked={state.is_active}
                          onChange={handleChangeRadio}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          label="No"
                          checked={!state.is_active}
                          onChange={handleChangeRadio}
                          name="is_active"
                          id="no"
                          value="0"
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
