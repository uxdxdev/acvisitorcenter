import React, { useMemo } from "react";
import { Root } from "./components/root";
import { StateProvider } from "./store";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { useMediaQuery, CssBaseline } from "@material-ui/core";

const App = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createMuiTheme({
        typography: {
          fontFamily: ["Nunito", "-apple-system"].join(","),
        },
        palette: {
          type: prefersDarkMode ? "dark" : "light",
          primary: { main: "#00B0FF" },
          secondary: { main: "#F50057" },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StateProvider>
        <Root />
      </StateProvider>
    </ThemeProvider>
  );
};

export default App;
