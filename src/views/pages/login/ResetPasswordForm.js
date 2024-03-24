import React, { useState, useEffect, useRef, useCallback } from "react";
import { Nav } from "react-bootstrap";
import {
  changePassword,
  findUserFromToken,
} from "../../../../src/services/Services";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import bcrypt from "bcryptjs-react";
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

const ResetPasswordForm = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const params = useParams();

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(showLoader());

    if (validator.allValid()) {
      const formData = {
        userId: user._id,
        // password: bcrypt.hashSync(password, "$2a$10$CwTycUXWue0Thq9StjUM0u"),
        token: params.token,
      };
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      formData.password = hashedPassword;

      changePassword(formData)
        .then((res) => {
          dispatch(hideLoader());
          const response = res.data;
          setSuccess(response.message);
          setError("");
          setPassword("");
          setPasswordConfirm("");
        })
        .catch((error) => {
          dispatch(hideLoader());
          errorResponse(error);
        });
    } else {
      dispatch(hideLoader());
      validator.showMessages();
      forceUpdate(1);
    }
  };

  // get user detail from token and userId
  const userDetail = useCallback(() => {
    dispatch(showLoader());
    findUserFromToken(params.userId, params.token)
      .then((data) => {
        dispatch(hideLoader());
        const response = data.data.data;
        setUser(response);
      })
      .catch((error) => {
        dispatch(hideLoader());
        setError(errorResponse(error));
      });
  }, [findUserFromToken]);

  useEffect(() => {
    userDetail();
  }, [userDetail]);

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
                          Set New Password
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
                      {success === "" ? (
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
                              className="form-control"
                              readOnly={true}
                              value={user.email}
                            />
                          </div>
                          <div className="input-group input-group-outline my-3">
                            <label className="form-label"></label>
                            <input
                              type="password"
                              name="password"
                              className="form-control"
                              placeholder="Password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                            {validator.message(
                              "password",
                              password,
                              "required|password"
                            )}
                          </div>
                          <div className="input-group input-group-outline my-3">
                            <label className="form-label"></label>
                            <input
                              type="password"
                              name="confirm-password"
                              className="form-control"
                              placeholder="Confirm Password"
                              value={passwordConfirm}
                              onChange={(e) =>
                                setPasswordConfirm(e.target.value)
                              }
                            />
                            {validator.message(
                              "confirm password",
                              passwordConfirm,
                              `required|in:${password}`,
                              { messages: { in: "Passwords need to match!" } }
                            )}
                          </div>
                          <div className="text-center">
                            <button
                              type="submit"
                              className="btn bg-gradient-primary w-100 my-4 mb-2"
                            >
                              Change Password{" "}
                              <span className="fa fa-key"></span>
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
                      ) : (
                        <div className="text-center">
                          <NavLink
                            to={"/login"}
                            type="submit"
                            className="btn bg-gradient-primary w-100 my-4 mb-2"
                          >
                            Back To Login &nbsp;
                            <span className="fa fa-key"></span>
                          </NavLink>
                        </div>
                      )}
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

export default ResetPasswordForm;
