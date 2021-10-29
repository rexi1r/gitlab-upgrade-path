import flux from "@aust/react-flux";

flux.dispatch("version/add", {
  major: 12,
  minor: 1,
  blog: "https://about.gitlab.com/releases/2019/07/22/gitlab-12-1-released/",
});
