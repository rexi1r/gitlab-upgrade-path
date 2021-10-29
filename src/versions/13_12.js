import flux from "@aust/react-flux";

flux.dispatch("version/add", {
  major: 13,
  minor: 12,
  blog: "https://about.gitlab.com/releases/2021/05/22/gitlab-13-12-released/",
});
