import flux from "@aust/react-flux";
import VersionList from "util/all";
import { orderBy, reverse, padStart } from "lodash";

const semver = require("semver");

function initialSettings() {
  return {
    list: [],
    current: null,
    target: null,
    distro: null,
    notes: [],
    auto: false,
    edition: "ee",
  };
}

const store = flux.addStore("list", initialSettings());

// Handle Sys Status Updates
store.register("version/add", async (dispatch, version) => {
  // Collect latest patch version for each minor
  let latest = VersionList.find((x) => {
    return x.major === version.major && x.minor === version.minor;
  });

  // Add Display Helpers / WhatsNew
  latest.display = `${latest.major}.${latest.minor}`;
  let major = `${padStart(latest.major, 2, 0)}`;
  let minor = `${padStart(latest.minor, 2, 0)}`;
  latest.whatsnew = `${major}_${minor}`;

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

  // Sorting
  list = reverse(orderBy(list, ["major", "minor"]));

  return list.filter((x) => semver.gt(x.version, current.version));
});

// ========================================================================
// -- Collect Notes
// ========================================================================
store.addSelector("upgradeNotes", (state, version) => {
  let notes = store.selectState("notes");

  return notes.find((x) => {
    return x.major === version.major && x.minor === version.minor;
  });
});

// ========================================================================
// -- Auto Install
// ========================================================================
store.addSelector("shouldAuto", () => {
  let auto = store.selectState("auto");

  if (auto) {
    return "-y";
  } else {
    return "";
  }
});

// ========================================================================
// -- Store Updates
// ========================================================================
store.register("list/update", async (dispatch, payload) => {
  return (state) => ({ ...state, ...payload });
});
// ========================================================================
