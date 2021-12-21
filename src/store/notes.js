import flux from "@aust/react-flux";

function initialSettings() {
  return {
    index: {},
  };
}

const store = flux.addStore("notes", initialSettings());

// ========================================================================
// -- Look for Install Notes
// ========================================================================
store.addSelector("notes", (state, version) => {
  console.log("install notes", version);
  return null;
});

// ========================================================================
// -- Store Updates
// ========================================================================
store.register("notes/update", async (dispatch, payload) => {
  return (state) => ({ ...state, ...payload });
});
// ========================================================================
