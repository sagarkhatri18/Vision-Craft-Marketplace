import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeflex/primeflex.css"; 
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css"; 

import { Provider } from "react-redux";
import { store } from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <Provider store={store()}>
      <App />
    </Provider>
  // </React.StrictMode>
);
