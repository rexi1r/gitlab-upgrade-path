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
store.addSelector("list", (state, version) => {
  // Get Relative Previous
  let previous = flux.list.selectState("WhatsNewRelative", version);

  // Get between Versions
  let targetList = flux.list.selectState("betweenList", previous, version);

  // Collect Notes
  let allNotes = targetList.map((x) => {
    let display = `${x.major}_${x.minor}`;

    if (UpgradeNotes[display]) {
      return { name: x.version, notes: UpgradeNotes[display] };
    } else {
      return null;
    }
  });

  // Ignore Empty
  return allNotes.filter((x) => x && x.notes.length);
});
