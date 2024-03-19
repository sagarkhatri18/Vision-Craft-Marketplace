import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";
import { isLoggedIn } from "../../../src/helpers/IsLoggedIn";
import { Logout } from "../../services/Services";
import routes from "routes.js";
import SearchBar from "../../views/pages/dashboard/SearchBar";
import avatar from "../../assets/img/default-avatar.png";
import CartIcon from "./CartIcon";

const Header = () => {
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  const mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    var node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function () {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  };

  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  return (
    <Navbar bg="light" expand="lg">
      {/* <Container fluid> */}
      <div className="d-flex justify-content-center align-items-center ml-2 ml-lg-0">
        <Button
          variant="dark"
          className="d-lg-none btn-fill d-flex justify-content-center align-items-center rounded-circle p-2"
          onClick={mobileSidebarToggle}
        >
          <i className="fas fa-ellipsis-v"></i>
        </Button>
      </div>
      <Navbar.Toggle aria-controls="basic-navbar-nav" className="mr-2">
        <span className="navbar-toggler-bar burger-lines"></span>
        <span className="navbar-toggler-bar burger-lines"></span>
        <span className="navbar-toggler-bar burger-lines"></span>
      </Navbar.Toggle>
      <Navbar.Collapse id="basic-navbar-nav">
        {/* <Nav className="mr-auto" navbar style={{ width: "80%" }}>
          <SearchBar />
        </Nav> */}
        <Nav className="ml-auto" navbar>
          <Nav.Item className="d-flex align-items-center">
            <NavLink to={"/cart-items"}>
              <CartIcon />
            </NavLink>
          </Nav.Item>
          {loggedIn ? (
            <>
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle
                  aria-expanded={false}
                  aria-haspopup={true}
                  as={Nav.Link}
                  data-toggle="dropdown"
                  id="navbarDropdownMenuLink"
                  variant="default"
                  className="m-0"
                >
                  <span className="no-icon">
                    <img
                      src={avatar}
                      style={{
                        height: "30px",
                        width: "30px",
                        borderRadius: "30px",
                      }}
                    />
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu aria-labelledby="navbarDropdownMenuLink" style={{ right: 0, left: "auto" }}>
                  <Dropdown.Item href="/change-password">
                    Change Password
                  </Dropdown.Item>
                  <Dropdown.Item href="/login" onClick={() => Logout()}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : (
            ""
          )}
          <Nav.Item>
            {!loggedIn ? (
              <>
                <Nav.Link className="m-0" href="/login">
                  <span className="no-icon">Register</span>
                </Nav.Link>
                <span>Or</span>
                <Nav.Link className="m-0" href="/login">
                  <span className="no-icon">Sign In</span>
                </Nav.Link>
              </>
            ) : (
              ""
            )}
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
      {/* </Container> */}
    </Navbar>
  );
};

export default Header;
