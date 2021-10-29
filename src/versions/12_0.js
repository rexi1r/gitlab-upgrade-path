import flux from "@aust/react-flux";

flux.dispatch("version/add", {
  major: 12,
  minor: 0,
  blog: "https://about.gitlab.com/releases/2019/06/22/gitlab-12-0-released/",
});
