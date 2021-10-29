import flux from "@aust/react-flux";

flux.dispatch("version/add", {
  major: 13,
  minor: 8,
  blog: "https://about.gitlab.com/releases/2021/01/22/gitlab-13-8-released/",
});
