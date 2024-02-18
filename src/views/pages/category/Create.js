import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
// Validator Packages
import SimpleReactValidator from "simple-react-validator";
import { Error } from "../../../helpers/Error";
import { toast } from "react-toastify";
import { add } from "../../../services/Category";

const Create = () => {
  const navigate = useNavigate();

  // set state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");

  // Validator Imports
  const validator = useRef(new SimpleReactValidator()).current;
  const [, forceUpdate] = useState();

  // handle on change name
  const handleNameChange = (e) => {
    setName(e.target.value);
    const slug = convertToSlug(e.target.value);
    setSlug(slug);
  };

  // handle on change is active
  const handleIsActiveChange = (e) => {
    const value = e.target.value == "1" ? true : false;
    setIsActive(value);
  };

  const convertToSlug = (Text) => {
    return Text.toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  };

  // handle form submit
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      name: name,
      slug: slug,
      is_active: isActive,
    };
    if (validator.allValid()) {
      add(formData)
        .then((data) => {
          toast.success(data.data.message);
          navigate("/category");
        })
        .catch((error) => {
          setError(error.response.data);
          toast.error("Error occured while sending data");
        });
    } else {
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
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Name</label>
                        <Form.Control
                          placeholder="Name"
                          name="name"
                          onChange={handleNameChange}
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                      {validator.message("category name", name, "required")}
                    </Col>
                    <Col className="px-1" md="6">
                      <Form.Group>
                        <label>Slug</label>
                        <Form.Control
                          placeholder="Slug"
                          value={slug}
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
                          onChange={handleIsActiveChange}
                          defaultChecked={true}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          label="No"
                          onChange={handleIsActiveChange}
                          name="is_active"
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
