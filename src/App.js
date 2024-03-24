import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/custom.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

//override defaults of alertifyjs
alertify.defaults.transition = "slide";
alertify.defaults.theme.ok = "btn btn-sm btn-primary";
alertify.defaults.theme.cancel = "btn btn-sm btn-danger";
alertify.defaults.theme.input = "form-control";

// Pages
const DefaultLayout = React.lazy(() => import("./layouts/DefaultLayout"));
const ResetPassword = React.lazy(() =>
  import("./views/pages/login/ResetPassword")
);
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Register = React.lazy(() => import("./views/pages/register/Register"));
const ResetPasswordForm = React.lazy(() =>
  import("./views/pages/login/ResetPasswordForm")
);

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={loading}>
        <Routes>
          <Route exact path="/password-reset" element={<ResetPassword />} />
          <Route
            exact
            path="/password/reset/:userId/:token"
            element={<ResetPasswordForm />}
          />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="*" element={<DefaultLayout />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default App;
