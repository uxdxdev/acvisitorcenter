import React, { createContext, useReducer } from "react";
import { rootReducer, initialState } from "../reducers";

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  if (process.env.NODE_ENV === "development") {
    console.log("STATE:", state);
  }
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
