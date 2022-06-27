import flux from "@aust/react-flux";

flux.dispatch("version/add", {
  major: 14,
  minor: 9,
  comments:
    "See [GitLab Issue #6795](https://gitlab.com/gitlab-org/omnibus-gitlab/-/issues/6795#note_926026956)",
});
