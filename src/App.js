import React, { useEffect } from "react";
import flux from "@aust/react-flux";
import Nav from "util/nav";

// Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

// Add
library.add(fas, fab, far);

function App() {
  useEffect(() => {
    flux.dispatch("params/init");
  }, []);

  return <Nav />;
}

export default App;
