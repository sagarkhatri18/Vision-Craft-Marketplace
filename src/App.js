import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "./assets/css/custom.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Pages
const AdminLayout = React.lazy(() => import("./layouts/AdminLayout"));
const Login = React.lazy(() => import("./layouts/Login"));
const Register = React.lazy(() => import("./layouts/Register"));

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="*" element={<AdminLayout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
