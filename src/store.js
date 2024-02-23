// import { legacy_createStore as createStore, compose, applyMiddleware } from "redux";
// import { thunk } from "redux-thunk";
// import RootReducer from "./reducers/RootReducer";

// const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// export const configureStore = () => {
//   return createStore(RootReducer, composeEnhancer(applyMiddleware(thunk)));
// };

import { configureStore } from "@reduxjs/toolkit";
import RootReducer from "./reducers/RootReducer";

export const store = () => configureStore({ reducer: RootReducer });
