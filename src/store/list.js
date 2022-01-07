import flux from "@aust/react-flux";
import VersionList from "util/all";
import Releases from "util/releases";
import { orderBy, reverse, clone } from "lodash";

const semver = require("semver");

function initialSettings() {
  return {
    list: [],
    comments: [],
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
  let current = flux.params.selectState("current");
  let target = flux.params.selectState("target");
  let list = clone(store.selectState("list"));

  // If using no downtime installs minor versions are required
  let downtime = flux.params.selectState("downtime");
  if (downtime) {
    return store.selectState("betweenList", current, target);
  }

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
  console.log("WhatsNewRelative - version", version);
  let list = clone(store.selectState("list"));

  // Sorting
  list = list.filter((x) => semver.lt(x.version, version.version));
  list = reverse(orderBy(list, ["major", "minor"]));

  console.log("selector", list);
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
// -- Version Idx
// ========================================================================
store.addSelector("idx", async (state, version) => {
  return VersionList.index.find((x) => x.version === version);
});
// ========================================================================

// ========================================================================
// -- Store Updates
// ========================================================================
store.register("list/update", async (dispatch, payload) => {
  return (state) => ({ ...state, ...payload });
});
// ========================================================================
