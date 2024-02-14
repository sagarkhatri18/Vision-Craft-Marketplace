import React, { useState, useEffect, useRef } from "react";
import { Nav } from "react-bootstrap";
import { register } from "../../src/services/Services";
import { errorResponse } from "../helpers/responseHolder";

// Validator Packages
import SimpleReactValidator from "simple-react-validator";

// For Toastr
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import backgroundImage from "../assets/img/login-banner.avif";

const Register = () => {
  // Validator Imports
  let validator = useRef(
    new SimpleReactValidator({
      validators: {
        password: {
          required: true,
          message:
            "Password must be at least 8 characters, contain at least one letter and at least one digit.",
          rule: (val, params, validator) => {
            return validator.helpers.testRegex(
              val,
              /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
            );
          },
        },
      },
    })
  ).current;
  const [, forceUpdate] = useState();

  const [state, setState] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // handle the form submission part
  const handleSubmit = (event) => {
    event.preventDefault();

    if (validator.allValid()) {
      const formData = {
        firstname: state.firstname,
        lastname: state.lastname,
        email: state.email,
        password: state.password,
        contact: null,
        address: null,
        role: "customer",
        verified: false,
      };
      register(formData)
        .then((res) => {
          const response = res.data;
          toast.success(response.message);
        })
        .catch((error) => {
          errorResponse(error);
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
                          Register
                        </h5>
                      </div>
                    </div>
                    <div className="card-body">
                      <form
                        role="form"
                        className="login-form text-start"
                        onSubmit={handleSubmit}
                      >
                        <div className="input-group input-group-outline my-3">
                          <label className="form-label"></label>
                          <input
                            type="firstname"
                            name="firstname"
                            value={state.firstname}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter your first name"
                          />
                          {validator.message(
                            "firstname",
                            state.firstname,
                            "required|alpha"
                          )}
                        </div>
                        <div className="input-group input-group-outline my-3">
                          <label className="form-label"></label>
                          <input
                            type="lastname"
                            name="lastname"
                            value={state.lastname}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter your last name"
                          />
                          {validator.message(
                            "lastname",
                            state.lastname,
                            "required|alpha"
                          )}
                        </div>
                        <div className="input-group input-group-outline my-3">
                          <label className="form-label"></label>
                          <input
                            type="text"
                            name="email"
                            value={state.email}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter your email"
                          />
                          {validator.message(
                            "email",
                            state.email,
                            "required|email"
                          )}
                        </div>
                        <div className="input-group input-group-outline mb-3">
                          <label className="form-label"></label>
                          <input
                            type="password"
                            name="password"
                            value={state.password}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Password"
                          />
                          {validator.message(
                            "password",
                            state.password,
                            "required|password"
                          )}
                        </div>
                        <div className="input-group input-group-outline mb-3">
                          <label className="form-label"></label>
                          <input
                            type="password"
                            name="password_confirmation"
                            value={state.password_confirmation}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Re-enter Password"
                          />
                          {validator.message(
                            "password_confirmation",
                            state.password_confirmation,
                            `required|in:${state.password}`,
                            { messages: { in: "Passwords need to match!" } }
                          )}
                        </div>

                        <div className="text-center">
                          <button
                            type="submit"
                            className="btn bg-gradient-primary w-100 my-4 mb-2"
                          >
                            Sign Up <span className="fa fa-key"></span>
                          </button>
                        </div>
                        <p className="mt-4 text-sm text-center">
                          Already have an account ? &nbsp;
                          <a
                            href="/login"
                            className="text-primary text-gradient font-weight-bold"
                          >
                            Login
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

export default Register;
