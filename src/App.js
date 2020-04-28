import React from "react";
import { Root } from "./components/root";
import { CssBaseline } from "@material-ui/core";
import { StateProvider } from "./store";

const App = () => {
  return (
    <>
      <CssBaseline />
      <StateProvider>
        <Root />
      </StateProvider>
    </>
  );
};

export default App;
