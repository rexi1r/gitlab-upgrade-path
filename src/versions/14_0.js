import flux from "@aust/react-flux";

flux.dispatch("version/add", {
  major: 14,
  minor: 0,
  blog: "https://about.gitlab.com/releases/2021/06/22/gitlab-14-0-released/",
  notes: "**Migrations can take a long time!**",
});
