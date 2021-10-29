import flux from "@aust/react-flux";

flux.dispatch("version/add", {
  major: 14,
  minor: 1,
  blog: "https://about.gitlab.com/releases/2021/07/28/gitlab-14-1-1-released/",
});
