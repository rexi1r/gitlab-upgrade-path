https://gitlab-com.gitlab.io/support/toolbox/upgrade-path

# Upgrade Path

Generate supported upgrade paths to assist with updating GitLab.

# Adding a new supported path

Upgrade path is generated from https://gitlab.com/gitlab-org/gitlab/-/raw/master/config/upgrade_path.yml.

## Update Upgrade Path

Follow the instruction from [adding a requires top](https://docs.gitlab.com/ee/development/avoiding_required_stops.html#adding-required-stops). 

## Alerts

Alerts are things that potentially span different versions where actions may need to be taken. To add/edit alerts:

1. Edit the `alerts.yml`
2. Add a new entry

## Merge Request

1. Open a new merge request cc/assign @davinwalker

## Testing

1. With [asdf](https://asdf-vm.com/) installed, run `scripts/bootstrap.sh`.
1. Run `make` to build.
1. Run a local Web server:

    ```shell
    ruby -run -e httpd build -p 8000
    ```

1. Visit [http://localhost:8000](http://localhost:8000).


