import React from "react";
import { createRoot } from "react-dom/client";

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
import "store/deprecations";
import "util/latest"; // Placeholder for Latest Version
import "util/versions"; // List of all

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
