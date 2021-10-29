import flux from "@aust/react-flux";

flux.dispatch("version/add", {
  major: 12,
  minor: 10,
  blog: "https://about.gitlab.com/releases/2020/04/22/gitlab-12-10-released/",
});
