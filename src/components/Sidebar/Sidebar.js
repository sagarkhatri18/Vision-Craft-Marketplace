import React, { Component } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";
import logo from "assets/img/logo.png";
import { loggedInRole } from "../../helpers/IsLoggedIn";

function Sidebar({ color, image, routes }) {
  const location = useLocation();

  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  return (
    <div className="sidebar" data-image={image} data-color={color}>
      <div className="sidebar-background" />
      <div className="sidebar-wrapper">
        <div className="logo d-flex align-items-center justify-content-start">
          <a href="#" className="simple-text logo-mini mx-1">
            <div className="logo-img">
              <img src={logo} alt="..." />
            </div>
          </a>
          <a className="simple-text" href="#">
            Vision Craft Marketplace
          </a>
        </div>
        <Nav>
          {routes.map((prop, key) => {
            const checkRole = prop.access.includes(
              loggedInRole().toLowerCase()
            );

            if (!prop.redirect && prop.sidebar && checkRole)
              return (
                <li
                  className={
                    prop.upgrade ? "active active-pro" : activeRoute(prop.path)
                  }
                  key={key}
                >
                  <NavLink
                    to={prop.path}
                    // className="nav-link"

                    className={(navData) =>
                      navData.isActive ? "nav-link active-style" : "nav-link"
                    }

                    // activeClassName="active"
                  >
                    <i className={prop.icon} />
                    <p>{prop.name}</p>
                  </NavLink>
                </li>
              );
            return null;
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
