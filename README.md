https://gitlab-com.gitlab.io/support/toolbox/upgrade-path

# Upgrade Path

Generate supported upgrade paths to assist with updating GitLab.

## API / Upgrade Data Points

There isn't an specific API, but there is an json artifact that can be downloaded.

```
https://gitlab-com.gitlab.io/support/toolbox/upgrade-path/path.json
```

```json
{"supported":["17.3.6","17.5.1"], "all":["16.7.10","16.11.10","17.3.6","17.5.1","17.5.1"]}
```

# Adding a new supported path

Upgrade path is generated from https://gitlab.com/gitlab-org/gitlab/-/raw/master/config/upgrade_path.yml.

## Update Upgrade Path

Follow the instruction from [adding a required stop](https://docs.gitlab.com/ee/development/avoiding_required_stops.html#adding-required-stops).

## Alerts

Alerts are things that potentially span different versions where actions may need to be taken. To add/edit alerts:

1. Edit the `alerts.yml`
2. Add a new entry

## Background Migrations

The tool now displays background database migrations that will run during upgrades, helping users understand:
- Which migrations will execute between versions
- Warnings for migrations affecting large tables
- Migration details including affected schemas and tables

### Data Generation
Background migration data is automatically collected from the GitLab repository:
```shell
bundle exec collect_background_migrations.rb
```
This generates `ruby/background_migrations.js` with migration metadata.

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


