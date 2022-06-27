https://gitlab-com.gitlab.io/support/toolbox/upgrade-path

# Upgrade Path

Generate supported upgrade paths to assist with updating GitLab.

# Adding a new supported path

Whenever a new release requires a minor version it current will need a manually modification.

Upgrade path is generate from the `upgrade-path.yml` in the root of the project.

## Update Upgrade Path

1. Edit the `upgrade-path.yml`
2. Add new entry

- major/minor
- optional `comments:`

Example:

```
- major: 12
  minor: 10
  comments: "**Migrations can take a long time!**"
```

## Merge Request

1. Open a new merge request cc/assign @davinwalker
