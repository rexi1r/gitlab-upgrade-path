https://gitlab-com.gitlab.io/support/toolbox/upgrade-path

# Upgrade Path

Generate supported upgrade paths to assist with updating GitLab.

# Goals

- Automatically Collect latest patch versions and latest minor version
- Show path between a selected starting and target version
- Include helpers to make upgrading easier. Installation commands, links to information, and etc

## Potentially

- Show deprecations and other needed action items
  - Ex: PostgreSQL 11 Upgrade, Legacy Storage depcrecation
- Show checkpoint steps

  - Database migrations
  - Repo Checks

- Guided workflow for upgrading
  - Preflight, deprecation
  - Upgrade process
  - Post Upgrade checks

# Adding a new supported path

Whenever a new release requires a minor version it current will need a manually modification.

Steps

1. Duplicate/create a new version file in `src/versions`
2. Update Major, Minor, and Blog release
