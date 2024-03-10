import React, { useCallback, useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { NavLink, useParams } from "react-router-dom";
import { decodeToken } from "react-jwt";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../actions/Action";
import {
  getAllProductsFromUser,
  deleteProductFromId,
} from "../../../services/Product";
import { toast } from "react-toastify";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import alertify from "alertifyjs";

const MyProduct = () => {
  const dispatch = useDispatch();
  const params = useParams();

  const [products, setProducts] = useState([]);
  const getUserId = () => decodeToken(localStorage.getItem("token")).id;

  // load all the availabe products from certain user
  const loadUserProducts = useCallback(() => {
    dispatch(showLoader());
    getAllProductsFromUser(getUserId())
      .then((data) => {
        dispatch(hideLoader());
        setProducts(data.data.data);
      })
      .catch((error) => {
        dispatch(hideLoader());
        toast.error("Error occured while fetching data");
      });
  }, []);

  useEffect(() => {
    loadUserProducts();
  }, [loadUserProducts]);

  // delete the selected product
  const deleteProduct = (id) => {
    alertify.confirm(
      "Delete",
      "Are you sure want to delete the selected product?",
      function () {
        deleteProductFromId(id)
          .then((data) => {
            toast.success(data.data.message);
            loadUserProducts();
          })
          .catch((error) => {
            toast.error("Failed to delete the product");
          });
      },
      function () {}
    );
  };

  const datatableHeader = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Products</span>
      <Button icon="pi pi-refresh" rounded raised />
    </div>
  );

  const footer = `In total there are ${
    products ? products.length : 0
  } products.`;

  const getCategoryName = (product) => product.categoryId.name;

  const getProductStatus = (product) => {
    const severity = product.isActive ? "success" : "danger";
    const statusValue = product.isActive ? "ACTIVE" : "INACTIVE";
    return <Tag value={statusValue} severity={severity} />;
  };

  const formatDate = (product) => new Date(product.createdAt).toLocaleString();

  const actionBodyTemplate = (product) => {
    return (
      <>
        <div className="d-inline-flex">
          <NavLink to={`/product/update/${product._id}`}>
            <Button
              type="button"
              title="Edit"
              className="btn btn-sm btn-borderless"
              icon="pi pi-pencil"
              rounded
            ></Button>
          </NavLink>
          <Button
            onClick={() => deleteProduct(product._id)}
            type="button"
            title="Delete"
            icon="pi pi-trash"
            className="btn btn-sm btn-borderless"
            rounded
          ></Button>
          <NavLink to={`/product/${product._id}`}>
            <Button
              type="button"
              title="View Details"
              className="btn btn-sm btn-borderless"
              icon="pi pi-arrow-right"
              rounded
            ></Button>
          </NavLink>
          {/* <Button
            onClick={() => openModal(category._id)}
            type="button"
            icon="pi pi-image"
            className="btn btn-sm btn-borderless"
            rounded
          ></Button> */}
        </div>
      </>
    );
  };

  return (
    <Container fluid>
      <Row>
        <div className="col-12 text-end mb-2">
          <NavLink to="/product/create">
            <button
              type="button"
              className="btn btn-sm btn-primary float-right"
            >
              Add New
            </button>
          </NavLink>
        </div>
        <div className="col-12">
          <DataTable
            size="small"
            value={products}
            header={datatableHeader}
            footer={footer}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column field="title" sortable header="Title"></Column>
            <Column body={getCategoryName} sortable header="Category"></Column>
            <Column
              field="availableQuantity"
              sortable
              header="Available Quantity"
            ></Column>
            <Column field="price" sortable header="Price(in CAD)"></Column>
            <Column
              field="discountPercentage"
              sortable
              header="Discount(%)"
            ></Column>
            <Column field="addedBy" sortable header="Added By"></Column>
            <Column body={getProductStatus} header="Status"></Column>
            <Column body={formatDate} header="Created At"></Column>
            <Column
              headerStyle={{ width: "5rem", textAlign: "center" }}
              bodyStyle={{ textAlign: "center", overflow: "visible" }}
              body={actionBodyTemplate}
            />
          </DataTable>
        </div>
      </Row>
    </Container>
  );
};

export default MyProduct;
