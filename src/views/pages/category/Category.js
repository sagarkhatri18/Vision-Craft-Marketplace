import React, { useCallback, useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { getCatgories, deleteCategoryFromId } from "../../../services/Category";
import { toast } from "react-toastify";
import alertify from "alertifyjs";
import { NavLink } from "react-router-dom";

const Category = () => {
  const [categories, setCategories] = useState([]);

  const loadCategories = useCallback(() => {
    getCatgories()
      .then((data) => {
        const apiResponse = data.data;
        setCategories(apiResponse);
      })
      .catch((error) => {
        toast.error("Error occured while fetching data");
      });
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // delete the selected category
  const deleteCategory = (id) => {
    alertify.confirm(
      "Delete",
      "Are you sure want to delete the selected category?",
      function () {
        deleteCategoryFromId(id)
          .then((data) => {
            toast.success(data.data.message);
            loadCategories();
          })
          .catch((error) => {
            toast.error("Failed to delete the category");
          });
      },
      function () {}
    );
  };

  const datatableHeader = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Categories</span>
      <Button icon="pi pi-refresh" rounded raised />
    </div>
  );

  const footer = `In total there are ${
    categories ? categories.length : 0
  } categories.`;

  const formatDate = (category) =>
    new Date(category.created_at).toLocaleString();

  const getCategoryStatus = (category) => {
    const severity = category.is_active ? "success" : "danger";
    const statusValue = category.is_active ? "ACTIVE" : "INACTIVE";
    return <Tag value={statusValue} severity={severity} />;
  };

  const actionBodyTemplate = (category) => {
    return (
      <>
        <div className="d-inline-flex">
          <NavLink to={`/category/update/${category._id}`}>
            <Button
              type="button"
              className="btn btn-sm btn-borderless"
              icon="pi pi-pencil"
              rounded
            ></Button>
          </NavLink>
          <Button
            onClick={() => deleteCategory(category._id)}
            type="button"
            icon="pi pi-trash"
            className="btn btn-sm btn-borderless"
            rounded
          ></Button>
        </div>
      </>
    );
  };

  return (
    <>
      <Container fluid>
        <Row>
          <div className="col-12 text-end mb-2">
            <NavLink to="/category/create">
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
              value={categories}
              header={datatableHeader}
              footer={footer}
              paginator
              rows={10}
              rowsPerPageOptions={[10, 25, 50]}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column field="name" sortable header="Name"></Column>
              <Column field="slug" sortable header="Slug"></Column>
              <Column body={getCategoryStatus} header="Status"></Column>
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
    </>
  );
};

export default Category;
