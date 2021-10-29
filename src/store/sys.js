import flux from "@aust/react-flux";

function initialSettings() {
  return {
    status: "loading",
  };
}

const store = flux.addStore("sys", initialSettings());

// Entry point
store.register("sys/init", async (dispatch) => {
  console.log("init");
});

// Navigation Updates
store.register("sys/nav", async (dispatch, location) => {
  console.log("location nav", location);
  let status = store.selectState("status");
  console.log("status", status);
  // window.history.pushState(null, null, "/upgrade-path/" + status);
  // window.history.pushState(null, null, "#" + location);
  // window.history.replaceState(undefined, undefined, "#" + location);
  window.location.hash = "#" + location;
  await dispatch("sys/update", { status: location });
});

// Handle Sys Status Updates
store.register("sys/status", async (dispatch, status) => {
  await dispatch("sys/update", { status: status });
});

// ========================================================================
// -- Store Updates
// ========================================================================

store.register("sys/update", async (dispatch, payload) => {
  return (state) => ({ ...state, ...payload });
});
// ========================================================================

window.addEventListener("popstate", function () {
  if (window.location.pathname === "/") {
    // flux.dispatch("sys/nav", "start");
  } else {
    let path = window.location.hash.substring(1);
    flux.dispatch("sys/nav", path);
  }
});

store.register("sys/reset", () => initialSettings);
