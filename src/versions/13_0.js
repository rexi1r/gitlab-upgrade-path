import flux from "@aust/react-flux";

const notes = ``;

flux.dispatch("version/add", {
  major: 13,
  minor: 0,
  blog: "https://about.gitlab.com/releases/2020/05/22/gitlab-13-0-released/",
  notes: notes,
});
