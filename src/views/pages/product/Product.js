import React, { useCallback, useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../actions/Action";
import { toast } from "react-toastify";
import { getAllProducts } from "../../../services/Product";

const Product = () => {
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);

  // load all the availabe products from API
  const loadProducts = useCallback(() => {
    dispatch(showLoader());
    getAllProducts()
      .then((data) => {
        dispatch(hideLoader());
        setProducts(data.data);
      })
      .catch((error) => {
        dispatch(hideLoader());
        toast.error("Error occured while fetching data");
      });
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const datatableHeader = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Products</span>
      <Button icon="pi pi-refresh" rounded raised />
    </div>
  );

  const footer = `In total there are ${
    products ? products.length : 0
  } products.`;

  const getProductStatus = (product) => {
    const severity = product.isActive ? "success" : "danger";
    const statusValue = product.isActive ? "ACTIVE" : "INACTIVE";
    return <Tag value={statusValue} severity={severity} />;
  };

  const getCategoryName = (product) => product.categoryId.name;

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
            <Column body={getCategoryName} sortable header="User Name"></Column>
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
            {/* <Column body={formatDate} header="Created At"></Column>
            <Column
              headerStyle={{ width: "5rem", textAlign: "center" }}
              bodyStyle={{ textAlign: "center", overflow: "visible" }}
              body={actionBodyTemplate}
            /> */}
          </DataTable>
        </div>
      </Row>
    </Container>
  );
};

export default Product;
