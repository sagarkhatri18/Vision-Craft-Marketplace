import React, { useState, useCallback, useEffect } from "react";
import { Card, Container, Row, Col, Form } from "react-bootstrap";
import { DropZoneContainer } from "../../../helpers/DropZoneContainer";
import { useDropzone } from "react-dropzone";
import alertify from "alertifyjs";
import { showLoader, hideLoader } from "../../../actions/Action";
import { Error, errorResponse } from "../../../helpers/Error";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loggedInRole } from "../../../helpers/IsLoggedIn";
import { useParams } from "react-router";
import { Button } from "primereact/button";
import {
  uploadImage,
  productImages,
  deleteImageFromId,
  updateMainImage,
} from "../../../services/ProductImage";
import { NavLink } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const ProductImage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const currentRole = loggedInRole().toLowerCase();
  const [error, setError] = useState("");
  const [images, setImages] = useState(null);

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
      formData.append("productId", params.id);
      formData.append("addedBy", currentRole);
    });

    uploadImage(formData)
      .then((data) => {
        dispatch(hideLoader());
        loadProductImages();
        toast.success(data.data.message);
      })
      .catch((error) => {
        dispatch(hideLoader());
        setError(errorResponse(error));
      });
  };

  // load all the images of the products from API
  const loadProductImages = useCallback(() => {
    dispatch(showLoader());
    productImages(params.id)
      .then((data) => {
        dispatch(hideLoader());
        setImages(data.data);
      })
      .catch((error) => {
        dispatch(hideLoader());
        toast.error("Error occured while fetching data");
      });
  }, []);

  useEffect(() => {
    loadProductImages();
  }, [loadProductImages]);

  const thumbnailImage = (image) => {
    return (
      <img
        src={`${process.env.REACT_APP_API_BASE_URL}/${image.filePath}/thumbnails/${image.image}`}
        alt={image.image}
        style={{ width: "50px", height: "50px" }}
      />
    );
  };

  // delete the selected category
  const deleteProductImage = (id) => {
    alertify.confirm(
      "Delete",
      "Are you sure want to delete the selected image?",
      function () {
        deleteImageFromId(id)
          .then((data) => {
            toast.success(data.data.message);
            loadProductImages();
          })
          .catch((error) => {
            toast.error("Failed to delete the selected image");
          });
      },
      function () {}
    );
  };

  // update main image
  const changeMainImage = useCallback((id) => {
    dispatch(showLoader());

    updateMainImage(id, { productId: params.id })
      .then((data) => {
        toast.success(data.data.message);
        loadProductImages();
        dispatch(hideLoader());
      })
      .catch((error) => {
        dispatch(hideLoader());
        toast.error("Failed to update the selected image");
      });
  }, []);

  const actionBodyTemplate = (image) => {
    return (
      <>
        <div className="d-inline-flex">
          <Button
            onClick={() => deleteProductImage(image._id)}
            type="button"
            icon="pi pi-trash"
            className="btn btn-sm btn-borderless"
            rounded
          ></Button>
          <Button
            onClick={() => changeMainImage(image._id)}
            type="button"
            icon={image.isMain ? "pi pi-heart-fill" : "pi pi-heart"}
            className="btn btn-sm btn-borderless"
            rounded
          ></Button>
        </div>
      </>
    );
  };

  return (
    <Container fluid>
      <Error errors={error} />
      <Row>
        <Col md="12">
          <Card className="card-stats">
            <Card.Header>Image Gallery</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col className="pr-1" md="12">
                    <DropZoneContainer {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p>
                        Drag 'n' drop some files here, or click to select files
                      </p>
                      <em>(Only image file will be accepted)</em>
                    </DropZoneContainer>
                    <aside className="mt-3">
                      <h5>Selected File:</h5>
                      <ul>{files}</ul>
                    </aside>
                  </Col>
                </Row>
                <Row>
                  {/* <Col className="pr-1" md="12">
                    <img
                      src={image}
                      style={{ width: "80%", height: "80%" }}
                      alt="Category Image"
                    />
                  </Col> */}
                </Row>
                <Button
                  className="btn-fill pull-right float-right mb-3 mt-3"
                  type="submit"
                  variant="success"
                >
                  Upload
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <DataTable
            size="small"
            value={images}
            // header={datatableHeader}
            // footer={footer}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column body={thumbnailImage} header="Image"></Column>
            <Column field="image" sortable header="Image"></Column>
            <Column field="mimeType" sortable header="Mime Type"></Column>
            <Column field="fileSize" sortable header="File Size"></Column>
            <Column field="addedBy" sortable header="Added By"></Column>
            <Column
              headerStyle={{ width: "5rem", textAlign: "center" }}
              bodyStyle={{ textAlign: "center", overflow: "visible" }}
              body={actionBodyTemplate}
            />
          </DataTable>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductImage;
