import flux from "@aust/react-flux";
import Deprecations from "util/deprecations";

function initialSettings() {
  return {
    index: {},
  };
}

const store = flux.addStore("deprecations", initialSettings());

// ========================================================================
// -- Look for Upgrade Notes
// ========================================================================
store.addSelector("list", (state, current, target) => {
  // Get Relative Previous
  // let previous = flux.list.selectState("PreviousVersion", version);

  // Get between Versions
  let targetList = flux.list.selectState("betweenList", current, target);

  let index = [];
  // Collect Notes
  targetList.forEach((tv) => {
    let list = Deprecations[tv.major][tv.minor];

    // Add to List
    if (list !== undefined) {
      list.forEach((i) => {
        index.push(i);
      });
    }
  });

  return index;
});
