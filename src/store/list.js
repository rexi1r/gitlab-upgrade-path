import flux from "@aust/react-flux";
import VersionList from "util/all";
import Releases from "util/releases";
import alerts from "util/alerts";
import { orderBy, reverse, clone } from "lodash";

const semver = require("semver");

window.semver = require("semver");
window.VersionList = VersionList;

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

  // Ignore Versions eitherfuture or don't have a corresponding patch versions
  if (latest === undefined) return;

  let list = store.selectState("list");
  list.push(latest);

  // Only Append Comments if exists
  let comments = store.selectState("comments");
  if (version.comments) comments.push(version);

  await dispatch("list/update", { list: list, comments: comments });
});

// ========================================================================
// -- Viable Targets
// ========================================================================
store.addSelector("targets", () => {
  let current = store.useState("current");
  let list = clone(VersionList.targets);

  if (list) {
    list = reverse(orderBy(list, ["major", "minor"]));
  }

  if (!current) {
    return list;
  }

  return list.filter((x) => semver.gt(x.version, current.version));
});


// ========================================================================
// -- Patch Version Check
// ========================================================================
store.addSelector("patchVersion", () => {
  let current = flux.params.selectState("current");
  let path = flux.list.selectState("upgradePath");
  let firstVersion = path[0];
  return (current.major === firstVersion.major && current.minor === firstVersion.minor);
})

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
store.addSelector("betweenList", (_state, current, target) => {
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
// -- Get Previous Version / Step
// ========================================================================
// Validators:
//  Never go below the starting version
//  Assume Upgrade Steps
store.addSelector("PreviousVersion", (_state, version) => {
  let current = flux.params.selectState("current");

  // Get Upgrade Steps lower thant input version
  let list = clone(store.selectState("list"));
  list = list.filter((x) => semver.lt(x.version, version.version));
  list = reverse(orderBy(list, ["major", "minor"]));

  // Collect previous jump step to increment
  let previousStep = list[0];

  // Don't increment if previous step is lower than the starting version
  if (semver.lt(previousStep.version, current.version)) {
    previousStep = current;
  }

  // This bad
  return previousStep;
});

// ========================================================================
// -- Relative Pathing
// ========================================================================
store.addSelector("WhatsNewRelative", (_state, version) => {
  let list = clone(VersionList.index);

  // Bump up a minor version for filtering
  let increment = semver.inc(version.version, "minor");

  // Sorting
  list = list.filter((x) => semver.gte(x.version, increment));
  list = orderBy(list, ["major", "minor"]);

  // If list is empty return latest
  if (list.length === 0) {
    return VersionList.index[0];
  }

  // Collect previous jump step to increment
  let previousStep = list[0];

  // Return Next Up version
  return previousStep;
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
// -- Collect Alerts
// ========================================================================
store.addSelector("upgradeAlerts", (state, version) => {
  let list = alerts.filter((x) => semver.gte(version.version, x.start));
  list = list.filter((x) => semver.lte(version.version, x.end));

  return list;
});

store.addSelector("upgradeSummaryAlerts", (state, current, target) => {
  let list = alerts.filter((x) => semver.gte(x.end, current.version));
  list = list.filter((x) => semver.lte(x.start, target.version));

  return list;
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
