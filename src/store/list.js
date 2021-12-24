import flux from "@aust/react-flux";
import VersionList from "util/all";
import Releases from "util/releases";
import { orderBy, reverse, clone } from "lodash";

const semver = require("semver");

function initialSettings() {
  return {
    list: [],
    current: null,
    target: null,
    distro: null,
    comments: [],
    auto: false,
    edition: "ee",
  };
}

const store = flux.addStore("list", initialSettings());

// Handle Sys Status Updates
store.register("version/add", async (dispatch, version) => {
  // Collect latest patch version for each minor
  let latest = VersionList.index.find((x) => {
    return x.major === version.major && x.minor === version.minor;
  });

  let list = store.selectState("list");
  list.push(latest);

  let comments = store.selectState("comments");
  comments.push(version);
  await dispatch("list/update", { list: list, comments: comments });
});

// ========================================================================
// -- Viable Targets
// ========================================================================
store.addSelector("targets", () => {
  let current = store.useState("current");
  let list = VersionList.targets;

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
  let target = store.selectState("target");
  let list = clone(store.selectState("list"));

  // Sorting
  list = reverse(orderBy(list, ["major", "minor"]));

  let candidates = list.filter((x) => {
    return (
      semver.gt(x.version, current.version) &&
      semver.lt(x.version, target.version)
    );
  });

  // Sorting
  candidates = orderBy(candidates, ["major", "minor"]);

  // Add Final Target
  candidates.push(target);

  return candidates;
});

// Between Version Check / All Minor Versions
store.addSelector("betweenList", (state, current, target) => {
  let list = VersionList.targets;

  // Sorting
  list = reverse(orderBy(list, ["major", "minor"]));

  let candidates = list.filter((x) => {
    return (
      semver.gt(x.version, current.version) &&
      semver.lt(x.version, target.version)
    );
  });

  // Sorting
  candidates = orderBy(candidates, ["major", "minor"]);

  // Add Final Target
  candidates.push(target);

  return candidates;
});

// ========================================================================
// -- Get Previous Version
// ========================================================================
store.addSelector("WhatsNewRelative", (state, version) => {
  let list = clone(store.selectState("list"));

  // Sorting
  list = list.filter((x) => semver.lt(x.version, version.version));
  list = reverse(orderBy(list, ["major", "minor"]));

  return list[0];
});

// ========================================================================
// -- Release Blog
// ========================================================================
store.addSelector("ReleaseBlog", (state, version) => {
  return Releases[`${version.major}.${version.minor}`];
});

// ========================================================================
// -- Collect Comments
// ========================================================================
store.addSelector("upgradeComments", (state, version) => {
  let comments = store.selectState("comments");

  return comments.find((x) => {
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
