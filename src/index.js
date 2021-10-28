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
import "util/latest"; // Placeholder for versions
import "util/versions"; // Placeholder for versions

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
