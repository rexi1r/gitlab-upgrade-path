import flux from "@aust/react-flux";

import VersionList from "util/all";

function initialSettings() {
  return {
    current: null,
    target: VersionList.targets[0],
    distro: "ubuntu",
    auto: false,
    edition: "ee",
    downtime: false,
  };
}

const store = flux.addStore("params", initialSettings());

// Entry point
store.register("params/init", async (dispatch) => {
  await flux.dispatch("params/readQuery");

  // Current is the only required param
  let current = store.selectState("current");
  if (current) {
    flux.dispatch("sys/nav", "path");
  } else {
    flux.dispatch("sys/nav", "start");
  }
});

// ========================================================================
// -- Update Helpers -- Simplify the start
// ========================================================================
store.register("params/current", async (dispatch, payload) => {
  await dispatch("params/update", { current: payload });
  dispatch("params/setQuery");
});

store.register("params/target", async (dispatch, payload) => {
  await dispatch("params/update", { target: payload });
  dispatch("params/setQuery");
});

store.register("params/distro", async (dispatch, event) => {
  await dispatch("params/update", { distro: event.target.value });
  dispatch("params/setQuery");
});

store.register("params/edition", async (dispatch, event) => {
  await dispatch("params/update", { edition: event.target.value });
  dispatch("params/setQuery");
});

store.register("params/auto", async (dispatch, payload) => {
  await dispatch("params/update", { auto: payload });
  dispatch("params/setQuery");
});

store.register("params/downtime", async (dispatch, payload) => {
  await dispatch("params/update", { downtime: payload });
  dispatch("params/setQuery");
});
// ========================================================================

// ========================================================================
// -- Store Updates
// ========================================================================
store.register("params/update", async (dispatch, payload) => {
  return (state) => ({ ...state, ...payload });
});
// ========================================================================

// ========================================================================
// -- Query Update
// ========================================================================
store.register("params/setQuery", async () => {
  let params = store.selectState();

  // Construct URLSearchParams object instance from current URL querystring.
  var queryParams = new URLSearchParams();

  if (params.current) queryParams.set("current", params.current.version);
  if (params.target && VersionList.targets[0] !== params.target)
    queryParams.set("target", params.target.version);

  // Ignore Defaults
  if (params.distro !== "ubuntu") queryParams.set("distro", params.distro);
  if (params.auto) queryParams.set("auto", params.auto);
  if (params.edition !== "ee") queryParams.set("edition", params.edition);
  if (params.downtime) queryParams.set("downtime", params.downtime);

  // Set new or modify existing parameter value.

  // Replace current querystring with the new one.
  window.history.replaceState(null, null, "?" + queryParams.toString());
});
// ========================================================================

// ========================================================================
// -- Query Read
// ========================================================================
store.register("params/readQuery", async (dispatch) => {
  let params = store.selectState();

  // Construct URLSearchParams object instance from current URL querystring.
  var queryParams = new URLSearchParams(window.location.search);

  let target = null;
  if (queryParams.get("target")) {
    target = await flux.list.selectState("idx", queryParams.get("target"));
  }

  let current = null;
  if (queryParams.get("current")) {
    current = await flux.list.selectState("idx", queryParams.get("current"));
  }

  let distro = queryParams.get("distro");
  let auto = queryParams.get("auto");
  let edition = queryParams.get("edition");
  let downtime = queryParams.get("downtime");

  if (auto) params.auto = JSON.parse(auto);
  if (downtime) params.downtime = JSON.parse(downtime);
  if (distro) params.distro = distro;
  if (edition) params.edition = edition;
  if (current) params.current = current;
  if (target) params.target = target;

  await flux.dispatch("params/update", params);
});
// ========================================================================

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
