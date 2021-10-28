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
  window.history.replaceState(null, null, "/" + location);
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
    console.log("1");
    flux.dispatch("sys/nav", "start");
  } else {
    console.log("2");
    flux.dispatch("sys/nav", window.location.pathname.substring(1));
  }
});

store.register("sys/reset", () => initialSettings);
