import flux from "@aust/react-flux";

function initialSettings() {
  return {
    status: "loading",
  };
}

const store = flux.addStore("sys", initialSettings());

// Navigation Updates
store.register("sys/nav", async (dispatch, location) => {
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

store.register("sys/reset", () => initialSettings);
