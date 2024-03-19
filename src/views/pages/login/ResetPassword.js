import React, { useState, useEffect, useRef } from "react";
import { Nav } from "react-bootstrap";
import { passwordReset } from "../../../../src/services/Services";
import { useNavigate } from "react-router-dom";
import "../../../assets/css/login/material-dashboard.min.css";
import backgroundImage from "../../../assets/img/login-banner.avif";
// For Toastr
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Validator Packages
import SimpleReactValidator from "simple-react-validator";
import Loader from "../../../helpers/Loading";
import { useDispatch } from "react-redux";
import { LoginFormError, errorResponse } from "../../../helpers/Error";
import { showLoader, hideLoader } from "../../../actions/Action";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const baseURL = window.location.origin;

  // Validator Imports
  const validator = useRef(new SimpleReactValidator()).current;
  const [, forceUpdate] = useState();

  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(showLoader());

    if (validator.allValid()) {
      passwordReset({ email, baseURL })
        .then((res) => {
          const response = res.data;
          setSuccess(response.message);
          setError("");
          dispatch(hideLoader());
        })
        .catch((error) => {
          dispatch(hideLoader());
          setError(errorResponse(error));
        });
    } else {
      dispatch(hideLoader());
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
                            href="/dashboard"
                            className="m-0"
                          >
                            {process.env.REACT_APP_NAME}
                          </Nav.Link>
                        </h4>
                        <h5 className="text-white font-weight-bolder text-center mt-2 mb-0">
                          Password Reset
                        </h5>
                      </div>
                    </div>
                    <div className="card-body">
                      <LoginFormError errors={error} />
                      {success ? (
                        <div
                          className="alert alert-default fade show form-error"
                          role="alert"
                        >
                          {success}
                        </div>
                      ) : (
                        ""
                      )}

                      <form
                        role="form"
                        className="login-form text-start"
                        onSubmit={handleSubmit}
                      >
                        <div className="input-group input-group-outline my-3">
                          <label className="form-label"></label>
                          <input
                            type="email"
                            name="email"
                            value={email}
                            className="form-control"
                            onChange={handleChange}
                            placeholder="Enter your Email"
                          />
                          {validator.message("email", email, "required")}
                        </div>
                        <div className="text-center">
                          <button
                            type="submit"
                            className="btn bg-gradient-primary w-100 my-4 mb-2"
                          >
                            Reset <span className="fa fa-key"></span>
                          </button>
                        </div>
                        <p className="mt-4 text-sm text-center">
                          Back To &nbsp;
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
        <Loader />
        <ToastContainer />
      </div>
    </>
  );
};

export default ResetPassword;
