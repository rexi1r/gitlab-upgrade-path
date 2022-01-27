import flux from "@aust/react-flux";

flux.dispatch("version/add", {
  major: 14,
  minor: 1,
  comments:
    "Note: 14.1 is not required when [fully updated on 14.0.x](https://docs.gitlab.com/ee/update/#1410)",
});
