import flux from "@aust/react-flux";
import VersionList from "util/all";
import { orderBy, reverse } from "lodash";
const semver = require("semver");

function initialSettings() {
  return {
    list: [],
    current: null,
    target: null,
    distro: null,
    notes: [],
  };
}

const store = flux.addStore("list", initialSettings());

// Handle Sys Status Updates
store.register("version/add", async (dispatch, version) => {
  // Collect latest patch version for each minor
  let latest = VersionList.find((x) => {
    return x.major === version.major && x.minor === version.minor;
  });

  let list = store.selectState("list");
  list.push(latest);

  let notes = store.selectState("notes");
  notes.push(version);
  await dispatch("list/update", { list: list, notes: notes });
});

// ========================================================================
// -- Viable Targets
// ========================================================================
store.addSelector("targets", () => {
  let current = store.useState("current");
  let list = store.selectState("list");

  if (list) {
    list = reverse(orderBy(list, ["major", "minor"]));
  }

  if (!current) {
    return list;
  }

  return list.filter((x) => semver.gt(x.version, current.version));
});

// ========================================================================
// -- Calculate Path
// ========================================================================
store.addSelector("upgradePath", () => {
  let current = store.selectState("current");
  let list = store.selectState("list");

  return list.filter((x) => semver.gt(x.version, current.version));
});

// ========================================================================
// -- Collect Notes
// ========================================================================
store.addSelector("upgradeNotes", (state, version) => {
  console.log("upgradeNotes", version);
  let notes = store.selectState("notes");

  return notes.find((x) => {
    return x.major === version.major && x.minor === version.minor;
  });
});

// ========================================================================
// -- Store Updates
// ========================================================================
store.register("list/update", async (dispatch, payload) => {
  return (state) => ({ ...state, ...payload });
});
// ========================================================================
