import flux from "@aust/react-flux";
import VersionList from "util/all";

let latest = VersionList[0];
flux.dispatch("version/add", {
  major: latest.major,
  minor: latest.minor,
});
