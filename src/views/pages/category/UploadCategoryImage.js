import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { DropZoneContainer } from "../../../helpers/DropZoneContainer";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import { showLoader, hideLoader } from "../../../actions/Action";
import { uploadImage, findCategory } from "../../../services/Category";
import { Error, errorResponse } from "../../../helpers/Error";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const UploadCategoryImage = ({ categoryId, closeModal }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [category, setCategory] = useState([]);
  const [image, setImage] = useState("");

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: { "image/*": [] },
  });
  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  // handle form submit
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(showLoader());

    let formData = new FormData();
    const fileObjects = acceptedFiles.map((file) => {
      formData.append("image", file, file.name);
      formData.append("categoryId", categoryId);
    });

    uploadImage(formData)
      .then((data) => {
        dispatch(hideLoader());
        closeModal();
        toast.success(data.data.message);
      })
      .catch((error) => {
        dispatch(hideLoader());
        setError(errorResponse(error));
      });
  };

  // find category from id
  const findCategoryFromId = useCallback(() => {
    findCategory(categoryId)
      .then((data) => {
        const returnData = data.data.data;
        setCategory(returnData);
        if (returnData.image !== null)
          setImage(
            `${process.env.REACT_APP_API_BASE_URL}${returnData.filePath}${returnData.image}`
          );
      })
      .catch((error) => {
        toast.error("Error occured while fetching data");
      });
  }, [categoryId]);

  useEffect(() => {
    findCategoryFromId();
  }, [findCategoryFromId]);

  return (
    <>
      <Container fluid>
        <Error errors={error} />
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col className="pr-1" md="12">
              <DropZoneContainer {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
                <em>(Only image file will be accepted)</em>
              </DropZoneContainer>
              <aside className="mt-1">
                <h5>Selected File:</h5>
                <ul>{files}</ul>
              </aside>
            </Col>
          </Row>
          <Row>
            <Col className="pr-1" md="12">
              <img src={image} style={{ width: "80%", height: "80%" }} alt="Category Image"/>
            </Col>
          </Row>
          <Button
            className="btn-fill pull-right float-right mb-3 mt-3"
            type="submit"
            variant="success"
          >
            Upload
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default UploadCategoryImage;
