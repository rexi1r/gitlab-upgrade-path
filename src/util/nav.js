import React from "react";
import flux from "@aust/react-flux";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Routes
import Start from "view/start";
import Path from "view/path";

// Theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Nav = () => {
  const status = flux.sys.useState("status");

  return (
    <div style={style.view}>
      <ThemeProvider theme={darkTheme}>
        {status === "start" && <Start />}
        {status === "path" && <Path />}
      </ThemeProvider>
    </div>
  );
};

export default Nav;

const style = {
  view: {
    display: "flex",
    flex: 1,
    height: "100vh",
    width: "100vw",
    flexDirection: "column",
    overflow: "hidden",
  },
};
