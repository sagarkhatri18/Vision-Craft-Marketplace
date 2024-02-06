import React, { useState, useEffect, useRef } from "react";
import { Nav } from "react-bootstrap";
import { login } from "../../src/services/Services";
import { useNavigate } from "react-router-dom";
import "../assets/css/login/material-dashboard.min.css";
import backgroundImage from "../assets/img/login-banner.avif";

// For Toastr
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Validator Packages
import SimpleReactValidator from "simple-react-validator";

const Login = () => {
  const navigate = useNavigate();

  // Validator Imports
  const validator = useRef(new SimpleReactValidator()).current;
  const [, forceUpdate] = useState();

  const [state, setState] = useState({
    email: "admin@admin.com",
    password: "Password@123",
  });

  const handleChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validator.allValid()) {
      const email = state.email;
      const password = state.password;

      login(email, password)
        .then((res) => {
          const response = res.data;

          if (response.success) {
            const token = response.token;
            localStorage.setItem("token", token);
            navigate("/user/dashboard");
          } else {
            toast.error("Invalid email or Password");
          }
        })
        .catch((error) => {
          if (error.response.data.message != undefined)
            toast.error(error.response.data.message);
          else toast.error("Login failed");
        });
    } else {
      validator.showMessages();
      forceUpdate(1);
    }
  };

  return (
    <>
      <div className="bg-gray-200">
        <main className="main-content  mt-0">
          <div
            className="page-header align-items-start min-vh-100"
            style={{
              backgroundImage: "url(" + backgroundImage + ")",
            }}
          >
            <span className="mask bg-gradient-dark opacity-6"></span>
            <div className="container my-auto">
              <div className="row">
                <div className="col-lg-4 col-md-8 col-12 mx-auto">
                  <div className="card z-index-0 fadeIn3 fadeInBottom">
                    <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                      <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 pe-1">
                        <h4 className="text-white font-weight-bolder text-center">
                          <Nav.Link
                            data-toggle="dropdown"
                            href="user/dashboard"
                            className="m-0"
                          >
                            Vision Craft Marketplace
                          </Nav.Link>
                        </h4>
                        <h5 className="text-white font-weight-bolder text-center mt-2 mb-0">
                          Sign in
                        </h5>
                      </div>
                    </div>
                    <div className="card-body">
                      <form
                        role="form"
                        onSubmit={handleSubmit}
                        className="login-form text-start"
                      >
                        <div className="input-group input-group-outline my-3">
                          <label className="form-label"></label>
                          <input
                            type="email"
                            name="email"
                            value={state.email}
                            className="form-control"
                            onChange={handleChange}
                            placeholder="Email"
                          />
                          {validator.message("email", state.email, "required")}
                        </div>
                        <div className="input-group input-group-outline mb-3">
                          <label className="form-label"></label>
                          <input
                            type="password"
                            name="password"
                            value={state.password}
                            className="form-control"
                            onChange={handleChange}
                            placeholder="Password"
                          />
                          {validator.message(
                            "password",
                            state.password,
                            "required"
                          )}
                        </div>

                        <div className="text-center">
                          <button
                            type="submit"
                            className="btn bg-gradient-primary w-100 my-4 mb-2"
                          >
                            Sign in <span className="fa fa-key"></span>
                          </button>
                        </div>
                        <p className="mt-4 text-sm text-center">
                          Don't have an account?&nbsp;
                          <a
                            href="/register"
                            className="text-primary text-gradient font-weight-bold"
                          >
                            Sign up
                          </a>
                        </p>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <ToastContainer />
      </div>
    </>
  );
};

export default Login;
