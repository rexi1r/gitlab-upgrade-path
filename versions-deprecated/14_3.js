import flux from "@aust/react-flux";

flux.dispatch("version/add", {
  major: 14,
  minor: 3,
  comments:
    "See [GitLab Issue #354211](https://gitlab.com/gitlab-org/gitlab/-/issues/354211#note_962223568)",
});

