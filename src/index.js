import React from "react";
import ReactDOM from "react-dom";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./index.css";

import App from "./App";

import "store/sys";
import "store/list";
import "store/params";
import "store/notes";
import "util/latest"; // Placeholder for Latest Version
import "util/versions"; // List of all

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
