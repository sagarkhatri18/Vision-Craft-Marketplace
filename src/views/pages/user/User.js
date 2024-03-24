import React, { useCallback, useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import {
  getUsers,
  deleteUserFromId,
  getUserById,
} from "../../../services/User";
import { toast } from "react-toastify";
import alertify from "alertifyjs";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../actions/Action";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import UserDetails from "./UserDetails";

const User = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  const loadUsers = useCallback(() => {
    dispatch(showLoader());
    getUsers()
      .then((data) => {
        dispatch(hideLoader());
        const resultArray = [];
        const apiResponse = data.data;
        apiResponse.forEach((item) => {
          if (item.role != "admin") {
            resultArray.push(item);
          }
        });
        setUsers(resultArray);
      })
      .catch((error) => {
        dispatch(hideLoader());
        toast.error("Error occured while fetching data");
      });
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // delete the selected user
  const deleteUser = (id) => {
    alertify.confirm(
      "Delete",
      "Are you sure want to delete the selected user?",
      function () {
        deleteUserFromId(id)
          .then((data) => {
            toast.success(data.data.message);
            loadUsers();
          })
          .catch((error) => {
            toast.error("Failed to delete the user");
          });
      },
      function () {}
    );
  };

  const datatableHeader = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Users</span>
      <Button icon="pi pi-refresh" rounded raised />
    </div>
  );

  const footer = `In total there are ${users ? users.length : 0} users.`;

  const formatDate = (user) => new Date(user.createdAt).toLocaleString();

  const getUserStatus = (user) => {
    const severity = user.verified ? "success" : "danger";
    const statusValue = user.verified ? "VERIFIED" : "PENDING";
    return <Tag value={statusValue} severity={severity} />;
  };

  // open modal for loading user detail
  const openModal = (id) => {
    getUserById(id)
      .then((data) => {
        setUser(data.data.data);
        setModalShow(true);
      })
      .catch((error) => {
        toast.error("Failed to load the user detail");
      });
  };

  // close modal for uploaded files list
  const closeModal = () => setModalShow(false);

  const closeBtn = (
    <button className="close" onClick={closeModal}>
      &times;
    </button>
  );

  const actionBodyTemplate = (user) => {
    return (
      <>
        <div className="d-inline-flex">
          <NavLink to={`/user/update/${user._id}`}>
            <Button
              type="button"
              title="Edit"
              className="btn btn-sm btn-borderless"
              icon="pi pi-pencil"
              rounded
            ></Button>
          </NavLink>
          <Button
            onClick={() => deleteUser(user._id)}
            type="button"
            title="Delete"
            icon="pi pi-trash"
            className="btn btn-sm btn-borderless"
            rounded
          ></Button>
          <Button
            onClick={() => openModal(user._id)}
            type="button"
            title="View Details"
            icon="pi pi-external-link"
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
            <NavLink to="/user/create">
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
              value={users}
              header={datatableHeader}
              footer={footer}
              paginator
              rows={10}
              rowsPerPageOptions={[10, 25, 50]}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column field="firstName" sortable header="First Name"></Column>
              <Column field="lastName" sortable header="Last Name"></Column>
              <Column field="email" sortable header="Email"></Column>
              <Column body={getUserStatus} header="Status"></Column>
              <Column field="role" sortable header="Role"></Column>
              <Column body={formatDate} header="Created At"></Column>
              <Column
                headerStyle={{ width: "5rem", textAlign: "center" }}
                bodyStyle={{ textAlign: "center", overflow: "visible" }}
                body={actionBodyTemplate}
              />
            </DataTable>
          </div>
        </Row>
        <Modal isOpen={modalShow} toggle={closeModal} size="lg">
          <ModalHeader toggle={closeModal} close={closeBtn}>
            User Detail
          </ModalHeader>
          <ModalBody>
            <UserDetails data={user} />{" "}
          </ModalBody>
        </Modal>
      </Container>
    </>
  );
};

export default User;
