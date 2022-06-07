https://gitlab-com.gitlab.io/support/toolbox/upgrade-path

# Upgrade Path

Generate supported upgrade paths to assist with updating GitLab.

# Adding a new supported path

Whenever a new release requires a minor version it current will need a manually modification.

## Version Files

1. Duplicate/create a new version file in `src/versions`
2. Update Major, Minor, and Blog release

Example version [file](https://gitlab.com/gitlab-com/support/toolbox/upgrade-path/-/blob/main/src/versions/14_0.js)

## Merge Request

1. Open a new merge request cc/assign @davinwalker

Great Example [merge request](https://gitlab.com/gitlab-com/support/toolbox/upgrade-path/-/merge_requests/3)
