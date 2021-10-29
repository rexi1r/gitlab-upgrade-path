import flux from "@aust/react-flux";

flux.dispatch("version/add", {
  major: 13,
  minor: 1,
  blog: "https://about.gitlab.com/releases/2020/06/22/gitlab-13-1-released/",
});
