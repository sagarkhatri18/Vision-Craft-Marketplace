import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // theme
import "primeflex/primeflex.css"; // css utility
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css"; // core css

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <React.Suspense fallback={<div>Loading...</div>}> */}
      <App />
    {/* </React.Suspense> */}
  </React.StrictMode>
);
