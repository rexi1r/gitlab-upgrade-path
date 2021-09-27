import flux from "@aust/react-flux";

function initialSettings() {
  return {
    status: "start",
  };
}

const store = flux.addStore("sys", initialSettings());

// Entry point
store.register("sys/init", async (dispatch) => {
  console.log("init");
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
