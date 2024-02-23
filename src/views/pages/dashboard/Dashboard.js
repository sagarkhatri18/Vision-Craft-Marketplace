import React from "react";
import { Container, Row } from "react-bootstrap";
import { AdminDashboard } from "./AdminDashboard";
import { CustomerDashboard } from "./CustomerDashboard";
import { loggedInRole } from "../../../helpers/IsLoggedIn";

const Dashboard = () => {
  return (
    <>
      <Container fluid>
        <Row>
          {loggedInRole() == "admin" ? (
            <AdminDashboard />
          ) : (
            <CustomerDashboard />
          )}
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
