import flux from "@aust/react-flux";
import UpgradeNotes from "util/notes";

function initialSettings() {
  return {
    index: {},
  };
}

const store = flux.addStore("notes", initialSettings());

// ========================================================================
// -- Look for Upgrade Notes
// ========================================================================
store.addSelector("notes", (state, version) => {
  let notes = UpgradeNotes[version];
  return notes;
});
