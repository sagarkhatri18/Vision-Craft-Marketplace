import { configureStore } from "@reduxjs/toolkit";
import RootReducer from "./reducers/RootReducer";

export const store = () => configureStore({ reducer: RootReducer });
