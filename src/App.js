import React from "react";
import Nav from "util/nav";

// Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

// Add
library.add(fas, fab);

function App() {
  return <Nav />;
}

export default App;
